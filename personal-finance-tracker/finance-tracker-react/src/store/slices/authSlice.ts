import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { UserProfileDto } from '../../features/user/dto/UserProfileDto';

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (form: { username: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/auth/register', form);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (form: { username?: string; password?: string }, { rejectWithValue }) => {
        try {
            const res = await axios.put('/api/auth/profile', form);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'auth/deleteAccount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.delete('/api/auth/profile');
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Delete failed');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfileDto>) => {
                if (state.user) {
                    state.user.name = action.payload.username; // Update the user's name in the state
                }
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.user = null; // Clear user on successful deletion
                localStorage.removeItem('token');
            });
    },
});

export const loadUserFromToken = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const response = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { ...response.data, token };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Auth failed');
        }
    }
);


export const { logout } = authSlice.actions;
export default authSlice.reducer;
