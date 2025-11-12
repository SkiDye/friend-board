import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import MainLayout from './components/layout/MainLayout'
import Board from './pages/Board'
import About from './pages/About'
import DevelopmentHistory from './pages/DevelopmentHistory'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/friend-board">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Board />} />
            <Route path="board" element={<Navigate to="/" replace />} />
            <Route path="about" element={<About />} />
            <Route path="dev-history" element={<DevelopmentHistory />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
