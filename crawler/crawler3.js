var Crawler = require("crawler");
var cheerio = require("cheerio");
var fs = require('fs');

  var festival = new Crawler({
      maxConnections : 10,
      // This will be called for each crawled page
      callback : function (error, res, done) {
          if(error){
              console.log(error);
            }else{
                var $ = cheerio.load(res.body);

                var image_container = $('.pddetail');
                var image_url = image_container.children('h2').children('img').attr('src');
                var title_container = $('.pddetail').children('.pddetail_info').children('.pddetail_subject');
                var sub_info_container = $('.pddetail').children('.pddetail_info').children('.detaillist');

                var title = title_container.children('table').children('tbody').children('tr').children('td').children('span').eq(0).text();

                var sub_info = sub_info_container.children('table').children('tbody');

                var genre = sub_info.children('tr').eq(0).children('td').eq(1).children('a').eq(1).text();

                var date = sub_info.children('tr').eq(1).children('td').eq(1).text();
                date = date.replace(/(\s*)/gi, "");
                date = date.split('~');
                var start_date = date[0];
                start_date = start_date.replace(/\//gi, "-");
                var end_date = date[1];
                end_date = end_date.replace(/\//gi, "-");
                start_date = new Date(start_date).toISOString();
                end_date = new Date(end_date).toISOString();
                var location = sub_info.children('tr').eq(2).children('td').eq(1).children('a').text();

                //출연
                var star = sub_info.children('tr').eq(3).children('td').eq(1).text();
                star = star.trim();
                var star_check = sub_info.children('tr').eq(3).children('td').eq(1).children('a').text();

                if(star_check.length == 0){
                  star ="없음";
                }

                //정보
                var detail = $('.detail_contentsbox').children('p').text();

                if(detail.length == 0){
                  detail="없음";
                }

                console.log(title);
                console.log(genre);
                console.log(start_date);
                console.log(end_date);
                console.log(location);
                console.log(star);
                console.log(detail);

            }
            done();
        }
   });

festival.queue('http://www.playdb.co.kr/playdb/playdbDetail.asp?sReqPlayno=111677');
//festival.queue('http://www.playdb.co.kr/playdb/playdbDetail.asp?sReqPlayno=112431');
//festival.queue('http://www.playdb.co.kr/playdb/playdbDetail.asp?sReqPlayno=108377');
