let rq = require('request-promise');

export async function retrieveImage(url) {
  try {
    let res = await rq(url, {
      encoding: null
    });

    return res;
  } catch (e) {
    return null;
  }
};