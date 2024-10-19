export enum LogLevel {
    VERBOSE = "VERBOSE",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    FATAL = "FATAL"
}

export enum LogLevelValue {
    VERBOSE = 0,
    INFO = 50,
    WARN = 70,
    ERROR = 80,
    FATAL = 100
}

export type LogItem = LogMessage | LogProgress;
export interface LogMessage {
    type: "message";
    timestamp: number;
    message: string;
    level: LogLevel;
}
export interface LogProgress {
    type: "progress";
    timestamp: number;
    max?: number;
    value: number;
    label?: string;
}
export interface LogItemResponse {
    type: string;
    timestamp: number;
    message: string;
    level: string;
}
export class Logger
{
    private static globalLogger = new Logger();


    /**
     * Logs a message to the console.
     * @param  {string} message Message to log.
     * @param  {LogLevel} severity Severity of message.
     */
    static log(message: string, severity: LogLevel) { Logger.globalLogger.log(message, severity); }

    /**
     * Logs a fatal error to the console.
     * @param  {string} message Error message.
     */
    static fatal(message: string)   { Logger.globalLogger.fatal(message);   }

    /**
     * Logs an error to the console.
     * @param  {string} message Error message.
     */
    static error(message: string)   { Logger.globalLogger.error(message);   }

    /**
     * Logs a warning to the console.
     * @param  {string} message Warning message.
     */
    static warn(message: string)    { Logger.globalLogger.warn(message);    }

    /** Logs information to the console.
     * @param  {string} message Message to log.
     */
    static info(message: string)    { Logger.globalLogger.info(message);    }

    /**
     * Logs a message to the console with low severity.
     * @param  {string} message Message to log.
     */
    static verbose(message: string) { Logger.globalLogger.verbose(message); }


    /**
     * Logger Constructor
     * @param  {string} publicreadonlymodule? File location of the logger instance.
     */
    public constructor(public readonly module?: string) {  }


    /**
     * Write a message to the console.
     * @param  {string} message Message to log.
     * @param  {LogLevel} level Severity level.
     */
    protected write(message: string, level: LogLevel) {
        if(this.module) {
            console.log(`${new Date().toISOString()} ${level} >> ${message} [in ${this.module}]`);
        } else {
            console.log(`${new Date().toISOString()} ${level} >> ${message}`);
        }
    }

    /**
     * Logs a message to the console.
     * @param  {string} message Message to log.
     * @param  {LogLevel} severity Severity of message.
     */
    public log(message: string, severity: LogLevel) {
        this.write(message, severity);
    }

    /**
     * Logs a fatal error to the console.
     * @param  {string} message Error message.
     */
    public fatal(message: string)   { this.log(message, LogLevel.FATAL);   }

    /**
     * Logs an error to the console.
     * @param  {string} message Error message.
     */
    public error(message: string)   { this.log(message, LogLevel.ERROR);   }

    /**
     * Logs a warning to the console.
     * @param  {string} message Warning message.
     */
    public warn(message: string)    { this.log(message, LogLevel.WARN);    }

    /** Logs information to the console.
     * @param  {string} message Message to log.
     */
    public info(message: string)    { this.log(message, LogLevel.INFO);    }

    /**
     * Logs a message to the console with low severity.
     * @param  {string} message Message to log.
     */
    public verbose(message: string) { this.log(message, LogLevel.VERBOSE); }
}
