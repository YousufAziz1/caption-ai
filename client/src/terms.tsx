import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Sun, Moon, ArrowLeft, FileText } from 'lucide-react'

function TermsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Terms & Conditions</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">Last Updated: July 3, 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">1. Acceptance of Terms</h2>
              <p>By accessing and using CaptionAI, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">2. Service Usage & Pay-Per-Use Model</h2>
              <p>CaptionAI operates on a decentralized web3 pay-per-use service. Each generation is priced at a flat rate of 0.02 cUSD, verified on-chain via smart contracts on Celo. Generations are executed immediately after successful payment authorization.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">3. User Responsibility</h2>
              <p>Users are solely responsible for ensuring the text prompts they enter do not violate local laws or publish abusive, hateful, or harmful content. You also assume full responsibility for managing your own decentralized crypto wallet credentials and transactions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">4. Intellectual Property</h2>
              <p>While the models (like FLUX and standard LLMs) generate captions and media outputs, CaptionAI makes no claim of ownership over your generated content. You are free to distribute, download, and monetize the outputs generated under your successful payments.</p>
            </section>
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
            <a href="/contact.html" className="hover:text-[var(--accent)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TermsPage />
  </React.StrictMode>
)
