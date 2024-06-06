import onChange from 'on-change';

const render = (state) => {
  const watchedState = onChange(state, (path, current) => {
    switch (path) {
      case 'links':
        document.getElementById('url-input').classList.remove('is-invalid');
        document.querySelector('.feedback').textContent = '';
        break;
      case 'error':
        document.getElementById('url-input').classList.add('is-invalid');
        document.querySelector('.feedback').textContent = current;
        break;
      default:
        console.log('Unknown path');
    }
  });

  return watchedState;
};

export default render;
