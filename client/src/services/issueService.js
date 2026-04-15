import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export const createIssue = async(issueData) => {
    const response = await api.post('/issues', issueData)
    return response.data
}

export const getAllIssues = async() => {
    const response = await api.get('/issues')
    return response.data
}

export const getIssueByComplaintId = async(complaintId) => {
    const response = await api.get(`/issues/${complaintId}`)
    return response.data
}

export const updateIssueStatus = async(id, status) => {
    const response = await api.patch(`/issues/${id}/status`, { status })
    return response.data
}

export const loginUser = async(credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
}

export const registerUser = async(userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
}

export default api