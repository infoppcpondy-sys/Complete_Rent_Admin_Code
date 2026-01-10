// src/redux/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    role: '',
    userType: '',
    isVerified: false,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    setAdminData: (state, action) => {
      const { name, role, userType, isVerified } = action.payload;
      state.name = name;
      state.role = role;
      state.userType = userType;
      state.isVerified = isVerified;

    },
  },
});

export const { setName, setRole, setUserType, setIsVerified, setAdminData } = adminSlice.actions;
export default adminSlice.reducer;



 




