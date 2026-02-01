export class Time {
    public static wait(seconds: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000)
        })
    }
}