import { createSlice } from "@reduxjs/toolkit"

export const adminSlice = createSlice({
  name: 'authentication_admin',
  initialState: {
    // email: null,
    // userid: null,
    username: null,
    isAuthenticated: false
  },
  reducers: {
    admin_login: (state, action) => {
      // state.email = action.payload.email;
      // state.userid = action.payload.userid;
      state.username = action.payload.username;  // Assuming payload contains an object with email
      state.isAuthenticated = true;         // Set isAuthenticated to true when logged in
    },
    admin_logout: (state) => {
      // state.email = null;
      // state.userid = null;
      state.username = null;
      state.isAuthenticated = false;       // Set isAuthenticated to false when logged out
    }
  }
})

export const { admin_login, admin_logout } = adminSlice.actions
export default adminSlice.reducer
