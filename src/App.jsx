import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import MainLayout from './components/layout/MainLayout'
import Board from './pages/Board'
import About from './pages/About'
import DevelopmentHistory from './pages/DevelopmentHistory'

function App() {
  // PWA 설치 프롬프트를 전역으로 캡처
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      // window 객체에 저장하여 모든 컴포넌트에서 접근 가능
      window.deferredPrompt = e
      console.log('✅ PWA 설치 프롬프트 캡처됨')
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

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
