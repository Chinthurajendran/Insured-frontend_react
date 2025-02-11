import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "authentication_user",
  initialState: {
    userid: null,
    username: null,
    useremail: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.userid = action.payload.userid
      state.username = action.payload.username
      state.useremail = action.payload.useremail
      state.isAuthenticated = action.payload.isAuthenticated
    },
    logout: (state) => {
      ;(state.userid = null),
        (state.username = null),
        (state.useremail = null),
        (state.isAuthenticated = false)
    },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
