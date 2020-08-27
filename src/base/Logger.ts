import winston, { format } from 'winston'

var options = {
    file: {
        level: 'info',
        filename: `./logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    errorfile:{
        level:'error',
        filename:`./logs/error.log`
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

function createLogger(){
    return winston.createLogger({
        // level: 'info',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        ),
        defaultMeta: { service: 'InnoServer' },
        transports: [
            new winston.transports.Console(options.console),
            new winston.transports.File(options.file),
            new winston.transports.File(options.errorfile)
        ]
    });
}
// const logger : winston.Logger = 

// logger.add(new transports.File(options.file));

// module.exports = logger;
export const logger = createLogger();