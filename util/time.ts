export function convertMinutesToTimeString(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hourString = h ? `${h}h` : "";
    const minuteString = m ? `${m}m` : "";
    return `${hourString} ${minuteString}`.trim();
}
