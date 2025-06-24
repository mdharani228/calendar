"use client"

import { ChevronLeft, ChevronRight, Plus, AlertCircle } from "lucide-react"
import type { Event, CalendarViewType } from "./types"
import type { Dispatch, SetStateAction } from "react"

interface CalendarViewProps {
  currentDate: Date
  setCurrentDate: Dispatch<SetStateAction<Date>>
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  events: Event[]
  viewType: CalendarViewType
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onAddEvent: (date: Date) => void
  setViewType: (viewType: CalendarViewType) => void
}

export default function CalendarView({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  events,
  viewType,
  onDateClick,
  onEventClick,
  onAddEvent,
  setViewType,
}: CalendarViewProps) {
  const today = new Date()

  const navigateDate = (direction: "prev" | "next") => {
   setCurrentDate((prev: Date) => {
  const newDate = new Date(prev)
  switch (viewType) {
    case "year":
      newDate.setFullYear(prev.getFullYear() + (direction === "next" ? 1 : -1))
      break
    case "month":
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      break
    case "week":
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7))
      break
    case "day":
      newDate.setDate(prev.getDate() + (direction === "next" ? 1 : -1))
      break
  }
  return newDate
})

  }

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = date.toISOString().split("T")[0]
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

  const renderMonthView = () => {
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

      const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  const days: React.JSX.Element[] = []


  // Empty cells
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
  }

  // Days of month
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
        onClick={() => {
          onDateClick(date)
          setSelectedDate(date)
        }}
      >
        <div className="day-header">
          <span className="day-number">{day}</span>
          <button
            className="add-event-quick"
            onClick={(e) => {
              e.stopPropagation()
              onAddEvent(date)
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="events-container">
          {dateEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className={`event ${conflictingEvents.includes(event) ? "conflict" : ""}`}
              style={{ backgroundColor: event.color }}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              title={`${event.title} (${event.startTime} - ${event.endTime})`}
            >
              <span className="event-title">{event.title}</span>
              {conflictingEvents.includes(event) && <AlertCircle className="conflict-icon" size={10} />}
            </div>
          ))}
          {dateEvents.length > 3 && <div className="more-events">+{dateEvents.length - 3} more</div>}
        </div>
      </div>
    )
  }

    return (
      <div className="month-view">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateDate("prev")}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="month-year">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button className="nav-button" onClick={() => navigateDate("next")}>
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
          <div className="days-grid">{days}</div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }

    return (
      <div className="week-view">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateDate("prev")}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="week-range">
            {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
          </h2>
          <button className="nav-button" onClick={() => navigateDate("next")}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="week-grid">
          {weekDays.map((date, index) => {
            const dateEvents = getEventsForDate(date)
            const isToday = date.toDateString() === today.toDateString()
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

            return (
              <div
                key={index}
                className={`week-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onDateClick(date)
                  setSelectedDate(date)
                }}
              >
                <div className="week-day-header">
                  <div className="day-name">{date.toLocaleDateString("en", { weekday: "short" })}</div>
                  <div className="day-number">{date.getDate()}</div>
                </div>
                <div className="week-events">
                  {dateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="week-event"
                      style={{ backgroundColor: event.color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="event-time">{event.startTime}</div>
                      <div className="event-title">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const isToday = currentDate.toDateString() === today.toDateString()

    return (
      <div className="day-view">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateDate("prev")}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="day-date">
            {currentDate.toLocaleDateString("en", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <button className="nav-button" onClick={() => navigateDate("next")}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="day-content">
          <div className="day-events">
            {dayEvents.length === 0 ? (
              <div className="no-events">
                <p>No events scheduled for this day</p>
                <button className="add-event-btn" onClick={() => onAddEvent(currentDate)}>
                  <Plus size={16} />
                  Add Event
                </button>
              </div>
            ) : (
              dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="day-event"
                  style={{ borderLeftColor: event.color }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="event-time">
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="event-title">{event.title}</div>
                  {event.description && <div className="event-description">{event.description}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderYearView = () => {
   const months = [] as React.ReactNode[]
    const year = currentDate.getFullYear()

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1)
      const monthEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getFullYear() === year && eventDate.getMonth() === month
      })

      months.push(
        <div
          key={month}
          className="year-month"
          onClick={() => {
            setCurrentDate(monthDate)
            setViewType("month")
          }}
        >
          <h3 className="month-name">{monthDate.toLocaleDateString("en", { month: "long" })}</h3>
          <div className="month-events-count">{monthEvents.length} events</div>
        </div>,
      )
    }

    return (
      <div className="year-view">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => navigateDate("prev")}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="year-title">{year}</h2>
          <button className="nav-button" onClick={() => navigateDate("next")}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="year-grid">{months}</div>
      </div>
    )
  }

  const renderView = () => {
    switch (viewType) {
      case "year":
        return renderYearView()
      case "month":
        return renderMonthView()
      case "week":
        return renderWeekView()
      case "day":
        return renderDayView()
      default:
        return renderMonthView()
    }
  }

  return <main className="calendar-view">{renderView()}</main>
}
