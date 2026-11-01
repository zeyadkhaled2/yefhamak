'use client'

import { useEffect, useState } from 'react'
import MockWorkspace from './MockWorkspace'
import LiveWorkspace from './LiveWorkspace'
import './demo.css'

export default function DemoWorkspace({ view }: { view: 'chat' | 'orders' }) {
  const [mode, setMode] = useState<'mock' | 'live'>('mock')
  const [error, setError] = useState('')
  useEffect(() => { try { if (localStorage.getItem('yefhamak.workspace.mode') === 'live') setMode('live') } catch { /* Default to mock when storage is unavailable. */ } }, [])
  function changeMode(next: 'mock' | 'live') {
    if (next === mode) return
    // Switching mode unmounts the current workspace. Don't interrupt an active turn.
    if (document.querySelector('[data-live-busy="true"]')) { setError('Wait for the current backend operation before switching modes.'); return }
    try { localStorage.setItem('yefhamak.workspace.mode', next) } catch { /* Mode still works in memory. */ }
    setError(''); setMode(next)
  }
  return <><div className="workspace-mode-bar" dir="ltr"><strong>Demo workspace</strong><div role="group" aria-label="Workspace mode"><button aria-pressed={mode === 'mock'} onClick={() => changeMode('mock')}>Mock · no API</button><button aria-pressed={mode === 'live'} onClick={() => changeMode('live')}>Live · your backend</button></div><span>{error || (mode === 'mock' ? 'Scripted, browser-only demo' : 'Connect explicitly. Sending may use model quota.')}</span></div>{mode === 'mock' ? <MockWorkspace view={view} /> : <LiveWorkspace view={view} />}</>
}
