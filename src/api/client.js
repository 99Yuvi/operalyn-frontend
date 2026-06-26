import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

/** Initialise CSRF cookie before any auth call */
export async function initCsrf() {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
}

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname
      // Don't redirect from public pages — only kick out of protected routes
      const isPublic = path === '/' || path.startsWith('/auth') || path.startsWith('/freelancers')
      if (!isPublic) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(err.response?.data ?? err)
  },
)

export default api
