exports.getDay = function() {
    let today = new Date()
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    let day = today.toLocaleString('en-us', dateOptions)
    return day
}