import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import MainLayout from './components/layout/MainLayout'
import Board from './pages/Board'
import About from './pages/About'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Board />} />
            <Route path="board" element={<Navigate to="/" replace />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
