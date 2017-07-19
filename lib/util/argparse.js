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
  [
    ['-isHTTP'],
    {
      defaultValue: false,
      required: false,
      help: 'Is using http logging',
      dest: 'isHTTP',
      action: 'storeTrue'
    }
  ],
  [
    ['-lhost', '--logHost'],
    {
      defaultValue: '172.20.64.61',
      required: false,
      example: '172.20.64.61',
      help: 'Hostname for remote log store',
      dest: 'lhost',
    }
  ],

  [
    ['-lport', '--logPort'],
    {
      defaultValue: 80,
      required: false,
      example: 80,
      help: 'Port number for remote log store',
      dest: 'lport',
    }
  ],

  [
    ['-lpath', '--logPath'],
    {
      defaultValue: 'log',
      required: false,
      example: 'log',
      help: 'Additional path for the log storage endpoint',
      dest: 'lpath',
    }
  ],
  [
    ['-llabel', '--logLabel'],
    {
      defaultValue: 'Gachi',
      required: false,
      example: 'Gachi',
      help: 'Label for log stored from this instance',
      dest: 'llabel',
    }
  ],
  [
    ['-dbhost'],
    {
      defaultValue: 'localhost',
      required: false,
      example: 'localhost',
      help: 'Host for Database',
      dest: 'dbhost',
    }
  ],
  [
    ['-dbuser'],
    {
      defaultValue: 'user',
      required: false,
      example: 'user',
      help: 'Username for Database',
      dest: 'dbuser',
    }
  ],
  [
    ['-dbpassword'],
    {
      required: true,
      example: 'dbpassword',
      help: 'Password for Given Database User',
      dest: 'dbpassword',
    }
  ],
  [
    ['-dbname'],
    {
      defaultValue: 'gachi',
      required: false,
      example: 'gachi',
      help: 'Name for Database',
      dest: 'dbname',
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