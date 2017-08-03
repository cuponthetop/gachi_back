var crawler = require('./crawler');

var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * *', function() {
//* 6개의 의미
//초 0-59 분 0-59 시 0-23 일 1-31 월 0-11 일주일 0-6
  crawler.do();
  //console.log('You will see this message every second');
},
  true,
  'Asia/Seoul'
);
