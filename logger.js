/* eslint-disable linebreak-style */
const env = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
const fs = require('fs');
const winston = require('winston');
const split = require('split');
const rTracer = require('cls-rtracer');
require('winston-daily-rotate-file');

global.rTracer = rTracer;
const logDir = 'Logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-result.log`,
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '3d',
});

const logger = winston.createLogger({
  level: env,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) => {
        const rid = rTracer.id();
        return rid
          ? `${info.timestamp} [request-id:${rid}]: ${info.level}: ${info.message}`
          : `${info.timestamp} ${info.level}: ${info.message}`;
      },
    ),
  ),

  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => {
            const rid = rTracer.id();
            return rid
              ? `${info.timestamp} [request-id:${rid}]: ${info.level}: ${info.message}`
              : `${info.timestamp} ${info.level}: ${info.message}`;
          },
        ),
      ),
    }),
    dailyRotateFileTransport,
  ],
});

logger.stream = split().on('data', (message) => {
  logger.info(message);
});


module.exports = logger;
