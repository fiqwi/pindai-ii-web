export default function Topbar({ panel, onPanel }: { panel: string; onPanel: (p: string) => void }) {
  return (
    <div style={{
      height: 52, minHeight: 52, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px',
      background: 'var(--bg2)', borderBottom: '1px solid var(--border)', zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'linear-gradient(135deg,#1c6b3a,#0d3b20)',
            border: '1px solid rgba(63,185,80,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '.04em',
          }}>KPK</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pindai</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '.04em' }}>INVESTIGATION AI</div>
          </div>
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 'var(--r)', padding: '4px 10px', fontSize: 11,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
          <span style={{ color: 'var(--text2)' }}>PKP-2024-0042</span>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>Pengadaan Infrastruktur 2023–2024</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
          AI Agent aktif
        </div>
        <button className="btn primary" onClick={() => onPanel('agent')}>
          <i className="ti ti-sparkles" style={{ fontSize: 13 }} /> Tanya AI
        </button>
      </div>
    </div>
  )
}
