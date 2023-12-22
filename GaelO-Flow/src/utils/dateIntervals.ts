export function isTimeBetween(
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
    currentHour: number,
    currentMinute: number
): boolean {
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date();
    if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
        endTime.setDate(endTime.getDate() + 1);
    }
    endTime.setHours(endHour, endMinute, 0);

    const currentTime = new Date();
    currentTime.setHours(currentHour, currentMinute, 0);

    if (startHour > endHour && currentHour < startHour && currentHour >= 0) {
        currentTime.setDate(currentTime.getDate() + 1);
    }

    return startTime <= currentTime && currentTime <= endTime;
}





