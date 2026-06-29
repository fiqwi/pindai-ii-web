import { useEffect, useState } from 'react'
import { getEntities } from '../../api/client'

export default function NetworkPanel({ caseId }: { caseId: number }) {
  const [entities, setEntities] = useState<any[]>([])

  useEffect(() => {
    getEntities(caseId).then(r => setEntities(r.data)).catch(() => {})
  }, [caseId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-chart-network" /> Jaringan Entitas — Visualisasi Lengkap</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="pill pill-blue">138 entitas</span>
            <span className="pill pill-amber">247 relasi</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <svg width="100%" viewBox="0 0 640 380" role="img">
            <title>Jaringan entitas kasus</title>
            <defs>
              <marker id="nb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* Center: Agus Santoso */}
            <circle cx="320" cy="190" r="34" fill="rgba(240,136,62,.15)" stroke="#f0883e" strokeWidth="1.5"/>
            <text x="320" y="185" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f0883e" fontFamily="Inter,sans-serif">Agus</text>
            <text x="320" y="197" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f0883e" fontFamily="Inter,sans-serif">Santoso</text>
            <text x="320" y="210" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Tersangka</text>

            {/* PT Karya Maju */}
            <line x1="291" y1="162" x2="180" y2="82" stroke="#f85149" strokeWidth="2" opacity=".7" markerEnd="url(#nb)"/>
            <rect x="110" y="54" width="120" height="50" rx="8" fill="rgba(88,166,255,.12)" stroke="#58a6ff" strokeWidth="0.5"/>
            <text x="170" y="74" textAnchor="middle" fontSize="9" fontWeight="500" fill="#58a6ff" fontFamily="Inter,sans-serif">PT Karya Maju</text>
            <text x="170" y="87" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Kontraktor utama</text>
            <text x="170" y="98" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Direktur AS</text>
            <text x="230" y="108" textAnchor="middle" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">direktur</text>

            {/* CV Sentosa Abadi */}
            <line x1="349" y1="162" x2="460" y2="82" stroke="#f85149" strokeWidth="1.5" opacity=".6" markerEnd="url(#nb)"/>
            <rect x="410" y="54" width="118" height="50" rx="8" fill="rgba(88,166,255,.1)" stroke="#58a6ff" strokeWidth="0.5"/>
            <text x="469" y="74" textAnchor="middle" fontSize="9" fontWeight="500" fill="#58a6ff" fontFamily="Inter,sans-serif">CV Sentosa Abadi</text>
            <text x="469" y="87" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Sub-kontraktor</text>
            <text x="469" y="98" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Pemilik AS</text>

            {/* Rudi Darmawan PPK */}
            <line x1="287" y1="190" x2="130" y2="190" stroke="#bc8cff" strokeWidth="1.5" opacity=".6" strokeDasharray="4 3" markerEnd="url(#nb)"/>
            <rect x="30" y="165" width="100" height="50" rx="8" fill="rgba(188,140,255,.1)" stroke="#bc8cff" strokeWidth="0.5"/>
            <text x="80" y="185" textAnchor="middle" fontSize="9" fontWeight="500" fill="#bc8cff" fontFamily="Inter,sans-serif">Rudi Darmawan</text>
            <text x="80" y="198" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">PPK · Saksi</text>
            <text x="80" y="210" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Kem. PUPR</text>
            <text x="178" y="183" textAnchor="middle" fontSize="7" fill="#bc8cff" fontFamily="Inter,sans-serif">koordinasi</text>

            {/* BCA */}
            <line x1="320" y1="224" x2="320" y2="278" stroke="#3fb950" strokeWidth="2" opacity=".6" markerEnd="url(#nb)"/>
            <rect x="255" y="278" width="130" height="44" rx="8" fill="rgba(63,185,80,.1)" stroke="#3fb950" strokeWidth="0.5"/>
            <text x="320" y="296" textAnchor="middle" fontSize="9" fontWeight="500" fill="#3fb950" fontFamily="Inter,sans-serif">BCA ****4821</text>
            <text x="320" y="310" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Rekening pribadi · Rp 4,75M masuk</text>
            <text x="346" y="270" textAnchor="middle" fontSize="7" fill="#3fb950" fontFamily="Inter,sans-serif">rekening</text>

            {/* Addendum */}
            <line x1="353" y1="190" x2="510" y2="190" stroke="#f0883e" strokeWidth="1" opacity=".5" strokeDasharray="4 3" markerEnd="url(#nb)"/>
            <rect x="510" y="165" width="118" height="50" rx="8" fill="rgba(240,136,62,.08)" stroke="#f0883e" strokeWidth="0.5"/>
            <text x="569" y="185" textAnchor="middle" fontSize="9" fontWeight="500" fill="#f0883e" fontFamily="Inter,sans-serif">Addendum 1–4</text>
            <text x="569" y="198" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Markup Rp 2,1M</text>
            <text x="569" y="210" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Tanpa PPK</text>

            {/* Unknown account */}
            <line x1="320" y1="322" x2="440" y2="340" stroke="#f85149" strokeWidth="1" opacity=".5" strokeDasharray="3 3" markerEnd="url(#nb)"/>
            <rect x="440" y="322" width="100" height="38" rx="8" fill="rgba(248,81,73,.1)" stroke="#f85149" strokeWidth="0.5"/>
            <text x="490" y="337" textAnchor="middle" fontSize="9" fontWeight="500" fill="#f85149" fontFamily="Inter,sans-serif">Rek. ???</text>
            <text x="490" y="350" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Tidak teridentifikasi</text>
            <text x="385" y="350" textAnchor="middle" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">Rp 1,8M transfer</text>

            {/* Legend */}
            <text x="30" y="356" fontSize="8" fill="#484f58" fontFamily="Inter,sans-serif">Legenda: </text>
            <line x1="75" y1="353" x2="95" y2="353" stroke="#f85149" strokeWidth="1.5" markerEnd="url(#nb)"/>
            <text x="100" y="356" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">Kepemilikan/kontrol  </text>
            <line x1="180" y1="353" x2="200" y2="353" stroke="#bc8cff" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#nb)"/>
            <text x="205" y="356" fontSize="7" fill="#bc8cff" fontFamily="Inter,sans-serif">Relasi/koordinasi  </text>
            <line x1="275" y1="353" x2="295" y2="353" stroke="#3fb950" strokeWidth="1.5" markerEnd="url(#nb)"/>
            <text x="300" y="356" fontSize="7" fill="#3fb950" fontFamily="Inter,sans-serif">Aliran dana  </text>
          </svg>
        </div>
      </div>

      {/* Entity list */}
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="ti ti-list" /> Daftar Entitas</div></div>
        <div className="card-body" style={{ padding: '8px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {entities.map(e => {
            const riskColor = e.risk_level === 'high' ? 'var(--red)' : e.risk_level === 'medium' ? 'var(--amber)' : 'var(--text3)'
            return (
              <div key={e.id} style={{ background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px 12px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{e.name}</span>
                  <span className={`pill ${e.risk_level === 'high' ? 'pill-red' : e.risk_level === 'medium' ? 'pill-amber' : 'pill-dim'}`} style={{ marginLeft: 'auto' }}>
                    {e.risk_level}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text2)' }}>{e.role}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, lineHeight: 1.4 }}>{e.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
