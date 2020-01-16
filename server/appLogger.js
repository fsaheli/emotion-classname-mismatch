const winston = require('winston');

winston.emitErrs = true;

const Logger = new winston.Logger({
  // Specify all required appenders

  transports: [
    new winston.transports.Console({
      timestamp: true,
      level: 'info',
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

Logger.stream = {
  write(message) {
    Logger.info(message);
  },
};

// AAllow for the modification of logging level
Logger.setLoggingLevel = level => {
  Logger.transports.console.level = level;
};

module.exports = Logger;
