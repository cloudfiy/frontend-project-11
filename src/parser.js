function parser(data) {
  const parse = new DOMParser();
  const xmlDoc = parse.parseFromString(data, 'text/xml');
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.message = 'invalid RSS';
    error.isParsingError = true;
    throw error;
  }
  const feedTitle = xmlDoc.querySelector('channel > title').textContent;
  const feedDescription = xmlDoc.querySelector(
    'channel> description',
  ).textContent;
  const items = Array.from(xmlDoc.querySelectorAll('channel > item'));
  const posts = items.map((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    return { title, description, link };
  });
  return { feeds: [{ feedTitle, feedDescription }], posts };
}

export default parser;
