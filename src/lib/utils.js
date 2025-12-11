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
