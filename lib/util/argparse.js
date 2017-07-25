import { ArgumentParser } from 'argparse';
import * as _ from 'lodash';
let pkgObj = require('../../package.json');

const args = [
  [
    ['-p', '--port'],
    {
      defaultValue: 3003,
      required: false,
      type: 'int',
      example: '3003',
      help: 'port to listen on',
      dest: 'port',
    }
  ],
];

export var parser = new ArgumentParser({
  version: pkgObj.version,  addHelp: true,
  description: 'A project management server for Report System.'
});

_.forEach(args, (arg) => {
  parser.addArgument(arg[0], arg[1]);
});