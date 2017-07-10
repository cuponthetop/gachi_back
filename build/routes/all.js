'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routingFunc = routingFunc;

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _user = require('./v1/user');

var _match = require('./v1/match');

var _festival = require('./v1/festival');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import { AccessController } from '../controller/access';

function routingFunc(args) {

  var routes = express();

  // let accessCtrl = args.accessCtrl;

  routes.use('/v1', accessCtrl.doAuth.bind(accessCtrl));

  // every route requires auth
  routes.use('/v1/user', (0, _user.routingFunc)(args));

  routes.use('/v1/match', (0, _match.routingFunc)(args));

  routes.use('/v1/festival', (0, _festival.routingFunc)(args));

  return routes;
}
//# sourceMappingURL=all.js.map
