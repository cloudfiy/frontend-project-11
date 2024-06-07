import onChange from 'on-change';

const render = (state, i18n) => {
  const watchedState = onChange(state, (path, current) => {
    const input = document.getElementById('url-input');
    const form = document.querySelector('.rss-form');
    const feedback = document.querySelector('.feedback');

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
      default:
        console.log('Unknown path');
    }
  });

  return watchedState;
};

export default render;
