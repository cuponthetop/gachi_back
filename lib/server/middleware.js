import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import { getEndLogFormatter, getStartLogFormatter, getLogger } from '../util/logger';

/**
 * Cross Origin Resource Sharing(CORS)를 위한 설정
 * 
 */
function getAllowCrossDomain(logArgs) {
  let logger = getLogger('CORS', logArgs);

  return function (req, res, next) {
    try {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE,PATCH');
      res.header('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization, content-disposition');

      // need to respond 200 to OPTIONS
      if ('OPTIONS' === req.method) {
        res.sendStatus(200);
      } else {
        next();
      }
    } catch (err) {
      logger.error(`Unexpected error: ${err.stack}`);
      next();
    }
  };
}

/**
 * 패킷 로깅(HTTP req/res) / 크로스 오리진 액세스, 바디파서, 메서드오버라이드 등의 미들웨어 추가
 * 
 * @param  {Application} app 미들웨어가 추가될 Application
 * @param  {any} env 
 */
export function injectMiddleware(app, args) {

  let httpArgs = {
    host: args.lhost, port: args.lport,
    path: args.lpath,
  };

  // 패킷 로깅
  app.use(getEndLogFormatter(httpArgs));

  // 크로스 오리진 액세스
  app.use(getAllowCrossDomain(httpArgs));

  // 바디파서, 메서드오버라이드
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // 패킷 로깅
  app.use(getStartLogFormatter(httpArgs));

}