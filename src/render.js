import onChange from 'on-change';

const handleSuccess = (i18n) => {
  const input = document.getElementById('url-input');
  const form = document.querySelector('.rss-form');
  const feedback = document.querySelector('.feedback');

  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('success');
  form.reset();
  input.focus();
};

const handleError = (current, i18n) => {
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18n.t(current);
};

const renderCard = (container, title, i18n) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t(`${title}Title`);

  cardBody.append(cardTitle);
  card.append(cardBody);

  container.append(card);

  return card;
};

const renderFeeds = (state, i18n) => {
  const feeds = document.querySelector('.feeds');
  let feedsCard = feeds.querySelector('.card');
  if (!feedsCard) {
    feedsCard = renderCard(feeds, 'feeds', i18n);
  }

  let ulElement = feedsCard.querySelector('ul');

  if (!ulElement) {
    ulElement = document.createElement('ul');
    ulElement.classList.add('list-group', 'border-0', 'rounded-0');
    feedsCard.append(ulElement);
  } else {
    ulElement.innerHTML = '';
  }

  const feedsItems = state.feeds
    .map(
      (feed) => `
    <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.feedTitle}</h3>
    <p class="m-0 small text-black-50">${feed.feedDescription}</p>
    </li>
    `,
    )
    .join('');
  ulElement.innerHTML = feedsItems;
};

const createPostListItem = (post) => {
  const liElement = document.createElement('li');
  liElement.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.href = post.link;
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.dataset.id = post.id;
  link.innerText = post.title;
  liElement.append(link);

  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.dataset.id = post.id;
  btn.dataset.bsToggle = 'modal';
  btn.dataset.bsTarget = '#modal';
  btn.textContent = 'Просмотр';
  liElement.append(btn);

  return liElement;
};

const renderPostList = (posts, ulElement) => {
  const postsItems = posts.map(createPostListItem);
  ulElement.replaceChildren(...postsItems);
};

const renderPosts = (state, i18n) => {
  const posts = document.querySelector('.posts');
  let postsCard = posts.querySelector('.card');
  if (!postsCard) {
    postsCard = renderCard(posts, 'posts', i18n);
  }

  let ulElement = postsCard.querySelector('ul');
  if (!ulElement) {
    ulElement = document.createElement('ul');
    ulElement.classList.add('list-group', 'border-0', 'rounded-0');
    postsCard.append(ulElement);
  } else {
    ulElement.innerHTML = '';
  }

  renderPostList(state.posts, ulElement);
};

const renderModal = (state) => {
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = state.currentOpen.title;

  const modalBody = modal.querySelector('.modal-body');
  modalBody.textContent = state.currentOpen.description;

  const postLink = modal.querySelector('a');
  postLink.href = state.currentOpen.link;
};

const renderReadPosts = (readPostsId) => {
  readPostsId.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
    link.classList.add('link-secondary');
  });
};

const render = (state, i18n) => {
  const watchedState = onChange(state, (path, current) => {
    switch (path) {
      case 'links':
        handleSuccess(i18n);
        break;
      case 'error':
        handleError(current, i18n);
        break;
      case 'feeds': {
        renderFeeds(state, i18n);
        break;
      }
      case 'posts': {
        renderPosts(state, i18n);
        break;
      }
      case 'currentOpen': {
        renderModal(state);
        break;
      }
      case 'read': {
        renderReadPosts(state.read);
        break;
      }
      default:
        console.log('Unknown path');
    }
  });

  return watchedState;
};

export default render;
