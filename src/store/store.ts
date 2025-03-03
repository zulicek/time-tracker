import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import timeEntriesReducer from "./timeEntriesSlice";
import timerReducer from "./timerSlice";
import authReducer from "./authSlice";
import { getOrganizationMemberships, getServices } from "./timeEntriesSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

const initializeApp = createAsyncThunk('app/initialize', async (_, { dispatch }) => {
  await dispatch(getOrganizationMemberships());
  await dispatch(getServices());
});

export const store = configureStore({
  reducer: {
    timeEntries: timeEntriesReducer,
    timer: timerReducer,
    auth: authReducer,
  },
});


store.dispatch(initializeApp());

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;