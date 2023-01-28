const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const getDateStringLong = (date: Date) => {
    const weekday = WEEKDAYS[date.getDay()]
    const month = MONTHS[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${weekday} ${month} ${day}, ${year}`
}

const getDateString = (date: Date) => {
    const weekday = WEEKDAYS[date.getDay()]
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear() % 100
    return `${weekday} ${month}/${day}/${year}`
}

const getTimeString = (date: Date) => {
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
    }).toLowerCase()
}

const getPrevWeek = (date: Date) => {
    date.setDate(date.getDate() - 7)
    return date
}

const getNextWeek = (date: Date) => {
    date.setDate(date.getDate() + 7)
    return date
}

export {
    getTimeString,
    getDateStringLong,
    getDateString,
    getPrevWeek,
    getNextWeek
}
