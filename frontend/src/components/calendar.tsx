"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react"
import "./calendar.css"

interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  duration: number
  color?: string
}

const staticEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Project Review",
    date: "2024-12-15",
    startTime: "09:30",
    endTime: "11:00",
    duration: 90,
    color: "#ef4444",
  },
  {
    id: "3",
    title: "Client Call",
    date: "2024-12-20",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    color: "#10b981",
  },
  {
    id: "4",
    title: "Design Workshop",
    date: "2024-12-22",
    startTime: "10:00",
    endTime: "12:00",
    duration: 120,
    color: "#8b5cf6",
  },
  {
    id: "5",
    title: "Lunch Meeting",
    date: "2024-12-22",
    startTime: "11:30",
    endTime: "13:00",
    duration: 90,
    color: "#f59e0b",
  },
  {
    id: "6",
    title: "Code Review",
    date: "2024-12-25",
    startTime: "15:00",
    endTime: "16:00",
    duration: 60,
    color: "#06b6d4",
  },
  {
    id: "7",
    title: "Holiday Party",
    date: "2024-12-25",
    startTime: "18:00",
    endTime: "22:00",
    duration: 240,
    color: "#ec4899",
  },
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events] = useState<Event[]>(staticEvents)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = formatDate(date)
    return events.filter((event) => event.date === dateString)
  }

  const checkEventConflicts = (dateEvents: Event[]): Event[] => {
    return dateEvents.filter((event, index) => {
      return dateEvents.some((otherEvent, otherIndex) => {
        if (index >= otherIndex) return false

        const eventStart = new Date(`2000-01-01T${event.startTime}:00`)
        const eventEnd = new Date(`2000-01-01T${event.endTime}:00`)
        const otherStart = new Date(`2000-01-01T${otherEvent.startTime}:00`)
        const otherEnd = new Date(`2000-01-01T${otherEvent.endTime}:00`)

        return eventStart < otherEnd && eventEnd > otherStart
      })
    })
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateEvents = getEventsForDate(date)
      const conflictingEvents = checkEventConflicts(dateEvents)
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          <div className="events-container">
            {dateEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={`event ${conflictingEvents.includes(event) ? "conflict" : ""}`}
                style={{ backgroundColor: event.color }}
                title={`${event.title} (${event.startTime} - ${event.endTime})`}
              >
                <span className="event-title">{event.title}</span>
                {conflictingEvents.includes(event) && <AlertCircle className="conflict-icon" size={12} />}
              </div>
            ))}
            {dateEvents.length > 3 && <div className="more-events">+{dateEvents.length - 3} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  const renderEventDetails = () => {
    if (!selectedDate) return null

    const dateEvents = getEventsForDate(selectedDate)
    const conflictingEvents = checkEventConflicts(dateEvents)

    return (
      <div className="event-details">
        <h3>Events for {selectedDate.toLocaleDateString()}</h3>
        {dateEvents.length === 0 ? (
          <p>No events scheduled for this date.</p>
        ) : (
          <div className="events-list">
            {dateEvents.map((event) => (
              <div key={event.id} className={`event-item ${conflictingEvents.includes(event) ? "conflict" : ""}`}>
                <div className="event-color" style={{ backgroundColor: event.color }}></div>
                <div className="event-info">
                  <h4>{event.title}</h4>
                  <div className="event-time">
                    <Clock size={14} />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="duration">({event.duration} min)</span>
                  </div>
                  {conflictingEvents.includes(event) && (
                    <div className="conflict-warning">
                      <AlertCircle size={14} />
                      <span>Time conflict detected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateMonth("prev")} aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>

        <h2 className="month-year">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button className="nav-button" onClick={() => navigateMonth("next")} aria-label="Next month">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="days-grid">{renderCalendarDays()}</div>
      </div>

      {renderEventDetails()}
    </div>
  )
}
