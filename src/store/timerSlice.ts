import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { AppDispatch, RootState } from "../store/store";
import { addTimeEntryApi, updateTimeEntryApi } from "./timeEntriesSlice";

interface TimerState {
  isRunning: boolean;
  startTime: string | null;
  activeEntryId: string | null;
}

const initialState: TimerState = {
  isRunning: false,
  startTime: null,
  activeEntryId: null,
};

export const startTimer =
  (personId?: string, serviceId?: string | null) =>
  async (dispatch: AppDispatch) => {
    if (!personId || !serviceId) return;

    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

    try {
      const response = await dispatch(
        addTimeEntryApi({
          entry: {
            attributes: {
              date: dayjs().format("YYYY-MM-DD"),
              started_at: now,
            },
          },
          person_id: personId,
          service_id: serviceId,
        })
      );

      dispatch(start({ startTime: now, activeEntryId: response.payload.id }));
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

export const stopTimer =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { activeEntryId, startTime } = getState().timer;
    if (!activeEntryId || !startTime) return;

    const now = dayjs();
    const duration = Math.floor(now.diff(dayjs(startTime), "minute"));

    try {
      await dispatch(
        updateTimeEntryApi({
          entry: {
            id: activeEntryId,
            attributes: {
              time: duration > 0 ? duration : 1,
              date: now.format("YYYY-MM-DD"),
              created_at: now.format("YYYY-MM-DD HH:mm:ss"),
            },
          },
        })
      );

      dispatch(stop());
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  };

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    start(
      state,
      action: PayloadAction<{ startTime: string; activeEntryId: string }>
    ) {
      state.isRunning = true;
      state.startTime = action.payload.startTime;
      state.activeEntryId = action.payload.activeEntryId;
    },
    stop(state) {
      state.isRunning = false;
      state.startTime = null;
      state.activeEntryId = null;
    }
  },
});

export const { start, stop } = timerSlice.actions;
export default timerSlice.reducer;
