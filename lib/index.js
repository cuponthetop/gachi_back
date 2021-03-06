import * as firebase from 'firebase-admin';
import { createServer } from './server/create-server';
import { DBServiceBuilder } from './server/db-service-builder';
import { modelServiceBuilder } from './server/model-builder';
import { handlerServiceBuilder } from './server/controller-builder';

import { routingFunc } from './routes/all';
import { parser as argParser } from './util/argparse';
import * as _ from 'lodash';
import { InstantiateLogger, logger } from './util/logger';

const firebaseConfig = require('../config/firebase-service-config.json');
const dbConfig = require('../config/db-config.json');
const logConfig = require('../config/log-config.json');

export async function main(arg) {
  let args = null;

  if (arg) {
    args = arg;
  } else {
    args = argParser.parseArgs();
  }

  _.assign(args, dbConfig);
  _.assign(args, logConfig);

  InstantiateLogger(args);

  logger.info(`Starting Gachi with args: ${JSON.stringify(args)}`);

  let db = await DBServiceBuilder(args);
  _.assign(args, { dataService: db });

  _.assign(args, {
    firebaseService: firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
      databaseURL: "https://gachi-test.firebaseio.com"
    })
  });

  let model = await modelServiceBuilder(args);
  _.assign(args, model);

  let handler = await handlerServiceBuilder(args);
  _.assign(args, handler);

  let app = await createServer(args, routingFunc(args));

  let server = app.listen(args.port, () => {
    logger.info(`Gachi listening on port: ${args.port}`);
  });

  _.assign(server, { dataService: db });
  _.assign(server, model);
  _.assign(server, handler);

  return server;
}

if (require.main === module) {
  main(null);
}