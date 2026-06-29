import { useEffect, useState } from 'react'
import { getTimeline } from '../../api/client'

const severityStyle: Record<string, { bg: string; color: string; icon: string }> = {
  critical: { bg: 'var(--red-bg)', color: 'var(--red)', icon: 'ti-alert-circle' },
  warning:  { bg: 'var(--amber-bg)', color: 'var(--amber)', icon: 'ti-alert-triangle' },
  ok:       { bg: 'var(--green-bg)', color: 'var(--green)', icon: 'ti-check' },
  info:     { bg: 'var(--blue-bg)', color: 'var(--blue)', icon: 'ti-info-circle' },
}

export default function TimelinePanel({ caseId, onNav }: { caseId: number; onNav: (p: string) => void }) {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    getTimeline(caseId).then(r => setEvents(r.data)).catch(() => {})
  }, [caseId])

  const critical = events.filter(e => e.severity === 'critical').length
  const warning = events.filter(e => e.severity === 'warning').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-timeline" style={{ fontSize: 16, color: 'var(--text2)' }} />
          Kronologi investigasi — {events.length} peristiwa
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="pill pill-red">Kritis: {critical}</span>
          <span className="pill pill-amber">Penting: {warning}</span>
          <span className="pill pill-dim">Normal: {events.length - critical - warning}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {/* Timeline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {events.map((e, i) => {
            const s = severityStyle[e.severity] || severityStyle.info
            const d = new Date(e.date)
            const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={e.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.4 }}>{dateLabel}</div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, margin: '4px 0', background: s.bg, color: s.color }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  {i < events.length - 1 && <div style={{ width: 1, background: 'var(--border)', flex: 1, minHeight: 12 }} />}
                </div>
                <div style={{
                  flex: 1, background: 'var(--bg2)', border: `1px solid var(--border)`,
                  borderLeft: `3px solid ${e.severity === 'critical' ? 'var(--red)' : e.severity === 'warning' ? 'var(--amber)' : 'transparent'}`,
                  borderRadius: 'var(--r2)', padding: '10px 13px', marginBottom: 10, cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>{e.title}</div>
                    <span className={`pill ${e.severity === 'critical' ? 'pill-red' : e.severity === 'warning' ? 'pill-amber' : 'pill-dim'}`}>
                      {e.severity === 'critical' ? 'Anomali kritis' : e.severity === 'warning' ? 'Penting' : 'Normal'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.55 }}>{e.description}</div>
                  {e.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 7 }}>
                      {e.tags.map((t: string) => (
                        <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: 'var(--bg3)', color: 'var(--text3)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {e.source && (
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-file" /> {e.source}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chat sidebar */}
        <div style={{
          width: 300, minWidth: 300, background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--r3)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg,#1c6b3a,#0d3b20)', border: '1px solid rgba(63,185,80,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--green)',
            }}>
              <i className="ti ti-robot" />
            </div>
            <div>
              <div className="t3">AI Investigation Agent</div>
              <div className="t4">247 dok · 4.820 hal terindeks</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text2)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
              aktif
            </div>
          </div>
          <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 300 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
              <div style={{ maxWidth: 248, padding: '8px 11px', borderRadius: '10px 10px 10px 2px', fontSize: 11, lineHeight: 1.6, background: 'var(--bg3)', color: 'var(--text)' }}>
                Selamat datang, Penyidik. Saya telah menganalisis 247 dokumen. Klik <strong style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => onNav('agent')}>AI Agent</strong> untuk mulai bertanya.
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>09:14</div>
            </div>
          </div>
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
            <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNav('agent')}>
              <i className="ti ti-robot" /> Buka AI Agent →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
