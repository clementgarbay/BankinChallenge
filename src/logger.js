const winston = require('winston');
const dateformat = require('dateformat');
const chalk = require('chalk');

const logger = new winston.Logger({
  level: 'info',
  transports: [
    // https://gist.github.com/michaelneu/867e31b47b4ec5810b5d26e6aacd5e2b
    new winston.transports.Console({
      timestamp() {
        return dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l');
      },
      formatter(options) {
        let message = '';

        if (options.message !== undefined) {
          message = options.message;
        }

        let meta = '';

        if (options.meta && Object.keys(options.meta).length) {
          meta = `\n\t${JSON.stringify(options.meta)}`;
        }

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

        const output = [`[${options.timestamp()}][${level}]`, message, meta];

        return output.join(' ');
      }
    }),
    new winston.transports.File({ filename: 'logs/scrapper.log' })
  ]
});

module.exports = logger;
