import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Sun, Moon, ArrowLeft, Shield } from 'lucide-react'

function PrivacyPage() {
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
    <div className="min-h-screen w-full bg-[var(--bg-base)] text-[var(--text-primary)] relative bg-mesh bg-dots flex flex-col justify-between">
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
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Privacy Policy</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">Last Updated: July 3, 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">1. Information We Collect</h2>
              <p>At CaptionAI, we prioritize your privacy. We do not track or record your personal identification data. However, to facilitate the generation of captions and images, we collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Your public wallet address (when connected via web3).</li>
                <li>The text prompts you input for generations.</li>
                <li>Anonymous usage analytics to monitor server health and prevent abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">2. How We Use Information</h2>
              <p>The information we collect is strictly used to render services: validating blockchain payments (cUSD) on the Celo Network, querying the LLM and image models, and showing your local transaction history.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">3. Data Security and Custody</h2>
              <p>All blockchain transactions are signed locally by your web3 client and validated on the decentralized public network. We do not store or have access to your wallet private keys or funds.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2.5">4. Cookies and Local Storage</h2>
              <p>We use browser local storage to save your visual theme preference (Light/Dark mode) and keep a record of your recent prompt generations locally on your device.</p>
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
            <a href="/terms.html" className="hover:text-[var(--accent)] transition-colors">Terms</a>
            <a href="/contact.html" className="hover:text-[var(--accent)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivacyPage />
  </React.StrictMode>
)
