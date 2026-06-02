import api from './axios'

export const dashboardApi = {
  getOverview() {
    return api.get('/dashboard/overview')
  },
  getWorkload(period = 'week') {
    return api.get('/dashboard/workload', { params: { period } })
  },
}

