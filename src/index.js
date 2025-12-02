import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import App from './Componentes/App/App';
import MediaContextProvider from './Context/MediaStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                // Show update notification
                toast.info('🆕 New version available! Refresh to update.', {
                  action: {
                    label: 'Refresh',
                    onClick: () => {
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      setTimeout(() => window.location.reload(), 0);
                    }
                  },
                  autoClose: false
                });
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker controller changed');
      });
    });

    // Handle offline/online events
    window.addEventListener('offline', () => {
      toast.warning('⚠️ You are offline. App will use cached data.', {
        autoClose: false
      });
    });

    window.addEventListener('online', () => {
      toast.success('✅ You are back online!');
    });
  }
}

root.render(
  <React.StrictMode>
    <MediaContextProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </MediaContextProvider>
  </React.StrictMode>
);

registerServiceWorker();

reportWebVitals();