import moment from 'moment'

export const formatPhone = (phone) => {
    if (!phone) return ""

    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
}

export const secondToTime = (value) => {
    if (!value)
        return '00:00'
    
    return moment.utc(value * 1000).format("mm:ss")
}

export const addCommaToNumber = (value) => {
    if (!value) {
        return 0
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const mToKm = (value) => {
    if (!value) return "0km"
    if (isNaN(value)) return value
    
    return `${Math.floor(value / 1000)}km`
}

export const secondToTimeHangul = (value) => {
    if (!value) return "0분"
    if (isNaN(value)) return value
    
    const totalMinutes = Math.floor(value / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (hours > 0) {
        return `${hours}시간 ${minutes}분`
    }
    else {
        return `${minutes}분`
    }
}

export const getAddress = (orderLocation) => {
    return orderLocation?.roadAddress
        || orderLocation?.jibunAddress
        || "없음"
}

export const getAddressShort = (orderLocation) => {
    return orderLocation?.roadAddressShort
        || orderLocation?.jibunAddressShort
        || getAddress(orderLocation)
}

export const isFileUnder2MB = async (uri) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const blob = await fetch(uri).then(res => res.blob())

    return blob.size <= MAX_FILE_SIZE
}

export const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일`
}

// 시간 포맷팅 함수
export const formatTime = date => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? '오후' : '오전'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${ampm} ${displayHours}:${displayMinutes}`
}

export const formatDatetime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const second = date.getSeconds()

    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`
}

export const dateFormatter = (date, format = "YYYY-MM-DD HH:mm:ss") => {
    if (!date) return null

    return moment(date).format(format)
}

export function extractS3KeyFromUrl(url) {
    if (!url || typeof url !== 'string') return null

    try {
        const { pathname } = new URL(url)
        return decodeURIComponent(pathname.replace(/^\/+/, ''))
    } catch (e) {
        return null
    }
}