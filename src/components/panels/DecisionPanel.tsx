import { useEffect, useState } from 'react'
import { getDecision } from '../../api/client'

export default function DecisionPanel({ caseId, onNav }: { caseId: number; onNav: (p: string) => void }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getDecision(caseId).then(r => setData(r.data)).catch(() => {})
  }, [caseId])

  if (!data) return <div style={{ color: 'var(--text2)', fontSize: 12, padding: 20 }}>Memuat data...</div>

  const rankColor = (rank: number) => rank <= 2 ? 'var(--red)' : rank <= 4 ? 'var(--amber)' : 'var(--blue)'
  const rankBg = (rank: number) => rank <= 2 ? 'var(--red-bg)' : rank <= 4 ? 'var(--amber-bg)' : 'var(--blue-bg)'
  const fillColor = (rank: number) => rank <= 2 ? 'var(--red)' : rank <= 4 ? 'var(--amber)' : 'var(--blue)'

  const riskCells = [
    { label: 'Markup biaya', level: 'mid', count: 1 },
    { label: 'Double payment', level: 'hi', count: 2 },
    { label: 'Pemindahan aset', level: 'hi', count: 1 },
    { label: 'Dokumen hilang', level: 'lo', count: 1 },
    { label: 'Kontradiksi saksi', level: 'mid', count: 3 },
    { label: 'AS tidak kooperatif', level: 'hi', count: 1 },
    { label: 'Kesalahan admin', level: 'lo', count: 2 },
    { label: 'Bukti tidak sah', level: 'lo', count: 1 },
    { label: 'Keterlambatan', level: 'mid', count: 1 },
  ]

  return (
    <div>
      {/* Metrics */}
      <div className="metrics-grid" style={{ marginBottom: 14 }}>
        <div className="metric-card">
          <div className="metric-label">Skor kekuatan bukti</div>
          <div className="metric-value">{data.evidence_score}<span style={{ fontSize: 14, color: 'var(--text2)' }}>/100</span></div>
          <div className="metric-sub up">Cukup kuat untuk dakwaan</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tindakan mendesak</div>
          <div className="metric-value" style={{ color: 'var(--red)' }}>{data.urgent_actions}</div>
          <div className="metric-sub danger">Harus dalam 7 hari</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Bukti terkumpul</div>
          <div className="metric-value">{data.evidence_collected}<span style={{ fontSize: 14, color: 'var(--text2)' }}>/{data.evidence_total}</span></div>
          <div className="metric-sub warn">{data.evidence_total - data.evidence_collected} bukti masih dibutuhkan</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Kesiapan persidangan</div>
          <div className="metric-value">{data.trial_readiness}<span style={{ fontSize: 14, color: 'var(--text2)' }}>%</span></div>
          <div className="metric-sub">Est. siap 8 minggu lagi</div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 14 }}>
        {/* Priority Matrix */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-list-numbers" /> Prioritas Tindakan — Scoring Matrix AI</div>
          </div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 4, marginBottom: 8, padding: '0 12px' }}>
              {['Tindakan', 'Urgensi', 'Dampak', 'Skor'].map(h => (
                <div key={h} style={{ fontSize: 9, color: 'var(--text3)', textAlign: h === 'Skor' ? 'right' : 'center' }}>{h}</div>
              ))}
            </div>
            {data.priority_matrix.map((item: any) => (
              <div key={item.rank} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', background: 'var(--bg3)', borderRadius: 'var(--r2)',
                marginBottom: 6, cursor: 'pointer',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600,
                  background: rankBg(item.rank), color: rankColor(item.rank),
                }}>{item.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{item.meta}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                    {['Urgensi: ' + item.urgency, 'Dampak: ' + item.impact, 'Feasibilitas: ' + item.feasibility].map(c => (
                      <span key={c} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 5, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text3)' }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{item.score}</div>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>/10</div>
                  <div style={{ width: 44, height: 3, background: 'var(--bg2)', borderRadius: 2, overflow: 'hidden', marginTop: 4, marginLeft: 'auto' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: fillColor(item.rank), width: `${item.score * 10}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-col">
          {/* Risk Matrix */}
          <div className="card">
            <div className="card-header"><div className="card-title"><i className="ti ti-chart-grid-dots" /> Risk Matrix — Dampak vs Kemungkinan</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'flex', alignItems: 'center', paddingBottom: 20 }}>Dampak ↑</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: 5, height: 190 }}>
                    {riskCells.map((rc, i) => (
                      <div key={i} style={{
                        borderRadius: 'var(--r)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer',
                        background: rc.level === 'hi' ? 'var(--red-bg)' : rc.level === 'mid' ? 'var(--amber-bg)' : 'var(--green-bg)',
                        border: '1px solid transparent',
                      }}>
                        <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>{rc.label}</div>
                        <div style={{ fontSize: 8, color: 'var(--text2)' }}>{rc.count} item</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 9, color: 'var(--text3)' }}>Rendah</span>
                    <span style={{ fontSize: 9, color: 'var(--text3)' }}>Kemungkinan →</span>
                    <span style={{ fontSize: 9, color: 'var(--text3)' }}>Tinggi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Tracker */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ti ti-shield-check" /> Tracker Bukti Kunci</div>
              <span style={{ fontSize: 10, color: 'var(--text2)' }}>{data.evidence_collected}/{data.evidence_total} terkumpul</span>
            </div>
            <div className="card-body" style={{ padding: '8px 14px' }}>
              {data.evidence_tracker.map((ev: any, i: number) => {
                const ratio = ev.collected / ev.total
                const pillClass = ratio === 1 ? 'pill-green' : ratio >= 0.5 ? 'pill-amber' : 'pill-red'
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: 'var(--bg3)', borderRadius: 'var(--r2)', marginBottom: 6, cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 'var(--r)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      background: ev.type === 'fin' ? 'var(--green-bg)' : ev.type === 'dig' ? 'var(--amber-bg)' : 'var(--blue-bg)',
                      color: ev.type === 'fin' ? 'var(--green)' : ev.type === 'dig' ? 'var(--amber)' : 'var(--blue)',
                    }}>
                      <i className={`ti ${ev.type === 'fin' ? 'ti-cash' : ev.type === 'dig' ? 'ti-device-laptop' : ev.total === 4 ? 'ti-contract' : 'ti-file-text'}`} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{ev.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 1 }}>{ev.meta}</div>
                    </div>
                    <span className={`pill ${pillClass}`}>{ev.collected}/{ev.total}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation bar */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        background: 'rgba(31,111,235,.07)', border: '1px solid rgba(31,111,235,.2)',
        borderRadius: 'var(--r2)', padding: '12px 16px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'rgba(31,111,235,.15)', border: '1px solid rgba(31,111,235,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--blue)',
        }}><i className="ti ti-sparkles" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue)', marginBottom: 6 }}>
            Rekomendasi AI — Langkah Kritis Minggu Ini
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{data.ai_recommendation}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => onNav('agent')}><i className="ti ti-sparkles" /> Buat semua dokumen tindakan →</button>
            <button className="btn" onClick={() => onNav('agent')}><i className="ti ti-file-description" /> Ringkasan eksekutif →</button>
            <button className="btn" onClick={() => onNav('agent')}><i className="ti ti-calculator" /> Kalkulasi kerugian negara →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
