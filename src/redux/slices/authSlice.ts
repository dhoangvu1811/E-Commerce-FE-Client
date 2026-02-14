import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import {
  LoginRequest,
  RegisterRequest,
  User,
  ChangePasswordRequest,
  UpdateProfileRequest,
  SendVerificationEmailRequest,
  VerifyAccountRequest,
  SessionsResponse,
  RevokeSessionRequest
} from '@/types/auth.type'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng nhập thất bại'
      )
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng ký thất bại'
      )
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng xuất thất bại'
      )
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile()
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lấy thông tin người dùng thất bại'
      )
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cập nhật thông tin thất bại'
      )
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      await userService.changePassword(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đổi mật khẩu thất bại'
      )
    }
  }
)

export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (data: SendVerificationEmailRequest, { rejectWithValue }) => {
    try {
      const response = await authService.sendVerificationEmail(data)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gửi email xác thực thất bại'
      return rejectWithValue(message)
    }
  }
)

export const verifyAccount = createAsyncThunk(
  'auth/verifyAccount',
  async (data: VerifyAccountRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyAccount(data)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Xác minh tài khoản thất bại'
      return rejectWithValue(message)
    }
  }
)

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await userService.uploadAvatar(file)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload ảnh thất bại'
      return rejectWithValue(message)
    }
  }
)

export const fetchMySessions = createAsyncThunk(
  'auth/fetchMySessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getMySessions()
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Lấy danh sách phiên đăng nhập thất bại'
      return rejectWithValue(message)
    }
  }
)

export const revokeMySession = createAsyncThunk(
  'auth/revokeMySession',
  async (data: RevokeSessionRequest, { rejectWithValue }) => {
    try {
      await userService.revokeSession(data)
      return data.sessionId
    } catch (error: any) {
      const message = error.response?.data?.message || 'Thu hồi phiên đăng nhập thất bại'
      return rejectWithValue(message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user // Response structure { user, sessionId }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        // Usually register doesn't auto-login or returns user?
        // API Doc says returns User.
        // Assuming we redirect to login or auto-login.
        // For now, simple state update if needed, or nothing.
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        // Silent loading mostly? Or global loading
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  }
})

export const { clearAuth } = authSlice.actions
export default authSlice.reducer
