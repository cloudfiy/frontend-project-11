import * as yup from 'yup';
import render from './render.js';
import initializeI18next from './i18n.js';

const makeSchema = (links) => {
  const schema = yup.string().url().notOneOf(links);
  return schema;
};

export default function app() {
  initializeI18next()
    .then((i18nextInstance) => {
      yup.setLocale({
        mixed: {
          default: i18nextInstance.t('alreadyExists'),
          notOneOf: i18nextInstance.t('alreadyExists'),
        },
        string: {
          url: i18nextInstance.t('invalidUrl'),
        },
      });

      const state = {
        links: [],
        error: null,
      };

      const watchedState = render(state, i18nextInstance);

      const formElement = document.querySelector('.rss-form');

      formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');

        const schema = makeSchema(state.links);

        schema
          .validate(url)
          .then((validateUrl) => {
            watchedState.links.push(validateUrl);
            state.error = null;
          })
          .catch((err) => {
            const [currentError] = err.errors;
            watchedState.error = currentError;
          });
      });
    })
    .catch((err) => {
      console.error('Initialization failed:', err);
    });
}
