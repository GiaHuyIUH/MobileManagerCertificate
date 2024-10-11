// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, //include user and organization
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    addEnrollmentToUser: (state, action) => {
      if (state.user) {
        state.user.enrollments.push(action.payload);
      }
    },
    updateEnrollment: (state, action) => {
      if (state.user) {
        state.user.enrollments = state.user.enrollments.map((enrollment) => {
          if (enrollment._id === action.payload._id) {
            return action.payload;
          }
          return enrollment;
        });
      }
    },
    addWalletAddress: (state, action) => {
      if (state.user) {
        state.user.walletAddress = action.payload;
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeEnrollment: (state, action) => {
      if (state.user) {
        state.user.enrollments = state.user.enrollments.map((enrollment) => {
          if (enrollment._id === action.payload) {
            return { ...enrollment, completed: true };
          }
          return enrollment;
        });
      }
    },
    addCertificateToUser: (state, action) => {
      if (state.user) {
        state.user.certificates.push(action.payload);
      }
    },
  },
//   
});

export const {
  logoutUser,
  addEnrollmentToUser,
  updateEnrollment,
  completeEnrollment,
  addWalletAddress,
  updateUser,
  clearError,
  addCertificateToUser,
  login
} = authSlice.actions;
export default authSlice.reducer;
