import { createSlice } from "@reduxjs/toolkit"

export const adminSlice = createSlice({
  name: 'authentication_admin',
  initialState: {
    username: null,
    isAuthenticated: false
  },
  reducers: {
    admin_login: (state, action) => {
      state.username = action.payload.username;  
      state.isAuthenticated = true;     
    },
    admin_logout: (state) => {
      state.username = null;
      state.isAuthenticated = false;    
    }
  }
})

export const { admin_login, admin_logout } = adminSlice.actions
export default adminSlice.reducer
