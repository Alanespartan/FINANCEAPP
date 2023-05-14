import { LogLevel } from "../enums/logs";

export class Logger {
    private static globalLogger = new Logger();

    static log(message: string, severity: LogLevel) {  Logger.globalLogger.log(message, severity); }

    static fatal(message: string)   { Logger.globalLogger.fatal(message); }

    static error(message: string)   { Logger.globalLogger.error(message); }

    static warn(message: string)    { Logger.globalLogger.warn(message); }

    static info(message: string)    { Logger.globalLogger.info(message); }

    static verbose(message: string) { Logger.globalLogger.verbose(message); }

    public constructor(public readonly file?: string) { }

    protected write(message: string, level: LogLevel) {
        if(this.file) {
            console.log(`${new Date().toISOString()} ${level} >> ${message} [in ${this.file}]`);
        } else {
            console.log(`${new Date().toISOString()} ${level} >> ${message}`);
        }
    }

    public log(message: string, severity: LogLevel) {
        this.write(message, severity);
    }

    public fatal(message: string) { this.log(message, LogLevel.FATAL); }

    public error(message: string) { this.log(message, LogLevel.ERROR); }

    public warn(message: string) { this.log(message, LogLevel.WARN); }

    public info(message: string) { this.log(message, LogLevel.INFO); }

    public verbose(message: string) { this.log(message, LogLevel.VERBOSE); }
}