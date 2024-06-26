import axios from 'axios';
import parser from '../parser.js';

export default function getData(url, onSuccess, onError) {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
    )
    .then((res) => {
      try {
        const data = parser(res.data.contents);
        onSuccess(data);
      } catch (err) {
        if (err.isParsingError) {
          onError('nonValidRss');
        } else {
          onError('unknownError');
        }
      }
    })
    .catch((err) => {
      if (err.isAxiosError) {
        onError('networkError');
      } else {
        onError('unknownError');
      }
    });
}
