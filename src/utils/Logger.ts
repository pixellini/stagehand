export interface LoggerConfig {
    title?: string
    enabled?: boolean
}

export type LoggerType = 'log' | 'debug' | 'warn' | 'error'

/**
 * TODO: Implement this with Dependency Injection in mind.
 */
export class Logger {
    private readonly ENABLED: boolean = false
    private readonly TITLE: string = 'Application'

    constructor(options?: LoggerConfig) {
        if (!options) return

        if (options.enabled !== undefined) {
            this.ENABLED = options.enabled
        }
        if (options.title) {
            this.TITLE = options.title
        }
    }

    private exec(type: LoggerType, _color: string, ...args: unknown[]) {
        if (this.ENABLED) {
            console[type](`%c[${this.TITLE}]`, `color: ${_color}; font-weight: bold; background: ${_color};`, ...args)
        }
    }

    // TODO: Give the logs some colour.
    public log(...args: unknown[]): void {
        this.exec('log', '#FFFFFF', ...args)
    }

    public debug(...args: unknown[]): void {
        this.exec('debug', '#FFFFFF', ...args)
    }

    public warn(...args: unknown[]): void {
        this.exec('warn', '#FFFFFF', ...args)
    }

    public error(...args: unknown[]): void {
        this.exec('error', '#FFFFFF', ...args)
    }
}