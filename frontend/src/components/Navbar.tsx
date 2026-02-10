import { Link, useLocation } from 'react-router-dom'
import { FileText, CheckCircle2, Mail, MessageSquare, Menu, X, Home as HomeIcon, Laugh } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { themeConfig } = useTheme()

  const navLinks = [
    { path: '/builder', label: 'Resume Builder', icon: FileText, shortLabel: 'Builder' },
    { path: '/ats-checker', label: 'ATS Checker', icon: CheckCircle2, shortLabel: 'ATS' },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail, shortLabel: 'Cover' },
    { path: '/interview-questions', label: 'Interview Prep', icon: MessageSquare, shortLabel: 'Interview' },
    { path: '/resume-roaster', label: 'Resume Roaster', icon: Laugh, shortLabel: 'Roaster' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50'
        : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})` }}
            >
              R
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            >
              Resumio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`p-2 rounded-md transition-all duration-200 ${isActive('/')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              title="Home"
            >
              <HomeIcon size={20} />
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {navLinks.map((link) => {
              const active = isActive(link.path)
              const Icon = link.icon

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${active ? '' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                  style={active ? {
                    backgroundColor: `${themeConfig.colors.primary}15`,
                    color: themeConfig.colors.primary
                  } : {}}
                >
                  <Icon size={16} className={active ? 'stroke-[2.5px]' : 'stroke-2'} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <HomeIcon size={20} />
              Home
            </Link>

            {navLinks.map((link) => {
              const active = isActive(link.path)
              const Icon = link.icon

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors
                    ${active ? '' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                  style={active ? {
                    backgroundColor: `${themeConfig.colors.primary}15`,
                    color: themeConfig.colors.primary
                  } : {}}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

