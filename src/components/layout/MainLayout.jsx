import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto bg-notion-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
