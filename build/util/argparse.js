'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = undefined;

var _argparse = require('argparse');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var pkgObj = require('../../../package.json');

var args = [[['-p', '--port'], {
  defaultValue: 3003,
  required: false,
  type: 'int',
  example: '3003',
  help: 'port to listen on',
  dest: 'port'
}], [['-isHTTP', '--logHost'], {
  defaultValue: false,
  required: false,
  help: 'Is using http logging',
  dest: 'isHTTP',
  action: 'storeTrue'
}], [['-lhost', '--logHost'], {
  defaultValue: '172.20.64.61',
  required: false,
  example: '172.20.64.61',
  help: 'Hostname for remote log store',
  dest: 'lhost'
}], [['-lport', '--logPort'], {
  defaultValue: 80,
  required: false,
  example: 80,
  help: 'Port number for remote log store',
  dest: 'lport'
}], [['-lpath', '--logPath'], {
  defaultValue: 'log',
  required: false,
  example: 'log',
  help: 'Additional path for the log storage endpoint',
  dest: 'lpath'
}], [['-llabel', '--logLabel'], {
  defaultValue: 'Gachi',
  required: false,
  example: 'Gachi',
  help: 'Label for log stored from this instance',
  dest: 'llabel'
}], [['-dburi', '--DBUri'], {
  defaultValue: 'couchbase://localhost/',
  required: false,
  example: 'couchbase://localhost/',
  help: 'URI string for Database',
  dest: 'DBUri'
}]];

var parser = exports.parser = new _argparse.ArgumentParser({
  version: pkgObj.version, addHelp: true,
  description: 'A project management server for Report System.'
});

_.forEach(args, function (arg) {
  parser.addArgument(arg[0], arg[1]);
});
//# sourceMappingURL=argparse.js.map
