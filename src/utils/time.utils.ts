export class DateTimeUtils {
    static parseTimetoUtc(timeStr: string) {
        const [hours = 0, minutes = 0] = timeStr.split(":").map(Number);
        const dateNow = new Date();
        dateNow.setHours(hours, minutes, 0, 0);
        // dateNow.setUTCHours(hours, minutes, 0, 0);
        return dateNow;
    }
}