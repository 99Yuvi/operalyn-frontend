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
      // Clear any stale auth state and redirect
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(err.response?.data ?? err)
  },
)

export default api
