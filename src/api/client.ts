import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE })

export const getCase = (id: number) => api.get(`/cases/${id}`)
export const getOverview = (id: number) => api.get(`/cases/${id}/overview`)
export const getDocuments = (id: number) => api.get(`/cases/${id}/documents`)
export const getDocument = (caseId: number, docId: number) => api.get(`/cases/${caseId}/documents/${docId}`)
export const getTimeline = (id: number) => api.get(`/cases/${id}/timeline`)
export const getFinancials = (id: number) => api.get(`/cases/${id}/financials`)
export const getEntities = (id: number) => api.get(`/cases/${id}/entities`)
export const getDecision = (id: number) => api.get(`/cases/${id}/decision`)
export const chatAgent = (caseId: number, messages: {role:string,content:string}[]) =>
  api.post('/agent/chat', { case_id: caseId, messages })
