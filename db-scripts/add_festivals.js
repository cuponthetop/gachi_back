let rq = require('request-promise');
let _ = require('lodash');
let asyncmap = require('asyncmap');

const festivals = require('./festivals.json');
const GACHI_URL = 'localhost:3003/api/v1/festival';

let promise = _.map(festivals, function (el) {
  return rq(GACHI_URL, {
    title: el.name,
    from: el.start_date,
    until: el.end_date,
    imageURL: el.image,
    genre: el.genre,
    detail: el.detail,
    location: el.location,
  });
});

Promise.all(promises).then(() => {
  console.log('done')
}).catch((err) => {
  console.log(JSON.stringify(err));
});

