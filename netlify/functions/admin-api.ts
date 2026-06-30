import { Handler } from '@netlify/functions';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const databaseId = "ai-studio-designs4youservi-bc63936a-d08e-4c8e-a3e4-e0a9405b9804";
const projectId = "alpine-direction-h9nlt";

const apps = getApps();
let app;
if (!apps.length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountEnv) {
    try {
      const serviceAccount = JSON.parse(serviceAccountEnv);
      app = initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (e) {
      console.error("Failed to initialize firebase-admin using service account, falling back:", e);
      app = initializeApp({
        projectId: projectId
      });
    }
  } else {
    app = initializeApp({
      projectId: projectId
    });
  }
} else {
  app = apps[0];
}

const db = getFirestore(app, databaseId);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, collectionName, docId, data, config } = body;

    if (action === 'setDoc') {
      if (!collectionName || !docId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing collectionName or docId' }) };
      }
      const merge = body.merge === true;
      await db.collection(collectionName).doc(docId).set(data, { merge });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (action === 'deleteDoc') {
      if (!collectionName || !docId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing collectionName or docId' }) };
      }
      await db.collection(collectionName).doc(docId).delete();
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (action === 'updateDoc') {
      if (!collectionName || !docId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing collectionName or docId' }) };
      }
      await db.collection(collectionName).doc(docId).update(data);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    if (action === 'syncConfig') {
      if (!config) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing config parameter' }) };
      }

      // Sync settings document
      if (config.settings) {
        await db.collection('config').doc('settings').set({ settings: config.settings });
      }

      // Sequential batch synchronization helper
      const syncCollection = async (colName: string, items: any[], mapItem?: (item: any, idx: number) => any) => {
        if (!items) return;
        const snapshot = await db.collection(colName).get();
        const batch = db.batch();
        
        // Delete all existing documents in this collection
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        
        // Add new documents
        items.forEach((item, index) => {
          const docRef = db.collection(colName).doc(item.id);
          const mapped = mapItem ? mapItem(item, index) : { ...item, order: index };
          const { id, ...rest } = mapped;
          batch.set(docRef, rest);
        });
        
        await batch.commit();
      };

      await syncCollection('services', config.services);
      await syncCollection('portfolio', config.portfolio);
      await syncCollection('videos', config.videos);
      await syncCollection('reviews', config.reviews);
      await syncCollection('faqs', config.faqs);
      await syncCollection('announcements', config.announcements);
      await syncCollection('banners', config.banners);
      await syncCollection('pricingList', config.pricingList);

      if (config.musicTracks) {
        await syncCollection('musicTracks', config.musicTracks);
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Unknown action: ${action}` })
    };

  } catch (error: any) {
    console.error('Netlify Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
