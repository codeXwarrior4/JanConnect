import API from '../api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('janconnect_token')

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export const createIssue = async (payload) => {
  const response = await API.post('/api/issues', payload, {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return response.data
}

export const getAllIssues = async () => {
  const response = await API.get('/api/issues')
  return response.data
}

export const getMyIssues = async () => {
  const response = await API.get('/api/issues/my', {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return response.data
}

export const getIssueByComplaintId = async (complaintId) => {
  const response = await API.get(`/api/issues/${complaintId}`)
  return response.data
}

export const updateIssueStatus = async (id, status) => {
  const response = await API.patch(`/api/issues/${id}/status`, { status })
  return response.data
}