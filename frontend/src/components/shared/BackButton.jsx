import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate()
  return (
    <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
      <ArrowLeft size={15} strokeWidth={2} />
      <span>{label}</span>
    </button>
  )
}