import type { CustomStart } from '@/lib/types'

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

const getDateMonth = (date: Date) => {
    return date.getMonth() + 1
}

const getDateHours = (date: Date) => {
    const hours = date.getHours() % 12
    return hours || 12 // if hours is 0 replace with 12
}

const getDateAmPm = (date: Date) => {
    return date.getHours() <= 11 ? 'am' : 'pm'
}

const dateFromCustomStart = (custom: CustomStart) => {
    const hours = (custom.hour % 12) + (custom.ampm === 'pm' ? 12 : 0)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, custom.minute)
}

const hourFromMs = (ms: number) => {
    return ms / (1000 * 60 * 60)
}

const getTwoDigitMinutes = (min: number) => {
    if (min < 10) return '0' + min
    return min.toString()
}

export {
    getTimeString,
    getDateStringLong,
    getDateString,
    getPrevWeek,
    getNextWeek,
    getDateMonth,
    getDateHours,
    getDateAmPm,
    dateFromCustomStart,
    hourFromMs,
    getTwoDigitMinutes
}
