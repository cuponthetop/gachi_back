let rq = require('request-promise');
let _ = require('lodash');

const festivals = require('./festivals.json');
const GACHI_URL = 'http://cuponthetop.com/gachi/api/v1/festival';
// const GACHI_URL = 'http://localhost:3003/api/v1/festival';

function processGenre(genre) {
  return genre.replace(/R&B/g, '알앤비').split('/');
}

let promises = _.map(festivals, function (el) {
  return rq({
    method: 'POST',
    uri: GACHI_URL,
    body: {
      title: el.name,
      from: el.start_date,
      until: el.end_date,
      imageURL: el.image,
      genre: processGenre(el.genre),
      detail: el.detail,
      location: el.location,
    },
    json: true
  });
});

Promise.all(promises).then(() => {
  console.log('done')
}).catch((err) => {
  console.log(JSON.stringify(err));
});

