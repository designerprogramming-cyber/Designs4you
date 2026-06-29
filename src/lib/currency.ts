import { useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: { ar: string; en: string };
  name: { ar: string; en: string };
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  SAR: { code: 'SAR', symbol: { ar: 'ر.س', en: 'SAR' }, name: { ar: 'ريال سعودي', en: 'Saudi Riyal' } },
  AED: { code: 'AED', symbol: { ar: 'د.إ', en: 'AED' }, name: { ar: 'درهم إماراتي', en: 'UAE Dirham' } },
  KWD: { code: 'KWD', symbol: { ar: 'د.ك', en: 'KWD' }, name: { ar: 'دينار كويتي', en: 'Kuwaiti Dinar' } },
  QAR: { code: 'QAR', symbol: { ar: 'ر.ق', en: 'QAR' }, name: { ar: 'ريال قطري', en: 'Qatari Riyal' } },
  BHD: { code: 'BHD', symbol: { ar: 'د.ب', en: 'BHD' }, name: { ar: 'دينار بحريني', en: 'Bahraini Dinar' } },
  OMR: { code: 'OMR', symbol: { ar: 'ر.ع', en: 'OMR' }, name: { ar: 'ريال عماني', en: 'Omani Rial' } },
  EGP: { code: 'EGP', symbol: { ar: 'ج.م', en: 'EGP' }, name: { ar: 'جنيه مصري', en: 'Egyptian Pound' } },
  USD: { code: 'USD', symbol: { ar: '$', en: 'USD' }, name: { ar: 'دولار أمريكي', en: 'US Dollar' } }
};

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  SA: 'SAR',
  AE: 'AED',
  KW: 'KWD',
  QA: 'QAR',
  BH: 'BHD',
  OM: 'OMR',
  EG: 'EGP'
};

const RATES_CACHE_KEY = 'designs4you_exchange_rates';
const COUNTRY_CACHE_KEY = 'designs4you_visitor_country';

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1.0,
  SAR: 3.75,
  AED: 3.6725,
  KWD: 0.306,
  QAR: 3.64,
  BHD: 0.376,
  OMR: 0.384,
  EGP: 48.0
};

export async function fetchAndCacheExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Exchange rate response was not ok');
    const data = await response.json();
    if (data && data.rates) {
      const rates: Record<string, number> = {};
      Object.keys(DEFAULT_RATES).forEach(cur => {
        if (data.rates[cur]) {
          rates[cur] = data.rates[cur];
        } else {
          rates[cur] = DEFAULT_RATES[cur];
        }
      });
      const cacheData: CachedRates = {
        rates,
        timestamp: Date.now()
      };
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(cacheData));
      return rates;
    }
  } catch (error) {
    console.error('Failed to fetch live exchange rates, using fallback:', error);
  }
  
  const cached = localStorage.getItem(RATES_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as CachedRates;
      return parsed.rates;
    } catch (e) {
      // Ignore
    }
  }
  return DEFAULT_RATES;
}

export function getExchangeRates(): Record<string, number> {
  const cached = localStorage.getItem(RATES_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as CachedRates;
      const age = Date.now() - parsed.timestamp;
      if (age > 24 * 60 * 60 * 1000) {
        fetchAndCacheExchangeRates().catch(console.error);
      }
      return parsed.rates;
    } catch (e) {
      // Ignore
    }
  } else {
    fetchAndCacheExchangeRates().catch(console.error);
  }
  return DEFAULT_RATES;
}

export async function detectVisitorCountry(): Promise<string> {
  const cachedCountry = localStorage.getItem(COUNTRY_CACHE_KEY);
  if (cachedCountry) return cachedCountry;

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        const country = data.country_code.toUpperCase();
        localStorage.setItem(COUNTRY_CACHE_KEY, country);
        return country;
      }
    }
  } catch (e) {
    console.warn('ipapi.co lookup failed, trying fallback:', e);
  }

  try {
    const res = await fetch('https://ip-api.com/json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.countryCode) {
        const country = data.countryCode.toUpperCase();
        localStorage.setItem(COUNTRY_CACHE_KEY, country);
        return country;
      }
    }
  } catch (e) {
    console.warn('ip-api.com lookup failed:', e);
  }

  return 'OTH';
}

/**
 * Returns a converter function that takes a price in USD (base currency) and
 * converts it to the visitor's local currency if auto-conversion is enabled.
 */
export function useCurrency(enableAutoCurrency: boolean = true) {
  const [rates, setRates] = useState<Record<string, number>>(getExchangeRates);
  const [currencyCode, setCurrencyCode] = useState<string>('USD');

  useEffect(() => {
    // Sync current rates
    setRates(getExchangeRates());

    if (enableAutoCurrency) {
      detectVisitorCountry().then(country => {
        const cur = COUNTRY_TO_CURRENCY[country] || 'USD';
        setCurrencyCode(cur);
      }).catch(err => {
        console.error('Error detecting country:', err);
        setCurrencyCode('USD');
      });
    } else {
      setCurrencyCode('USD');
    }
  }, [enableAutoCurrency]);

  const convertPrice = (priceInUsd: number | string): {
    amount: string;
    currencyCode: string;
    symbol: { ar: string; en: string };
    name: { ar: string; en: string };
  } => {
    const numericPrice = typeof priceInUsd === 'number' ? priceInUsd : parseFloat(priceInUsd);
    
    if (isNaN(numericPrice)) {
      return {
        amount: String(priceInUsd),
        currencyCode: 'USD',
        symbol: CURRENCIES.USD.symbol,
        name: CURRENCIES.USD.name
      };
    }

    const targetCode = currencyCode && CURRENCIES[currencyCode] ? currencyCode : 'USD';
    const rate = rates[targetCode] || 1.0;
    const convertedAmount = numericPrice * rate;

    // Beautiful rounding: KWD/BHD/OMR have 3 decimals, others have 0 or 2
    let formattedAmount = '';
    if (targetCode === 'KWD' || targetCode === 'BHD' || targetCode === 'OMR') {
      formattedAmount = convertedAmount.toFixed(3);
    } else {
      formattedAmount = convertedAmount % 1 === 0 ? convertedAmount.toFixed(0) : convertedAmount.toFixed(2);
    }

    const curInfo = CURRENCIES[targetCode];

    return {
      amount: formattedAmount,
      currencyCode: targetCode,
      symbol: curInfo.symbol,
      name: curInfo.name
    };
  };

  return {
    convertPrice,
    currencyCode,
    currencyInfo: CURRENCIES[currencyCode] || CURRENCIES.USD
  };
}
