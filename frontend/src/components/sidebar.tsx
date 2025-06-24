"use client"

import { Calendar, Clock, Plus, Edit, Trash2, Bell } from "lucide-react"
import type { Event, CalendarViewType } from "./types"

interface SidebarProps {
  isOpen: boolean
  currentDate: Date
  selectedDate: Date | null
  events: Event[]
  viewType: CalendarViewType
  setViewType: (type: CalendarViewType) => void
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

export default function Sidebar({
  isOpen,
  currentDate,
  selectedDate,
  events,
  viewType,
  setViewType,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: SidebarProps) {
  const viewTypes: { type: CalendarViewType; label: string; icon: any }[] = [
    { type: "year", label: "Year", icon: Calendar },
    { type: "month", label: "Month", icon: Calendar },
    { type: "week", label: "Week", icon: Calendar },
    { type: "day", label: "Day", icon: Calendar },
  ]

  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate <= nextWeek
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`)
        const dateB = new Date(`${b.date}T${b.startTime}`)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 5)
  }

  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events.filter((event) => event.date === today)
  }

  const upcomingEvents = getUpcomingEvents()
  const todayEvents = getTodayEvents()

  if (!isOpen) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Navigation Modes */}
        <div className="sidebar-section">
          <h3 className="section-title">View</h3>
          <div className="view-buttons">
            {viewTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                className={`view-button ${viewType === type ? "active" : ""}`}
                onClick={() => setViewType(type)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Event Management */}
        <div className="sidebar-section">
          <h3 className="section-title">Events</h3>
          <button className="add-event-btn" onClick={onAddEvent}>
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>

        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <div className="sidebar-section">
            <h3 className="section-title">
              <Clock size={16} />
              Today's Events
            </h3>
            <div className="events-list">
              {todayEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-color" style={{ backgroundColor: event.color }} />
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                  <div className="event-actions">
                    <button onClick={() => onEditEvent(event)} className="action-btn">
                      <Edit size={12} />
                    </button>
                    <button onClick={() => onDeleteEvent(event.id)} className="action-btn delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="sidebar-section">
          <h3 className="section-title">
            <Bell size={16} />
            Upcoming Events
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events</p>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-color" style={{ backgroundColor: event.color }} />
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="event-time">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                  <div className="event-actions">
                    <button onClick={() => onEditEvent(event)} className="action-btn">
                      <Edit size={12} />
                    </button>
                    <button onClick={() => onDeleteEvent(event.id)} className="action-btn delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
