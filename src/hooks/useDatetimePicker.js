import { useState } from 'react';

export function useDateTimePicker(initialDate = new Date()) {
    const [selectedDate, setSelectedDate] = useState(initialDate)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const handleDateChange = (event, date) => {
        setShowDatePicker(false)

        if (date) {
            const newDate = new Date(date)
            newDate.setHours(selectedDate.getHours())
            newDate.setMinutes(selectedDate.getMinutes())
            setSelectedDate(newDate)
        }
    }

    const handleTimeChange = (event, date) => {
        setShowTimePicker(false)

        if (date) {
            const newDate = new Date(selectedDate)
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
            setSelectedDate(newDate)
        }
    }

    return {
        selectedDate,
        setSelectedDate,
        showDatePicker,
        showTimePicker,
        setShowDatePicker,
        setShowTimePicker,
        handleDateChange,
        handleTimeChange,
    }
}
