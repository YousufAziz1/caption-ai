import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Sun, Moon, ArrowLeft, Mail, Send, Check } from 'lucide-react'

function ContactPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setName('')
      setEmail('')
      setMessage('')
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-base)] text-[var(--text-primary)] relative overflow-x-hidden bg-mesh bg-dots flex flex-col justify-between">
      {/* Glow Orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-[150px] -left-[100px]" aria-hidden="true" />
      <div className="glow-orb glow-orb-pink w-[400px] h-[400px] -bottom-[100px] -right-[100px]" aria-hidden="true" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/85 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group">
            <img src="/favicon.svg" alt="CaptionAI Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">CaptionAI</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 transition-all duration-300 cursor-pointer shadow-lg shadow-black/25 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-[var(--accent)]" /> : <Moon className="w-4 h-4 text-[var(--accent)]" />}
            </button>
            <a href="/" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[var(--accent)] text-white hover:shadow-lg hover:shadow-[var(--accent-glow)] px-4 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-black/40">
              <ArrowLeft className="w-3.5 h-3.5" /> Back Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-4 md:px-6 py-12 flex-1 animate-in">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Contact Us</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">Get in touch with the team</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
              <p>Have questions about pay-per-use rates, model features, or Celo integration? Send us a message and we'll reply as soon as possible.</p>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Email</h3>
                <a href="mailto:yousufaziz1234@gmail.com" className="text-sm font-semibold text-[var(--accent)] hover:underline">yousufaziz1234@gmail.com</a>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Community</h3>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Telegram / Discord links coming soon</p>
              </div>
            </div>

            <div className="md:col-span-7">
              {sent ? (
                <div className="p-6 border border-[var(--success)]/20 bg-[var(--success)]/5 rounded-xl text-center flex flex-col items-center gap-3 animate-in">
                  <div className="w-12 h-12 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center border border-[var(--success)]/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-md font-bold text-[var(--text-primary)]">Message Sent Successfully!</h3>
                  <p className="text-xs text-[var(--text-muted)]">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setSent(false)} className="mt-2 text-xs font-bold text-[var(--accent)] hover:underline cursor-pointer">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] outline-none rounded-xl p-3 text-sm text-[var(--text-primary)] transition-all duration-200"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] outline-none rounded-xl p-3 text-sm text-[var(--text-primary)] transition-all duration-200"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] outline-none rounded-xl p-3 text-sm text-[var(--text-primary)] transition-all duration-200 resize-none"
                      placeholder="How can we help you today?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm bg-[var(--accent)] text-white hover:shadow-lg hover:shadow-[var(--accent-glow)] hover:-translate-y-0.5 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg shadow-black/40"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[var(--bg-surface)]/40 border-t border-[var(--border-subtle)]/50 py-6">
        <div className="max-w-6xl w-full mx-auto px-4 text-center text-xs text-[var(--text-faint)] font-semibold tracking-wide flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CaptionAI • Built for Celo Proof of Ship</p>
          <div className="flex gap-4">
            <a href="/about.html" className="hover:text-[var(--accent)] transition-colors">About</a>
            <a href="/privacy.html" className="hover:text-[var(--accent)] transition-colors">Privacy</a>
            <a href="/terms.html" className="hover:text-[var(--accent)] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContactPage />
  </React.StrictMode>
)
