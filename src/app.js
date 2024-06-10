import * as yup from 'yup';
import _ from 'lodash';
import render from './render.js';
import initializeI18next from './i18n.js';
import getData from './services/getData.js';

const makeSchema = (links) => {
  const schema = yup.string().url().notOneOf(links);
  return schema;
};
const fetchData = (link, state) => new Promise((resolve, reject) => {
  getData(
    link,
    ({ posts }) => {
      const newPosts = posts
        .filter(
          (post) => !state.posts.some(
            (existingPost) => existingPost.title === post.title,
          ),
        )
        .map((post) => ({ id: _.uniqueId(), ...post }));

      resolve(newPosts);
    },
    (err) => {
      console.log(err);
      reject(err);
    },
  );
});

const updatePosts = (newPosts, watchedState) => {
  const flattenedPosts = newPosts.flat();
  if (flattenedPosts.length > 0) {
    watchedState.posts.unshift(...flattenedPosts);
  }
};

const updateData = (links, state, watchedState) => {
  setTimeout(() => {
    const promises = links.map((link) => fetchData(link, state));

    Promise.all(promises)
      .then((allNewPosts) => {
        updatePosts(allNewPosts, watchedState);
        updateData(links, state, watchedState);
      })
      .catch((err) => {
        console.log(err);
        updateData(links, state, watchedState);
      });
  }, 5000);
};

const handleModal = (e, watchedState, state) => {
  const btn = e.relatedTarget;
  const postId = btn.getAttribute('data-id');
  const curPost = state.posts.find((post) => post.id === postId);
  if (!state.read.includes(postId)) {
    watchedState.read.push(postId);
  }

  return curPost;
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
        feeds: [],
        posts: [],
        read: [],
        currentOpen: null,
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
            getData(
              validateUrl,
              (data) => {
                watchedState.links.push(validateUrl);
                state.error = null;
                const newPosts = data.posts.map((post) => ({
                  id: _.uniqueId(),
                  ...post,
                }));
                watchedState.feeds.push(...data.feeds);
                watchedState.posts.unshift(...newPosts);
              },
              (errorMessage) => {
                watchedState.error = errorMessage;
              },
            );
          })
          .catch((err) => {
            const [currentError] = err.errors;
            watchedState.error = currentError;
          });
      });

      const modal = document.getElementById('modal');
      modal.addEventListener('show.bs.modal', (e) => {
        const curPost = handleModal(e, watchedState, state);
        watchedState.currentOpen = curPost;
      });

      updateData(state.links, state, watchedState);
    })
    .catch((err) => {
      console.error('Initialization failed:', err);
    });
}
