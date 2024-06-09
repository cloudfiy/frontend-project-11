import onChange from 'on-change';

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

const renderFeeds = (feeds, container) => {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');

  const feedsItems = feeds
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

  container.append(ulElement);
};

const renderPosts = (posts, container) => {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');
  const postsItems = posts.map((post) => {
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
  });

  ulElement.append(...postsItems);
  container.append(ulElement);
};

const render = (state, i18n) => {
  const watchedState = onChange(state, (path, current) => {
    const input = document.getElementById('url-input');
    const form = document.querySelector('.rss-form');
    const feedback = document.querySelector('.feedback');
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');

    switch (path) {
      case 'links':
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
        form.reset();
        input.focus();
        break;
      case 'error':
        input.classList.add('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t(current);
        break;
      case 'feeds': {
        let feedsCard = feeds.querySelector('.card');
        if (!feedsCard) {
          feedsCard = renderCard(feeds, 'feeds', i18n);
        }
        renderFeeds(state.feeds, feedsCard);
        break;
      }
      case 'posts': {
        let postsCard = posts.querySelector('.card');
        if (!postsCard) {
          postsCard = renderCard(posts, 'posts', i18n);
        }
        renderPosts(state.posts, postsCard);
        break;
      }
      default:
        console.log('Unknown path');
    }
  });

  return watchedState;
};

export default render;
