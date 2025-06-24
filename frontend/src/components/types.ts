export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  duration: number
  color: string
  description?: string
}

export type CalendarViewType = "year" | "month" | "week" | "day"
