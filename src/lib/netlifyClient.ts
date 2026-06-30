/**
 * Client for communicating with the Netlify admin-api Function.
 * Bypasses direct-to-Firestore writes from the browser.
 */
export async function callNetlifyAdminApi(payload: {
  action: 'setDoc' | 'deleteDoc' | 'updateDoc' | 'syncConfig';
  collectionName?: string;
  docId?: string;
  data?: any;
  config?: any;
  merge?: boolean;
}): Promise<any> {
  const response = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}
