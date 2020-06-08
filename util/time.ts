export function convertMinutesToTimeString(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hourString = h ? `${h}h ` : "";
    return `${hourString}${m}m`;
}
