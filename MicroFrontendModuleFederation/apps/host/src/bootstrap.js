import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const remoteLoader = {
  marketing: () => import('marketing/MarketingApp'),
  catalog: () => import('catalog/CatalogApp'),
  checkout: () => import('checkout/CheckoutApp'),
};

const mountRemote = async (scope, selector) => {
  const loadRemote = remoteLoader[scope];
  if (!loadRemote) {
    return;
  }

  try {
    const module = await loadRemote();
    const Component = module.default || module;
    const containerNode = document.querySelector(selector);
    if (containerNode) {
      createRoot(containerNode).render(<Component />);
    }
  } catch (error) {
    console.error(`Failed to mount ${scope}:`, error);
    const containerNode = document.querySelector(selector);
    if (containerNode) {
      containerNode.textContent = `Failed to load ${scope}: ${error.message}`;
    }
  }
};

createRoot(document.getElementById('root')).render(<App />);

window.mountRemote = mountRemote;
