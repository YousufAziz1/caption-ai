import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { Sun, Moon, ArrowLeft, Info, Cpu, Sparkles, Coins } from 'lucide-react'

function AboutPage() {
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
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">About Us</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">Our mission and model</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              CaptionAI is a decentralized content generation dashboard created specifically for developers, marketers, and web3 enthusiasts. We leverage advanced artificial intelligence to automate engaging social media caption and image creation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
                <Cpu className="w-6 h-6 text-[var(--accent)] mb-3" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">State of the Art AI</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">Harnessing advanced LLM architectures and FLUX-Schnell generation capabilities.</p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
                <Coins className="w-6 h-6 text-[var(--accent-2)] mb-3" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Pay-Per-Use</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">No subscriptions. Pay a flat 0.02 cUSD microtransaction only when you use the app.</p>
              </div>

              <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
                <Sparkles className="w-6 h-6 text-[var(--success)] mb-3" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Optimized for Celo</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">Integrated directly with Celo Sepolia and MiniPay for instant transaction clearing.</p>
              </div>
            </div>

            <section className="pt-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Our Vision</h2>
              <p>
                We believe that users should not be tied down to costly SaaS plans for occasional content generation. By combining decentralized stablecoins (cUSD) with on-demand AI server calls, we enable a utility-based content system that keeps cost minimal and access open to everyone worldwide.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[var(--bg-surface)]/40 border-t border-[var(--border-subtle)]/50 py-6">
        <div className="max-w-6xl w-full mx-auto px-4 text-center text-xs text-[var(--text-faint)] font-semibold tracking-wide flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CaptionAI • Built for Celo Proof of Ship</p>
          <div className="flex gap-4">
            <a href="/privacy.html" className="hover:text-[var(--accent)] transition-colors">Privacy</a>
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
    <AboutPage />
  </React.StrictMode>
)
