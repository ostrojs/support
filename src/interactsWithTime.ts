import DateTime from './dateTime';

/**
 * Class InteractsWithTime.
 */
class InteractsWithTime {
    /**
     * Calculate number of seconds until a given delay or date.
     *
     * @param $delay - Delay in seconds or DateTime instance.
     * @returns Seconds until delay.
     */
    public secondsUntil($delay: any): number {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTime
            ? Math.max(0, $delay.getTimestamp() - this.currentTime())
            : parseInt($delay, 10);
    }

    /**
     * Get the UNIX timestamp for a given delay or date.
     *
     * @param $delay - Delay in seconds or DateTime instance.
     * @returns UNIX timestamp.
     */
    public availableAt($delay: any = 0): number {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTime
            ? $delay.getTimestamp()
            : DateTime.now().addSeconds($delay).getTimestamp();
    }

    /**
     * Parse date interval into a DateTime if applicable.
     *
     * @param $delay - Delay or DateTime.
     * @returns Parsed delay or DateTime.
     */
    public parseDateInterval($delay: any): any {
        if ($delay instanceof DateTime) {
            $delay = DateTime.now().add($delay);
        }

        return $delay;
    }

    /**
     * Get current UNIX timestamp.
     *
     * @returns UNIX timestamp.
     */
    public currentTime(): number {
        return DateTime.now().getTimestamp();
    }
}

export default InteractsWithTime;
