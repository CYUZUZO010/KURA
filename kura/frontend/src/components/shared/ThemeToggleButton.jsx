import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggleButton({ style }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      style={style}
      title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
    </button>
  )
}