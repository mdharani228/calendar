"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Save, Trash2, Calendar, Clock, Palette } from "lucide-react"
import type { Event } from "./types"

interface EventModalProps {
  isOpen: boolean
  event?: Event
  defaultDate?: Date
  onClose: () => void
  onSave: (event: Event | Omit<Event, "id">) => void
  onDelete?: () => void
}

const eventColors = ["#3b82f6", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#84cc16"]

// ✅ Fix: Format date string in local timezone
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function EventModal({
  isOpen,
  event,
  defaultDate,
  onClose,
  onSave,
  onDelete,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    color: "#3b82f6",
    description: "",
  })

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          color: event.color,
          description: event.description || "",
        })
      } else {
        // ✅ Updated to use local date formatting
        const defaultDateString = defaultDate
          ? formatDateForInput(defaultDate)
          : formatDateForInput(new Date())

        setFormData({
          title: "",
          date: defaultDateString,
          startTime: "09:00",
          endTime: "10:00",
          color: "#3b82f6",
          description: "",
        })
      }
    }
  }, [isOpen, event, defaultDate])

  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(`2000-01-01T${start}:00`)
    const endTime = new Date(`2000-01-01T${end}:00`)
    return Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const duration = calculateDuration(formData.startTime, formData.endTime)

    if (duration <= 0) {
      alert("End time must be after start time")
      return
    }

    const eventData = {
      ...formData,
      duration,
    }

    if (event) {
      onSave({ ...eventData, id: event.id })
    } else {
      onSave(eventData)
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? "Edit Event" : "Add Event"}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">
              <Calendar size={16} />
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">
              <Calendar size={16} />
              Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">
                <Clock size={16} />
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">
                <Clock size={16} />
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Palette size={16} />
              Color
            </label>
            <div className="color-picker">
              {eventColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Event description (optional)"
              rows={3}
            />
          </div>

          <div className="form-actions">
            {onDelete && (
              <button type="button" className="delete-button" onClick={onDelete}>
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <div className="action-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                <Save size={16} />
                {event ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
