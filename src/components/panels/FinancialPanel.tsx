import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { getFinancials } from '../../api/client'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function fmtRp(n: number) {
  if (n >= 1e9) return `Rp ${(n/1e9).toFixed(3)} M`
  return `Rp ${(n/1e6).toFixed(1)} M`
}

export default function FinancialPanel({ caseId }: { caseId: number }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getFinancials(caseId).then(r => setData(r.data)).catch(() => {})
  }, [caseId])

  if (!data) return <div style={{ color: 'var(--text2)', fontSize: 12, padding: 20 }}>Memuat data...</div>

  const months = Object.keys(data.monthly_chart)
  const chartData = {
    labels: months,
    datasets: [
      { label: 'Normal', data: months.map(m => data.monthly_chart[m].normal), backgroundColor: '#58a6ff', borderRadius: 3 },
      { label: 'Anomali', data: months.map(m => data.monthly_chart[m].anomali), backgroundColor: '#f85149', borderRadius: 3 },
    ],
  }

  const typeStyle: Record<string, {dot: string, amount: string}> = {
    flag: { dot: 'var(--amber)', amount: 'var(--amber)' },
    out:  { dot: 'var(--red)',   amount: 'var(--red)' },
    in:   { dot: 'var(--green)', amount: 'var(--green)' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Alert bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(248,81,73,.08)', border: '1px solid rgba(248,81,73,.2)',
        borderRadius: 'var(--r2)', padding: '10px 14px',
        fontSize: 11, color: '#f4a5a2',
      }}>
        <i className="ti ti-shield-exclamation" style={{ fontSize: 16, color: 'var(--red)', flexShrink: 0 }} />
        AI mendeteksi {data.summary.total_flagged} transaksi mencurigakan dengan total nilai {fmtRp(data.summary.total_flagged_amount)}.
        Pembayaran ganda menggunakan invoice identik terdeteksi dalam rentang 48 jam.
      </div>

      {/* Flow chart SVG */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-arrows-split" /> Peta Aliran Dana — AI-generated</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="pill pill-red">3 anomali</span>
            <span className="pill pill-amber">Rp {fmtRp(data.summary.total_flagged_amount)} terindikasi</span>
          </div>
        </div>
        <div className="card-body">
          <svg width="100%" viewBox="0 0 660 280" role="img">
            <defs>
              <marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>
            {/* PUPR */}
            <rect x="14" y="108" width="112" height="64" rx="8" fill="rgba(88,166,255,.1)" stroke="#58a6ff" strokeWidth="0.5"/>
            <text x="70" y="131" textAnchor="middle" fontSize="9" fontWeight="500" fill="#e6edf3" fontFamily="Inter,sans-serif">Kemen. PUPR</text>
            <text x="70" y="146" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Pemberi kerja</text>
            <text x="70" y="160" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Rp 18,5M</text>
            <line x1="126" y1="140" x2="156" y2="140" stroke="#58a6ff" strokeWidth="2" markerEnd="url(#fa)"/>
            <text x="141" y="134" textAnchor="middle" fontSize="7" fill="#58a6ff" fontFamily="Inter,sans-serif">Rp 18,5M</text>
            {/* PT KM */}
            <rect x="156" y="108" width="112" height="64" rx="8" fill="rgba(88,166,255,.1)" stroke="#58a6ff" strokeWidth="0.5"/>
            <text x="212" y="131" textAnchor="middle" fontSize="9" fontWeight="500" fill="#e6edf3" fontFamily="Inter,sans-serif">PT Karya Maju</text>
            <text x="212" y="146" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Tersangka AS</text>
            <text x="212" y="160" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Direktur Utama</text>
            <line x1="268" y1="120" x2="308" y2="76" stroke="#f85149" strokeWidth="2" markerEnd="url(#fa)"/>
            <text x="294" y="95" textAnchor="middle" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">Rp 4,75M</text>
            <line x1="268" y1="140" x2="308" y2="140" stroke="#f85149" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#fa)"/>
            <text x="289" y="134" textAnchor="middle" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">Rp 2,1M</text>
            <line x1="268" y1="162" x2="308" y2="210" stroke="#f0883e" strokeWidth="1.5" markerEnd="url(#fa)"/>
            <text x="294" y="194" textAnchor="middle" fontSize="7" fill="#f0883e" fontFamily="Inter,sans-serif">Rp 6,2M</text>
            {/* BCA */}
            <rect x="308" y="52" width="120" height="44" rx="8" fill="rgba(248,81,73,.12)" stroke="#f85149" strokeWidth="1.5" strokeDasharray="4 3"/>
            <text x="368" y="70" textAnchor="middle" fontSize="9" fontWeight="500" fill="#f85149" fontFamily="Inter,sans-serif">BCA ****4821</text>
            <text x="368" y="85" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Rekening Pribadi AS</text>
            {/* Addendum */}
            <rect x="308" y="118" width="120" height="44" rx="8" fill="rgba(88,166,255,.08)" stroke="#58a6ff" strokeWidth="0.5"/>
            <text x="368" y="136" textAnchor="middle" fontSize="9" fontWeight="500" fill="#58a6ff" fontFamily="Inter,sans-serif">Addendum Markup</text>
            <text x="368" y="151" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Tanpa otorisasi PPK</text>
            {/* CV Sentosa */}
            <rect x="308" y="190" width="120" height="44" rx="8" fill="rgba(240,136,62,.12)" stroke="#f0883e" strokeWidth="0.5"/>
            <text x="368" y="208" textAnchor="middle" fontSize="9" fontWeight="500" fill="#f0883e" fontFamily="Inter,sans-serif">CV Sentosa Abadi</text>
            <text x="368" y="222" textAnchor="middle" fontSize="8" fill="#8b949e" fontFamily="Inter,sans-serif">Sub-kontraktor</text>
            <line x1="428" y1="212" x2="468" y2="212" stroke="#f0883e" strokeWidth="1.5" markerEnd="url(#fa)"/>
            {/* Unknown */}
            <rect x="468" y="74" width="100" height="44" rx="8" fill="rgba(248,81,73,.12)" stroke="#f85149" strokeWidth="1.5" strokeDasharray="4 3"/>
            <line x1="428" y1="74" x2="468" y2="96" stroke="#f85149" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#fa)"/>
            <text x="518" y="92" textAnchor="middle" fontSize="9" fontWeight="500" fill="#f85149" fontFamily="Inter,sans-serif">Rek. ???</text>
            <text x="518" y="107" textAnchor="middle" fontSize="7" fill="#8b949e" fontFamily="Inter,sans-serif">Tidak teridentifikasi</text>
            <text x="449" y="68" textAnchor="middle" fontSize="7" fill="#f85149" fontFamily="Inter,sans-serif">Rp 1,8M</text>
            {/* unknown company */}
            <rect x="468" y="190" width="100" height="44" rx="8" fill="rgba(248,81,73,.15)" stroke="#f85149" strokeWidth="0.5"/>
            <text x="518" y="216" textAnchor="middle" fontSize="11" fontWeight="500" fill="#f85149" fontFamily="Inter,sans-serif">?</text>
            <text x="320" y="260" textAnchor="middle" fontSize="9" fill="#484f58" fontFamily="Inter,sans-serif">— — pembayaran anomali &nbsp;&nbsp; —— aliran normal</text>
          </svg>
        </div>
      </div>

      <div className="two-col">
        {/* Bar chart */}
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-chart-bar" /> Transaksi per Bulan</div></div>
          <div className="card-body">
            <div style={{ position: 'relative', width: '100%', height: 160 }}>
              <Bar data={chartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { stacked: true, ticks: { color: '#8b949e', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                  y: { stacked: true, ticks: { color: '#8b949e', font: { size: 11 }, stepSize: 2 }, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                },
              }} />
            </div>
          </div>
        </div>

        {/* Transaction log */}
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-flag" /> Log Transaksi Anomali</div></div>
          <div className="card-body" style={{ padding: '8px 14px' }}>
            {data.transactions.map((tx: any) => {
              const s = typeStyle[tx.tx_type] || typeStyle.in
              return (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, marginTop: 3, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{tx.description}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{tx.date} · {tx.from_party} → {tx.to_party}</div>
                    {tx.flag_reason && (
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 5, background: 'var(--amber-bg)', color: 'var(--amber)', display: 'inline-block', marginTop: 3 }}>
                        {tx.flag_reason}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', color: s.amount }}>
                    {fmtRp(tx.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
