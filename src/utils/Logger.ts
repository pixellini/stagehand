export interface LoggerConfig {
    title?: string
    enabled?: boolean
}

export type LoggerType = 'info' | 'debug' | 'warn' | 'error'

export enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
    None
}

/**
 * TODO: Implement this with Dependency Injection in mind.
 */
export class Logger {
    public static level: LogLevel = LogLevel.None

    private readonly title: string = 'Debugger'

    constructor(label: string) {
        if (label) {
            this.title = label
        }
    }

    // TODO: Give the logs some colour.
    private exec(type: LoggerType, _color: string, ...args: unknown[]) {
        console[type](`%c[${this.title}]`, `color: black; font-weight: bold; background: ${_color};`, ...args)
    }

    public debug(...args: unknown[]): void {
        if (Logger.level <= LogLevel.Debug) {
            this.exec('debug', '#a5ffb7', ...args)
        }
    }

    public info(...args: unknown[]): void {
        if (Logger.level <= LogLevel.Info) {
            this.exec('info', '#91cbff', ...args)
        }
    }

    public warn(...args: unknown[]): void {
        if (Logger.level <= LogLevel.Warn ) {
            this.exec('warn', '#ffd5a6', ...args)
        }
    }

    public error(...args: unknown[]): void {
        if (Logger.level <= LogLevel.Error) {
            this.exec('error', '#ffa8c4', ...args)
        }
    }
}