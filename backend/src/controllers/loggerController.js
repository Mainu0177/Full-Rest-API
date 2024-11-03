const {createLogger, format, transports} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: 'src/logs/info.log',
            level: 'info',
            // maxsize: 5242880, // 5MB
            // maxFiles: 5
        }),
        // error log
        new transports.File({
            filename: 'src/logs/error.log',
            level: 'error',
        }),
    ],
});

module.exports = logger;