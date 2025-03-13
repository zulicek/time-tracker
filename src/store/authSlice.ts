import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { TOKEN, ORGANIZATION_ID } from "../services/api";

interface AuthState {
  token: string | null;
  organizationId: string | null;
  loading: boolean;
  error: string | null;
}

const authData = localStorage.getItem("auth");
const { token, organizationId } = authData ? JSON.parse(authData) : {};

const initialState: AuthState = {
  token: token || null,
  organizationId: organizationId || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    loginUser(state) {
      state.token = TOKEN;
      state.organizationId = ORGANIZATION_ID;
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: TOKEN, organizationId: ORGANIZATION_ID })
      );
      message.success("Login successful");
    },
    logout(state) {
      state.token = null;
      state.organizationId = null;
      localStorage.removeItem("auth");
      message.info("Logout successful");
    },
  },
});

export const { setLoading, setError, loginUser, logout } = authSlice.actions;
export default authSlice.reducer;
