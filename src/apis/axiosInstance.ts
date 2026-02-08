import axios from 'axios'
import toast from 'react-hot-toast'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for global error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    toast.error(message)
    return Promise.reject(error)
  }
)

export default axiosClient
