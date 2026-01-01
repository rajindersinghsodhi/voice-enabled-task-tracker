import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  initialized: boolean;
  userId: string | null;
  userName: string | null;
  email: string | null;
  activeConnectionId?: string | null;
  selectedRole?: string | null;
}

const initialState: UserState = {
  initialized: false,
  userId: null,
  userName: null,
  email: null,
  selectedRole: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return {
          ...state,
          ...action.payload,
      };
    },
    clearUser: () => {
      return initialState;
    },
    setInitialized(state) {
      state.initialized = true; 
    }
  },
});

export const { setUser, clearUser, setInitialized } = userSlice.actions;
export default userSlice.reducer;