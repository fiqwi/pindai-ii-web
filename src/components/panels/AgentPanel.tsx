import { useState, useRef, useEffect } from 'react'
import { chatAgent } from '../../api/client'

interface Message { role: 'user' | 'assistant'; content: string; time: string }

const QUICK = [
  'Apa bukti terkuat hubungan antara AS dan RD?',
  'Tunjukkan semua inkonsistensi dalam BAP tersangka Agus Santoso',
  'Siapkan draft surat permintaan data rekening ke BCA untuk kasus ini',
  'Bandingkan keterangan AS dan RD, temukan kontradiksi utama',
  'Buat ringkasan eksekutif kasus ini untuk pimpinan KPK',
]

const WELCOME: Message = {
  role: 'assistant',
  time: '09:14',
  content: `Selamat datang, Penyidik. Saya telah menganalisis 247 dokumen kasus Pengadaan Infrastruktur 2023–2024. Saya siap membantu Anda:

• Menjawab pertanyaan tentang isi dokumen BAP
• Menemukan inkonsistensi dan kontradiksi antar keterangan
• Menelusuri jalur aliran dana
• Menyusun draft dokumen tindakan penyidikan
• Menghasilkan ringkasan dan insight investigasi

Apa yang ingin Anda dalami hari ini?`,
}

export default function AgentPanel({ caseId }: { caseId: number }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text, time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      const res = await chatAgent(caseId, history)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply, time: now() }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.', time: now() }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#1c6b3a,#0d3b20)',
          border: '1px solid rgba(63,185,80,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: 'var(--green)',
        }}>
          <i className="ti ti-robot" />
        </div>
        <div>
          <div className="t2">AI Investigation Agent</div>
          <div className="t4">247 dokumen · 4.820 halaman terindeks · Model: Claude Sonnet</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
          aktif
        </div>
      </div>

      {/* Chat box */}
      <div className="card">
        {/* Messages */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 400, maxHeight: 520, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: m.role === 'user' ? 360 : 540,
                padding: '8px 11px', borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
              }}>
                {m.content}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>{m.time}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', borderRadius: '10px 10px 10px 2px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="typing-dots"><span /><span /><span /></div>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>AI Agent sedang menganalisis dokumen...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '10px 16px' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Pertanyaan yang disarankan:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} className="btn" style={{ fontSize: 10, padding: '5px 9px', textAlign: 'left', lineHeight: 1.4 }}>
                {q.length > 50 ? q.slice(0, 50) + '…' : q} →
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Tanya tentang dokumen kasus, minta draft, atau analisis..."
              style={{
                flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 'var(--r)', padding: '8px 13px', color: 'var(--text)',
                fontSize: 12, fontFamily: 'var(--font)', outline: 'none',
              }}
            />
            <button className="btn primary" onClick={() => send(input)} style={{ padding: '8px 16px' }} disabled={loading}>
              <i className="ti ti-send" /> Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
