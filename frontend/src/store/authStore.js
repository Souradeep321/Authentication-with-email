import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development'
        ? 'http://localhost:5000/api/v1'
        : '/api/v1',
    withCredentials: true,
});

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/signup', credentials);
            toast.success('Registration successful. Please check your email for verification.');
            console.log(response.data);
            set({ user: response.data.data, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, error: error.response.data.message || "Error signing up", isLoading: false });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', credentials);
            toast.success('Login successful.');
            set({ user: response.data.data, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, error: error.response.data.message || "Error logging in", isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await api.get('/auth/check-auth');
            set({ user: response.data.data, isAuthenticated: true, error: null, isCheckingAuth: false });
        } catch (error) {
            set({ isAuthenticated: false, error: null, isCheckingAuth: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/auth/logout');
            toast.success('Logout successful.');
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, error: error.response.data.message || "Error logging out", isLoading: false });
        }
    },
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/verify-email', { code });
            toast.success('Email verified successfully.');
            set({ user: response.data.data,message: response.data.message, isAuthenticated: true, error: null, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    resendVerificationEmail: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/resend-verification', { email });
            toast.success('Verification email sent successfully.');
            set({ user: response.data.data, message: response.data.message, error: null, isLoading: false });
        } catch (error) {
            set({ message: null, error: error.response.data.message || "Error resending verification email", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/forgot-password', { email });
            toast.success('Password reset link sent successfully.');
            set({ message: response.data.message, error: null, isLoading: false });
        } catch (error) {
            set({ message: null, error: error.response.data.message || "Error resetting password", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
            // toast.success('Password reset successfully.');
            set({ message: response.data.message, error: null, isLoading: false });
        } catch (error) {
            set({ message: null, error: error.response.data.message || "Error resetting password", isLoading: false });
            throw error;
        }
    }
}));