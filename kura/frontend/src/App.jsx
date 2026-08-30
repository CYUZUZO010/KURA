import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/layout/Sidebar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Recurring from './pages/Recurring'
import Import from './pages/Import'

function ProtectedLayout({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

function PublicOnly({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnly><Auth /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Auth /></PublicOnly>} />
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/transactions" element={<ProtectedLayout><Transactions /></ProtectedLayout>} />
            <Route path="/budgets" element={<ProtectedLayout><Budgets /></ProtectedLayout>} />
            <Route path="/recurring" element={<ProtectedLayout><Recurring /></ProtectedLayout>} />
            <Route path="/import" element={<ProtectedLayout><Import /></ProtectedLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}