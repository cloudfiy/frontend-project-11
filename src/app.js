import * as yup from 'yup';
import render from './render.js';

const makeSchema = (links) => {
  const schema = yup.string().url().notOneOf(links);
  return schema;
};

export default function app() {
  const state = {
    links: [],
    error: null,
  };

  const watchedState = render(state);

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
        state.errors = null;
      })
      .catch((err) => {
        const [currentError] = err.errors;
        watchedState.error = currentError;
      });
  });
}
