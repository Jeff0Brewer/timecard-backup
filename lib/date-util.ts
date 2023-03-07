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

const MS_TO_HR = 1 / 3600000
const MS_PER_DAY = 86400000

const currYear = (new Date()).getFullYear() % 100

const getDateStringLong = (date: Date) => {
    const weekday = WEEKDAYS[date.getDay()]
    const month = MONTHS[date.getMonth()]
    const day = date.getDate()
    const time = getTimeString(date)
    return `${weekday}. ${month} ${day}, ${time}`
}

const getDateStringMed = (date: Date) => {
    const weekday = WEEKDAYS[date.getDay()]
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear() % 100
    let str = `${weekday} ${month}.${day}`
    // only show year if not current year
    if (year !== currYear) { str += `.${year}` }
    return str
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

const getTimeStringShort = (date: Date) => {
    return getTimeString(date).replace(/[ m]/g, '')
}

const getHourString = (hours: number) => {
    const minute = Math.floor(60 * (hours % 1))
    const minStr = minute < 10 ? '0' + minute : minute
    const hour = Math.floor(hours)
    return `${hour}:${minStr}`
}

const getDayStart = (date: Date) => {
    date.setHours(0)
    return date
}

const getDayEnd = (date: Date) => {
    date.setHours(23, 59, 59, 999)
    return date
}

const getPrevWeek = (date: Date) => {
    date.setHours(0)
    date.setDate(date.getDate() - 6)
    return date
}

const dateFromCustomStart = (custom: CustomStart) => {
    const hours = (custom.hour % 12) + (custom.ampm === 'pm' ? 12 : 0)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, custom.minute)
}

const getTwoDigitMinutes = (minutes: number) => {
    return minutes < 10 ? '0' + minutes : minutes
}

export {
    getHourString,
    getTimeString,
    getTimeStringShort,
    getDateString,
    getDateStringMed,
    getDateStringLong,
    getPrevWeek,
    getDayStart,
    getDayEnd,
    dateFromCustomStart,
    getTwoDigitMinutes,
    MS_TO_HR,
    MS_PER_DAY
}
