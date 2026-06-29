import { useState } from 'react'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import OverviewPanel from './components/panels/OverviewPanel'
import OcrPanel from './components/panels/OcrPanel'
import FinancialPanel from './components/panels/FinancialPanel'
import TimelinePanel from './components/panels/TimelinePanel'
import DecisionPanel from './components/panels/DecisionPanel'
import AgentPanel from './components/panels/AgentPanel'
import NetworkPanel from './components/panels/NetworkPanel'

const CASE_ID = 1

export default function App() {
  const [panel, setPanel] = useState('overview')

  const panels: Record<string, JSX.Element> = {
    overview: <OverviewPanel caseId={CASE_ID} onNav={setPanel} />,
    ocr:      <OcrPanel caseId={CASE_ID} />,
    dana:     <FinancialPanel caseId={CASE_ID} />,
    timeline: <TimelinePanel caseId={CASE_ID} onNav={setPanel} />,
    decision: <DecisionPanel caseId={CASE_ID} onNav={setPanel} />,
    agent:    <AgentPanel caseId={CASE_ID} />,
    network:  <NetworkPanel caseId={CASE_ID} />,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar panel={panel} onPanel={setPanel} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={panel} onNav={setPanel} />
        <div id="content-area" style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {panels[panel] ?? <div style={{ color: 'var(--text2)' }}>Panel tidak ditemukan</div>}
        </div>
      </div>
    </div>
  )
}
