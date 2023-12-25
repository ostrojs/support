
const DateTime = require('./dateTime');;
class InteractsWithTime {

    secondsUntil($delay) {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTime
            ? max(0, $delay.getTimestamp() - this.currentTime())
            : parseInt($delay);
    }

    availableAt($delay = 0) {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTime
            ? $delay.getTimeStamp()
            : DateTime.now().addSeconds($delay).getTimestamp();
    }

    parseDateInterval($delay) {
        if ($delay instanceof DateTime) {
            $delay = DateTime.now().add($delay);
        }

        return $delay;
    }

    currentTime() {
        return DateTime.now().getTimestamp();
    }
}
module.exports = InteractsWithTime;
