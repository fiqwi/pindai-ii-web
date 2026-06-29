import { useEffect, useState } from 'react'
import { getOverview } from '../../api/client'

function fmt(n: number) {
  if (n >= 1e9) return `Rp ${(n/1e9).toFixed(1)} T`
  if (n >= 1e6) return `Rp ${(n/1e6).toFixed(1)} M`
  return `Rp ${n.toLocaleString('id-ID')}`
}

export default function OverviewPanel({ caseId, onNav }: { caseId: number; onNav: (p: string) => void }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getOverview(caseId).then(r => setData(r.data)).catch(() => {})
  }, [caseId])

  if (!data) return <div style={{ color: 'var(--text2)', fontSize: 12, padding: 20 }}>Memuat data...</div>

  const { metrics, pipeline, recent_events, insights, recommendations } = data

  const severityColor: Record<string, string> = {
    critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--blue)', ok: 'var(--green)'
  }

  return (
    <div>
      {/* Metrics */}
      <div className="metrics-grid">
        {[
          { label: 'Dokumen terindeks', icon: 'ti-files', value: metrics.document_count, sub: `${metrics.page_count.toLocaleString()} halaman`, subClass: '' },
          { label: 'Entitas diekstrak', icon: 'ti-users', value: metrics.entity_count, sub: 'Otomatis AI', subClass: 'up' },
          { label: 'Insight AI', icon: 'ti-sparkles', value: metrics.insight_count, sub: '3 kritis', subClass: 'danger' },
          { label: 'Dugaan kerugian', icon: 'ti-coin', value: 'Rp 6,85 M', sub: 'Dari kontrak Rp 18,5 M', subClass: 'warn', raw: true },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label"><i className={`ti ${m.icon}`} />{m.label}</div>
            <div className="metric-value">{m.raw ? m.value : m.value.toLocaleString()}</div>
            <div className={`metric-sub ${m.subClass}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
        {pipeline.map((step: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              flex: 1, padding: '7px 4px', textAlign: 'center',
              background: step.status === 'done' ? 'rgba(63,185,80,.12)' : step.status === 'active' ? 'rgba(88,166,255,.12)' : 'var(--bg3)',
              borderRadius: 5, fontSize: 10, fontWeight: 500,
              color: step.status === 'done' ? 'var(--green)' : step.status === 'active' ? 'var(--blue)' : 'var(--text3)',
            }}>{step.label}</div>
            {i < pipeline.length - 1 && <span style={{ fontSize: 11, color: 'var(--text3)', padding: '0 4px' }}>›</span>}
          </div>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: 14 }}>
        {/* Insights */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-sparkles" /> Insight AI — {insights.length} temuan</div>
            <span className="pill pill-red">3 kritis</span>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {insights.map((ins: any, i: number) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 0',
                borderBottom: i < insights.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 'var(--r)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                  background: ins.type === 'danger' ? 'var(--red-bg)' : ins.type === 'warn' ? 'var(--amber-bg)' : 'var(--blue-bg)',
                  color: ins.type === 'danger' ? 'var(--red)' : ins.type === 'warn' ? 'var(--amber)' : 'var(--blue)',
                }}>
                  <i className={ins.type === 'danger' ? 'ti ti-alert-circle' : ins.type === 'warn' ? 'ti ti-alert-triangle' : 'ti ti-info-circle'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>{ins.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>{ins.source}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                    <div style={{ height: 3, flex: 1, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: 'var(--green)', width: `${ins.confidence}%` }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 26 }}>{ins.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="gap-col">
          <div className="card">
            <div className="card-header"><div className="card-title"><i className="ti ti-list-check" /> Rekomendasi Tindakan</div></div>
            <div className="card-body" style={{ padding: '8px 14px' }}>
              {recommendations.map((rec: any) => (
                <div key={rec.rank} onClick={() => onNav('decision')} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px 12px',
                  marginBottom: 6, cursor: 'pointer', transition: 'background .12s',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', minWidth: 18 }}>{rec.rank}.</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{rec.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{rec.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><i className="ti ti-timeline" /> Kronologi Terbaru</div></div>
            <div className="card-body" style={{ padding: '8px 14px' }}>
              {recent_events.map((e: any) => (
                <div key={e.id} onClick={() => onNav('timeline')} style={{
                  display: 'flex', gap: 10, padding: '8px 0',
                  borderBottom: '1px solid var(--border)', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                    background: e.severity === 'critical' ? 'var(--red-bg)' : e.severity === 'warning' ? 'var(--amber-bg)' : 'var(--blue-bg)',
                    color: severityColor[e.severity] || 'var(--text2)',
                  }}>
                    <i className={e.severity === 'critical' ? 'ti ti-alert-circle' : 'ti ti-info-circle'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>{e.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Bar */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        background: 'rgba(31,111,235,.07)', border: '1px solid rgba(31,111,235,.2)',
        borderRadius: 'var(--r2)', padding: '12px 16px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'rgba(31,111,235,.15)', border: '1px solid rgba(31,111,235,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--blue)',
        }}>
          <i className="ti ti-sparkles" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <i className="ti ti-sparkles" /> Ringkasan AI — Diperbarui otomatis
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>
            Kasus PKP-2024-0042 melibatkan tersangka <strong style={{ color: 'var(--text)' }}>Agus Santoso</strong> dalam dugaan korupsi pengadaan infrastruktur senilai Rp 18,5 M.
            AI mendeteksi <strong style={{ color: 'var(--red)' }}>double payment Rp 4,75 M</strong>, markup addendum ilegal Rp 2,1 M, dan transfer tidak teridentifikasi Rp 1,8 M.
            Skor kekuatan bukti: <strong style={{ color: 'var(--text)' }}>78/100</strong>. Estimasi kesiapan persidangan: 64% (8 minggu lagi).
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {['Double payment', 'Addendum ilegal', 'Benturan kepentingan', 'Transfer anonim', 'PPK terlibat'].map(chip => (
              <span key={chip} style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)',
              }}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
