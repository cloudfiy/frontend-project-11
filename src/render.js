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

const createOrUpdateUlElement = (parentElement, classNameArray = []) => {
  let ulElement = parentElement.querySelector('ul');
  if (!ulElement) {
    ulElement = document.createElement('ul');
    ulElement.classList.add(
      'list-group',
      'border-0',
      'rounded-0',
      ...classNameArray,
    );
    parentElement.append(ulElement);
  } else {
    ulElement.replaceChildren();
  }
  return ulElement;
};

const renderFeeds = (state, i18n) => {
  const feeds = document.querySelector('.feeds');
  let feedsCard = feeds.querySelector('.card');

  if (!feedsCard) {
    feedsCard = renderCard(feeds, 'feeds', i18n);
  }

  const ulElement = createOrUpdateUlElement(feedsCard);

  while (ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }

  state.feeds.forEach((feed) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Element = document.createElement('h3');
    h3Element.classList.add('h6', 'm-0');
    h3Element.textContent = feed.feedTitle;

    const pElement = document.createElement('p');
    pElement.classList.add('m-0', 'small', 'text-black-50');
    pElement.textContent = feed.feedDescription;

    liElement.appendChild(h3Element);
    liElement.appendChild(pElement);

    ulElement.appendChild(liElement);
  });
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

  const ulElement = createOrUpdateUlElement(postsCard);

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
    const renderFuncs = {
      links: () => handleSuccess(i18n),
      error: () => handleError(current, i18n),
      feeds: () => renderFeeds(state, i18n),
      posts: () => renderPosts(state, i18n),
      currentOpen: () => renderModal(state),
      read: () => renderReadPosts(state.read),
    };

    const renderFunc = renderFuncs[path];
    if (renderFunc) renderFunc();
    else console.log('Unknown path');
  });

  return watchedState;
};

export default render;
