import { useEffect, useState } from 'react'
import { getDocuments, getDocument } from '../../api/client'

const typeIcon: Record<string, { bg: string; color: string; icon: string }> = {
  bap:      { bg: 'var(--blue-bg)', color: 'var(--blue)', icon: 'ti-file-text' },
  finansial:{ bg: 'var(--amber-bg)', color: 'var(--amber)', icon: 'ti-cash' },
  digital:  { bg: 'var(--green-bg)', color: 'var(--green)', icon: 'ti-device-laptop' },
}

export default function OcrPanel({ caseId }: { caseId: number }) {
  const [docs, setDocs] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    getDocuments(caseId).then(r => { setDocs(r.data); if (r.data.length > 0) setSelected(r.data[0]) }).catch(() => {})
  }, [caseId])

  useEffect(() => {
    if (selected) {
      getDocument(caseId, selected.id).then(r => setDetail(r.data)).catch(() => {})
    }
  }, [selected, caseId])

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {/* Document list */}
      <div style={{ width: 280, minWidth: 280 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-files" /> Dokumen Kasus</div>
            <span className="pill pill-blue">{docs.length} dok</span>
          </div>
          <div className="card-body" style={{ padding: '8px 12px' }}>
            {docs.map(doc => {
              const s = typeIcon[doc.doc_type] || typeIcon.bap
              return (
                <div key={doc.id} onClick={() => setSelected(doc)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                  opacity: selected?.id === doc.id ? 1 : 0.8,
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, background: s.bg, color: s.color }}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: selected?.id === doc.id ? 'var(--blue)' : 'var(--text)' }}>{doc.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{doc.pages} hal · OCR {doc.ocr_accuracy}%</div>
                  </div>
                  <span className={`pill ${doc.status === 'selesai' ? 'pill-green' : doc.status === 'proses' ? 'pill-amber' : 'pill-dim'}`}>
                    {doc.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Document viewer */}
      {detail && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-header" style={{ padding: '8px 12px' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{detail.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
                  <button style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>‹</button>
                  <span>Hal 1 / {detail.pages}</span>
                  <button style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>›</button>
                </div>
              </div>
            </div>
            <div style={{ margin: 10, background: '#1e2533', border: '1px solid rgba(255,255,255,.06)', borderRadius: 4, padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 8.5, color: '#b8c4d0', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto' }}>
              {detail.ocr_text}
            </div>
          </div>

          {/* Extracted entities */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ti ti-tag" /> Entitas Diekstrak — AI NER</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--blue-bg)', color: 'var(--blue)' }}>Person</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--amber-bg)', color: 'var(--amber)' }}>Company</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--green-bg)', color: 'var(--green)' }}>Amount</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--red-bg)', color: 'var(--red)' }}>Date</span>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {detail.entities?.map((e: any, i: number) => {
                const color = e.type === 'person' ? 'var(--blue)' : e.type === 'company' ? 'var(--amber)' : e.type === 'amount' ? 'var(--green)' : 'var(--red)'
                const bg = e.type === 'person' ? 'var(--blue-bg)' : e.type === 'company' ? 'var(--amber-bg)' : e.type === 'amount' ? 'var(--green-bg)' : 'var(--red-bg)'
                return (
                  <span key={i} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: bg, color, cursor: 'pointer' }}>
                    {e.text}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: 'rgba(31,111,235,.07)', border: '1px solid rgba(31,111,235,.2)', borderRadius: 'var(--r2)', padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <i className="ti ti-sparkles" /> Ringkasan AI — {detail.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7 }}>{detail.summary}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>Akurasi OCR:</span>
              <div style={{ height: 4, width: 120, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--green)', width: `${detail.ocr_accuracy}%`, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--green)' }}>{detail.ocr_accuracy}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
