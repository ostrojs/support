
const DateTimeInterface = require('@ostro/support/dateTime');;
const DateTime = require('./dateTime');
class InteractsWithTime {

    secondsUntil($delay) {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTimeInterface
            ? max(0, $delay.getTimestamp() - this.currentTime())
            : parseInt($delay);
    }

    availableAt($delay = 0) {
        $delay = this.parseDateInterval($delay);

        return $delay instanceof DateTimeInterface
            ? $delay.getTimeStamp()
            : DateTime.now().plus({ second: $delay }).getTimestamp();
    }

    parseDateInterval($delay) {
        if ($delay instanceof DateTimeInterface) {
            $delay = DateTime.now().add($delay);
        }

        return $delay;
    }

    currentTime() {
        return DateTime.now().getTimestamp();
    }
}
module.exports = InteractsWithTime;
