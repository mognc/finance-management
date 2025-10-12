// Re-export the API client and notes API
export { apiClient, apiRequest, checkApiHealth } from './client';
export { notesApi } from './notes';
export { financeApi } from './finance';
export type { MonthlySummaryDTO, HistoricalSummaryDTO, HistoricalDataRequest, PDFReportRequest } from './finance';