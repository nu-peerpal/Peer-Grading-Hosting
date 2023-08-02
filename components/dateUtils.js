
function formatTimestampLikeCanvas(timestamp) {
    if (!timestamp) return ""
    var d = new Date(timestamp);
    return d.toLocaleString('en-US', {month: 'short', day: 'numeric',
            year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric'})
        + " at " +
        d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})
            .replace(":00", "")
            .replace(" AM", "am")
            .replace(" PM", "pm");
}

function formatTimestampWithWeekday(timestamp) {
    if (!timestamp) return "";
    var d = new Date(timestamp);
    return d.toLocaleString('en-US', {weekday: 'short'}) + " " + formatTimestampLikeCanvas(timestamp)
}

export { formatTimestampLikeCanvas, formatTimestampWithWeekday }