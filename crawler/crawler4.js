var Crawler = require("crawler");
var cheerio = require("cheerio");
var fs = require('fs');

//exports.do = function crawler_all () {
//전연 객체
var total_info = {
  page_numbers: 0,//page_numbers 변수는 크롤링 해야할 페이지 수, number_crawler의 수행을 통해 알 수 있다.
  cnt: 0,//데이터 갯수 측정을 위한 변수
  festivals:[],
  image_url:[],
  image:[],
  cnt2: 0,
};

//크롤링 해야할 페이지 수를 알아내는 함수
var number_crawler = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = cheerio.load(res.body);

            var container1 = $('.container1');
            var container2 = container1.children('table').children('tbody').children('tr').eq(9);
            var container3 = container2.children('td').children('table').children('tbody');

            var number_box = container3.children('tr').eq(34);

            var number = number_box.children('td').text();

            number = number.replace(/total/gi, "");//total 제거
            number = number.replace(/(\s*)/gi, "");//공백제거

            //[]대괄호 안의 문자열 추출
            number = number.match(/\[.*\]/gi);
            number += "";
            number = number.split("[").join("");
            number = number.split("]").join("");

            //'/'으로 문자열 분리
            var number_array = number.split('/');

            page_numbers = parseInt(number_array[1]);//크롤링해야할 페이지수
            total_info.page_numbers = page_numbers;//전역 변수에 page_number를 넣는다.

            }
        done(fest());//페이지 갯수 측정이 끝나면 fest함수를 실행시킨다.
    }
});

//number_crawler가 수집할 페이지
number_crawler.queue([
  'http://www.playdb.co.kr/playdb/playdblist.asp?Page=1&sReqMainCategory=000003&sReqSubCategory=&sReqDistrict=&sReqTab=4&sPlayType=3&sStartYear=&sSelectType=3',
]);

function image_crawler(){
  var image = new Crawler({
      maxConnections : 10,
      // This will be called for each crawled page
      callback : function (error, res, done) {
          if(error){
              console.log(error);
            }else{
                var $ = cheerio.load(res.body);

                var container = $('.pddetail');
                var image_url = container.children('h2').children('img').attr('src');

                total_info.cnt2 = total_info.cnt2 + 1;

                total_info.image.push(image_url);

                if(total_info.cnt2 == total_info.page_numbers*15){
                  festival_json();
                }

            }
            done();
        }
   });

// Queue just one URL, with default callback
image.queue(total_info.image_url);
}


function fest(){

    var festival_crawler = new Crawler({
        maxConnections : 30,

        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = cheerio.load(res.body);

                  var container1 = $('.container1');
                  var container2 = container1.children('table').children('tbody').children('tr').eq(9);
                  var container3 = container2.children('td').children('table').children('tbody');

                  var boxes_before = container3.children();
                  var boxes_after = [];

                  //2의 배수로 데이터가 담겨있다. 한페이지에 총 15개
                  for(var i=2; i<31; i+=2){
                      boxes_after.push(boxes_before.eq(i));
                  }

                  for(var i=0; i<15; i++){
                      var box = boxes_after[i].children('td').children('table').children('tbody').children('tr').children('td').children('table').children('tbody').children('tr');

//                      var image = box.children('td').eq(0).children('table').children('tbody').children('tr').children('td').children('div').children('img').attr('src');
                      var image_url = box.children('td').eq(0).children('table').children('tbody').children('tr').children('td').children('div').children('img').attr('onclick');
                      image_url = image_url.replace(/'/gi,"");//따옴표 제거
                      image_url = image_url.replace(/goDetail/gi,"");//goDetail제거
                      image_url = image_url.replace(/\(/gi,"");//(제거
                      image_url = image_url.replace(/\)/gi,"");//)제거
                      total_info.image_url.push('http://www.playdb.co.kr/playdb/playdbDetail.asp?sReqPlayno='+image_url);

                      var box_text = box.children('td').eq(2).children('table').children('tbody');

                      var name = box_text.children('tr').eq(0).children('td').children('b').children('font').children('a').text();
                      name = name.trim();
                      //playDB의 정보에서 공연명뒤에 공백이 항상 붙어있다. ex)"싸이 콘서트 "
                      //trim()을 사용해서 뒤의 공백을 제거하였다.

                      var sub_info = box_text.children('tr').eq(1).children('td').text();

                      sub_info = sub_info.replace(/\t/gi, ""); //탭 제거
                      sub_info = sub_info.replace(/세부장르/gi, "");//세부 장르 제거
                      sub_info = sub_info.replace(/:/gi, "");//:제거
                      sub_info = sub_info.replace(/\n/gi, "");//줄바꿈 제거
//                      sub_info = sub_info.replace(/(\s*)/gi, "");//공백제거
                      sub_info = sub_info.replace(/출연/gi, "장소");

                      var array1 = sub_info.split('일시');
                      var array2 = array1[1].split('장소');

                      var genre = array1[0].trim();//trim() 문자열 앞 뒤 공백제거

                      var date = array2[0];
                      date = date.split('~');
                      var start_date = date[0];
                      start_date = start_date.replace(/\./gi, "-");
                      var end_date = date[1];
                      end_date = end_date.replace(/\./gi, "-");
                      start_date = new Date(start_date);
                      end_date = new Date(end_date);

                      var location = array2[1].trim();//trim() 문자열 앞 뒤 공백제거
/*
                      console.log(name);
                      console.log(total_info.image_url);//
                      console.log(genre);
                      console.log(start_date);
                      console.log(end_date);
                      console.log(location);
                      total_info.cnt = total_info.cnt + 1;
                      console.log("한 페이지에서 "+(i+1)+"번째");
                      console.log("전체에서 "+total_info.cnt+"번째");
                      console.log("");
*/
                      total_info.cnt = total_info.cnt + 1;

                      total_info.festivals.push({
                        'name': name,
                        'image': "",
                        'genre': genre,
                        'start_date': start_date,
                        'end_date': end_date,
                        'location': location,
                      });

                      if(total_info.cnt == total_info.page_numbers*15){
                        image_crawler();
                        //festival_json();
                      }

                    }
                }
            done();
        }
    });

    var page_queue = [];

    for(var i=1; i<=total_info.page_numbers; i++){
      page_queue.push('http://www.playdb.co.kr/playdb/playdblist.asp?Page='+i+'&sReqMainCategory=000003&sReqSubCategory=&sReqDistrict=&sReqTab=4&sPlayType=3&sStartYear=&sSelectType=3');
    }

    //festival_crawler.queue(page_queue);
    festival_crawler.queue(page_queue);
}

function festival_json(){


  for(var i=1; i<total_info.festivals.length; i++){
    total_info.festivals[i].image = total_info.image[i];
  }


  console.log(total_info.festivals.length);
  console.log(total_info.image.length);
  var festival_json = JSON.stringify(total_info.festivals);

  //json 파일 작성
  fs.writeFile("./festival.json", festival_json, 'utf8', function(err){
    if (err) {
      return console.log(err);
    }
  console.log('완료');
  });

  console.log(festival_json);
  return festival_json;
}
//}
