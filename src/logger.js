const winston = require('winston');
const dateformat = require('dateformat');
const chalk = require('chalk');
const path = require('path');
const fsUtils = require('./fs-utils');

const logDirectory = fsUtils.createDirectory(path.join(__dirname, '../logs'));

const logger = new winston.Logger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      timestamp() {
        return dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l');
      },
      formatter(options) {
        const message = options.message || '';

        let level = options.level.toUpperCase();
        switch (level) {
          case 'INFO':
            level = chalk.cyan(level);
            break;

          case 'WARN':
            level = chalk.yellow(level);
            break;

          case 'ERROR':
            level = chalk.red(level);
            break;

          default:
            break;
        }

        return `[${options.timestamp()}][${level}] ${message}`;
      }
    }),
    new winston.transports.File({ filename: path.join(logDirectory, 'scrapper.log') })
  ]
});

module.exports = logger;
