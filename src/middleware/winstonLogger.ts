const winston = require('winston');

const winstonLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'Winston' }),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default winstonLogger;
