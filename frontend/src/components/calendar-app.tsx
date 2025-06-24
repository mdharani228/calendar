"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import CalendarView from "./calendar-view"
import EventModal from "./event-model"
import "./calendar-app.css"
import type { Event, CalendarViewType } from "./types"

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    color: "#3b82f6",
    description: "Weekly team sync meeting",
  },
  {
    id: "2",
    title: "Project Review",
    date: "2024-12-15",
    startTime: "09:30",
    endTime: "11:00",
    duration: 90,
    color: "#ef4444",
    description: "Quarterly project review",
  },
  {
    id: "3",
    title: "Client Call",
    date: "2024-12-20",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    color: "#10b981",
    description: "Client consultation call",
  },
  {
    id: "4",
    title: "Design Workshop",
    date: "2024-12-22",
    startTime: "10:00",
    endTime: "12:00",
    duration: 120,
    color: "#8b5cf6",
    description: "UI/UX design workshop",
  },
]

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([]) // ✅ Type added
  const [viewType, setViewType] = useState<CalendarViewType>("month") // ✅ Type added
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [eventModal, setEventModal] = useState<{
    isOpen: boolean
    event?: Event
    date?: Date
  }>({ isOpen: false })
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      setEvents(initialEvents)
      localStorage.setItem("calendar-events", JSON.stringify(initialEvents))
    }

    const savedTheme = localStorage.getItem("calendar-theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
    localStorage.setItem("calendar-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const openEventModal = (event?: Event, date?: Date) => {
    setEventModal({ isOpen: true, event, date })
  }

  const closeEventModal = () => {
    setEventModal({ isOpen: false })
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={`calendar-app ${darkMode ? "dark" : "light"}`}>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={filteredEvents}
          viewType={viewType}
          setViewType={setViewType}
          onAddEvent={() => openEventModal(undefined, selectedDate || new Date())}
          onEditEvent={(event) => openEventModal(event)}
          onDeleteEvent={deleteEvent}
        />

        <CalendarView
  currentDate={currentDate}
  setCurrentDate={setCurrentDate}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  events={filteredEvents}
  viewType={viewType}
  setViewType={setViewType} // ✅ Add this line
  onDateClick={(date) => setSelectedDate(date)}
  onEventClick={(event) => openEventModal(event)}
  onAddEvent={(date) => openEventModal(undefined, date)}
/>

      </div>

      <EventModal
        isOpen={eventModal.isOpen}
        event={eventModal.event}
        defaultDate={eventModal.date}
        onClose={closeEventModal}
       onSave={(event) => {
  if ('id' in event) {
    updateEvent(event)
  } else {
    addEvent(event)
  }
}}

        onDelete={
          eventModal.event
            ? () => {
                deleteEvent(eventModal.event!.id)
                closeEventModal()
              }
            : undefined
        }
      />
    </div>
  )
}
