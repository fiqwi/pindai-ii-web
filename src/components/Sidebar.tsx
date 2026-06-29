const navItems = [
  { id: 'overview',  icon: 'ti-layout-dashboard', label: 'Overview', section: 'INVESTIGASI' },
  { id: 'ocr',       icon: 'ti-file-text',          label: 'Dokumen & OCR', badge: '247', badgeType: 'ok' },
  { id: 'network',   icon: 'ti-chart-network',      label: 'Jaringan Entitas', badge: '138' },
  { id: 'dana',      icon: 'ti-cash',               label: 'Aliran Dana', badge: '!', badgeType: 'alert', section: 'ANALISIS' },
  { id: 'timeline',  icon: 'ti-timeline',            label: 'Kronologi', badge: '27' },
  { id: 'decision',  icon: 'ti-scale',              label: 'Dukungan Keputusan' },
  { id: 'agent',     icon: 'ti-robot',              label: 'AI Agent', section: 'AI' },
]

export default function Sidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  let lastSection = ''
  return (
    <div style={{
      width: 220, minWidth: 220, background: 'var(--bg2)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '12px 0', overflowY: 'auto',
    }}>
      {navItems.map(item => {
        const showSection = item.section && item.section !== lastSection
        if (item.section) lastSection = item.section
        return (
          <div key={item.id}>
            {showSection && (
              <div style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 600, color: 'var(--text3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                {item.section}
              </div>
            )}
            <div
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', cursor: 'pointer',
                fontSize: 12, color: active === item.id ? 'var(--blue)' : 'var(--text2)',
                borderLeft: `2px solid ${active === item.id ? 'var(--blue)' : 'transparent'}`,
                background: active === item.id ? 'rgba(31,111,235,.12)' : 'transparent',
                fontWeight: active === item.id ? 500 : 400,
                transition: 'all .12s',
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 15, flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 500,
                  padding: '1px 6px', borderRadius: 10,
                  background: item.badgeType === 'alert' ? 'rgba(248,81,73,.15)' : item.badgeType === 'ok' ? 'rgba(63,185,80,.12)' : 'var(--bg3)',
                  color: item.badgeType === 'alert' ? 'var(--red)' : item.badgeType === 'ok' ? 'var(--green)' : 'var(--text3)',
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
