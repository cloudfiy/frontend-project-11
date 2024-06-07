import i18n from 'i18next';
import resources from './locales/index.js';

function initializeI18next() {
  const i18nextInstance = i18n.createInstance();
  return i18nextInstance
    .init({
      fallbackLng: 'ru',
      debug: true,
      resources,
    })
    .then(() => i18nextInstance);
}

export default initializeI18next;
