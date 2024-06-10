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

const updatePosts = (newPosts, view) => {
  const flattenedPosts = newPosts.flat();
  if (flattenedPosts.length > 0) {
    view.posts.unshift(...flattenedPosts);
  }
};

const handleClickOnLinks = (view, state) => {
  const container = document.querySelector('.flex-grow-1');

  container.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-id]');
    if (link) {
      const linkId = link.getAttribute('data-id');
      if (!state.read.includes(linkId)) {
        view.read.push(linkId);
      }
    }
  });
};

const updateData = (links, state, view) => {
  setTimeout(() => {
    const promises = links.map((link) => fetchData(link, state));

    Promise.all(promises)
      .then((allNewPosts) => {
        updatePosts(allNewPosts, view);
        updateData(links, state, view);
      })
      .catch((err) => {
        console.log(err);
        updateData(links, state, view);
      });
  }, 5000);
};

const handleModal = (e, view, state) => {
  const btn = e.relatedTarget;
  const postId = btn.getAttribute('data-id');
  const curPost = state.posts.find((post) => post.id === postId);
  if (!state.read.includes(postId)) {
    view.read.push(postId);
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

      const view = render(state, i18nextInstance);

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
                view.links.push(validateUrl);
                state.error = null;
                const newPosts = data.posts.map((post) => ({
                  id: _.uniqueId(),
                  ...post,
                }));
                view.feeds.push(...data.feeds);
                view.posts.unshift(...newPosts);
              },
              (errorMessage) => {
                view.error = errorMessage;
              },
            );
          })
          .catch((err) => {
            const [currentError] = err.errors;
            view.error = currentError;
          });
      });

      const modal = document.getElementById('modal');
      modal.addEventListener('show.bs.modal', (e) => {
        const curPost = handleModal(e, view, state);
        view.currentOpen = curPost;
      });
      handleClickOnLinks(view, state);
      updateData(state.links, state, view);
    })
    .catch((err) => {
      console.error('Initialization failed:', err);
    });
}
