import { injectMiddleware } from './middleware';
import * as express from 'express';

/**
 * <p>
 * 모듈의 비즈니스 로직을 담당하는 express server instance를 생성한다. <br/>
 * Grey-wolf에서는 기본적인 middleware만 추가한 server를 생성한다.<br/>
 * middleware: logger, body-parser, method-override, cross origin access
 * </p>
 * 
 * @param  {*} args Server 구성에 필요한 arguments
 * @param  {express.Router} routes api router
 * @returns {Promise<express.Application>} middleware가 추가된 기본적인 server instance
 */
export async function createServer(args, routes) {
  let app = express();

  injectMiddleware(app, args);

  app.use('/api', routes);

  app.use((req, res) => {
    res.status(404).send();
  });

  return app;
}