import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/.netlify/functions/admin-api')) {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const { getApps, initializeApp } = await import('firebase-admin/app');
                const { getFirestore } = await import('firebase-admin/firestore');

                const databaseId = "ai-studio-designs4youservi-bc63936a-d08e-4c8e-a3e4-e0a9405b9804";
                const projectId = "alpine-direction-h9nlt";

                const apps = getApps();
                let app;
                if (!apps.length) {
                  app = initializeApp({
                    projectId: projectId
                  });
                } else {
                  app = apps[0];
                }
                const db = getFirestore(app, databaseId);

                const parsed = JSON.parse(body || '{}');
                const { action, collectionName, docId, data, config } = parsed;

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

                if (req.method === 'OPTIONS') {
                  res.end('');
                  return;
                }

                if (action === 'setDoc') {
                  const merge = parsed.merge === true;
                  await db.collection(collectionName).doc(docId).set(data, { merge });
                  res.end(JSON.stringify({ success: true }));
                  return;
                }
                if (action === 'deleteDoc') {
                  await db.collection(collectionName).doc(docId).delete();
                  res.end(JSON.stringify({ success: true }));
                  return;
                }
                if (action === 'updateDoc') {
                  await db.collection(collectionName).doc(docId).update(data);
                  res.end(JSON.stringify({ success: true }));
                  return;
                }
                if (action === 'syncConfig') {
                  if (config.settings) {
                    await db.collection('config').doc('settings').set({ settings: config.settings });
                  }

                  const syncCollection = async (colName: string, items: any[]) => {
                    if (!items) return;
                    const snapshot = await db.collection(colName).get();
                    const batch = db.batch();
                    snapshot.docs.forEach(doc => batch.delete(doc.ref));
                    items.forEach((item, index) => {
                      const docRef = db.collection(colName).doc(item.id);
                      const { id, ...rest } = { ...item, order: index };
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

                  res.end(JSON.stringify({ success: true }));
                  return;
                }

                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Unknown action' }));
              } catch (e: any) {
                console.error('Local admin-api middleware error:', e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message || 'Internal server error' }));
              }
            });
          } else {
            next();
          }
        });
      }
    },
  };
});
