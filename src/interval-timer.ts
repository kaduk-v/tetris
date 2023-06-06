export class IntervalTimer {
    private timerId: ReturnType<typeof setTimeout>;
    private intervalId: ReturnType<typeof setInterval>;

    /**
     * Callback start time. Number of milliseconds.
     */
    private timerStartTime: number;

    /**
     * The time remaining until the callback is run.
     */
    private remained = 0;

    private paused = false;

    constructor(private callback: Function, private timeout: number) {
    }

    /**
     * Set interval timer.
     */
    start() {
        this.clear();

        this.intervalId = setInterval(() => this.run(), this.timeout);
    }

    pause() {
        if (this.paused) {
            return this.paused;
        }

        this.clear();

        this.remained = new Date().getTime() - this.timerStartTime;
        this.paused = true;

        return this.paused;
    }

    resume() {
        if (!this.paused) {
            return;
        }

        // finish previous timer
        if (this.remained) {
            this.timerId = setTimeout(() => {
                this.run();
                this.paused = false;
                this.start();
            }, this.remained);
        }

        // run a new interval timer
        else {
            this.paused = false;
            this.start();
        }
    }

    /**
     * Run callback function.
     */
    run() {
        this.timerStartTime = new Date().getTime();
        this.callback();
    }

    clear() {
        clearTimeout(this.timerId);
        clearInterval(this.intervalId);
    }


    isPaused() {
        return this.paused;
    }
}