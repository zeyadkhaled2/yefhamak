'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import MockWorkspace from './MockWorkspace'
import LiveWorkspace from './LiveWorkspace'
import './demo.css'

export default function DemoWorkspace({ view }: { view: 'chat' | 'orders' }) {
  const [mode, setMode] = useState<'mock' | 'live'>('mock')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem('yefhamak.workspace.theme') } catch {}
    setTheme(saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light')
  }, [])
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('yefhamak.workspace.theme', next) } catch {}
  }
  const [error, setError] = useState('')
  useEffect(() => { try { if (localStorage.getItem('yefhamak.workspace.mode') === 'live') setMode('live') } catch { /* Default to mock when storage is unavailable. */ } }, [])
  function changeMode(next: 'mock' | 'live') {
    if (next === mode) return
    // Switching mode unmounts the current workspace. Don't interrupt an active turn.
    if (document.querySelector('[data-live-busy="true"]')) { setError('Wait for the current backend operation before switching modes.'); return }
    try { localStorage.setItem('yefhamak.workspace.mode', next) } catch { /* Mode still works in memory. */ }
    setError(''); setMode(next)
  }
  return <div className="demo-workspace" data-theme={theme}><div className="workspace-mode-bar" dir="ltr"><strong>Demo workspace</strong><div role="group" aria-label="Workspace mode"><button aria-pressed={mode === 'mock'} onClick={() => changeMode('mock')}>Mock · no API</button><button aria-pressed={mode === 'live'} onClick={() => changeMode('live')}>Live · your backend</button></div><span>{error || (mode === 'mock' ? 'Scripted, browser-only demo' : 'Connect explicitly. Sending may use model quota.')}</span><button type="button" className="demo-theme-toggle" aria-pressed={theme === 'dark'} aria-label="Dark mode" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button></div>{mode === 'mock' ? <MockWorkspace view={view} /> : <LiveWorkspace view={view} />}</div>
}
