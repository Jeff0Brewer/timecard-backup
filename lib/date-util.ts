import type { CustomStart } from '@/lib/types'

const WEEKDAYS = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
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
    const time = getTimeString(date)
    return `${weekday}. ${month} ${day}, ${time}`
}

const getDateStringShort = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
}

const getDateString = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear() % 100
    const monthStr = month < 10 ? '0' + month : month
    const dayStr = day < 10 ? '0' + day : day
    return `${monthStr}.${dayStr}.${year}`
}

const getTimeString = (date: Date) => {
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
    }).toLowerCase()
}

const getHourString = (hours: number) => {
    const minute = Math.floor(60 * (hours % 1))
    const hour = Math.floor(hours)
    return `${hour}:${getTwoDigitMinutes(minute)}`
}

const getPrevWeek = (date: Date) => {
    date.setHours(0)
    date.setDate(date.getDate() - 7)
    return date
}

const getNextWeek = (date: Date) => {
    date.setDate(date.getDate() + 7)
    return date
}

const getDayEnd = (date: Date) => {
    date.setUTCHours(23, 59, 59, 999)
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
    getDateStringShort,
    getDateString,
    getHourString,
    getPrevWeek,
    getNextWeek,
    getDayEnd,
    getDateMonth,
    getDateHours,
    getDateAmPm,
    dateFromCustomStart,
    hourFromMs,
    getTwoDigitMinutes
}
