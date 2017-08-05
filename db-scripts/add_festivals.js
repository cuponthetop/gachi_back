let rq = require('request-promise');
let _ = require('lodash');

const festivals = require('./festivals.1.json');
// const GACHI_URL = 'http://cuponthetop.com/gachi/api/v1/festival';
const GACHI_URL = 'http://localhost:3003/api/v1/festival';

let promises = _.map(festivals, function (el) {
  return rq({
    method: 'POST',
    uri: GACHI_URL,
    body: {
      title: el.name,
      from: el.start_date,
      until: el.end_date,
      imageURL: el.image,
      genre: el.genre,
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

