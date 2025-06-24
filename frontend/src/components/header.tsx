"use client"

import { Menu, Search, Sun, Moon } from "lucide-react"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  searchTerm,
  setSearchTerm,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <h1 className="app-title">Calendar</h1>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
