import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { Service, TimeEntry,TimeEntryParams, Person, OrganizationMembership } from "../types"
import { api } from "../services/api"
import dayjs from "dayjs"

interface TimeEntriesState {
  timeEntries: TimeEntry[]
  services: Service[]
  person: Person | null
  organizationMemberships: OrganizationMembership[]
  loading: boolean
  error: string | null
  selectedDate: string | null
  selectedServiceId: string | null
  activeEntryId: string | null
}

const initialState: TimeEntriesState = {
  timeEntries: [],
  services: [],
  person: null,
  organizationMemberships: [],
  loading: false,
  error: null,
  selectedDate: dayjs().format('YYYY-MM-DD'),
  selectedServiceId: null,
  activeEntryId: null,
}

export const getOrganizationMemberships = createAsyncThunk(
  "timeEntries/getOrganizationMemberships",
  async (_, { dispatch }) => {
    dispatch(setLoading(true))
    try {
      const data = await api.getOrganizationMemberships()
      dispatch(setOrganizationMemberships(data))
      if (data.length > 0 && data[0].person) {
        dispatch(setPerson(data[0].person))
      }
    } catch (error) {
      console.error("Error getting organization memberships:", error)
    } finally {
      dispatch(setLoading(false))
    }
  },
)

export const getServices = createAsyncThunk("timeEntries/getServices", async (_, { dispatch }) => {
  dispatch(setLoading(true))
  try {
    const data = await api.getServices()
    dispatch(setServices(data))
    return data
  } catch (error) {
    console.error("Error getting services:", error)
  } finally {
    dispatch(setLoading(false))
  }
})

export const getTimeEntries = createAsyncThunk(
  "timeEntries/getTimeEntries",
  async ({ personId, date, serviceId }: { personId?: string; date?: string; serviceId?: string }, { dispatch }) => {
    dispatch(setLoading(true))
    try {
      const data = await api.getTimeEntries(personId, date, serviceId)
      dispatch(setTimeEntries(data))
      return data
    } catch (error) {
      console.error("Error getting time entries:", error)
    } finally {
      dispatch(setLoading(false))
    }
  },
)

export const addTimeEntryApi = createAsyncThunk("timeEntries/addTimeEntry", async ({entry, service_id, person_id}: {entry: TimeEntryParams, service_id: string, person_id: string}, { dispatch }) => {
  try {
    const data = await api.addTimeEntry(entry, service_id, person_id)
    dispatch(addTimeEntry(data))
    return data
  } catch (error) {
    console.error("Error adding time entry:", error)
  }
})

export const updateTimeEntryApi = createAsyncThunk("timeEntries/updateTimeEntry", async ({entry, service_id}: {entry: TimeEntry, service_id?: string}, { dispatch }) => {
  try {
    const data = await api.updateTimeEntry(entry, service_id)
    dispatch(updateTimeEntry(data))
    return data
  } catch (error) {
    console.error("Error updating time entry:", error)
  }
})

export const deleteTimeEntryApi = createAsyncThunk("timeEntries/deleteTimeEntry", async (id: string, { dispatch }) => {
  try {
    await api.deleteTimeEntry(id)
    dispatch(deleteTimeEntry(id))
    return id
  } catch (error) {
    console.error("Error deleting time entry:", error)
  }
})

const timeEntriesSlice = createSlice({
  name: "timeEntries",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setOrganizationMemberships: (state, action: PayloadAction<OrganizationMembership[]>) => {
      state.organizationMemberships = action.payload
    },
    setPerson: (state, action: PayloadAction<Person>) => {
      state.person = action.payload
    },
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload
    },
    setTimeEntries: (state, action: PayloadAction<TimeEntry[]>) => {
      state.timeEntries = action.payload
    },
    addTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      state.timeEntries.push(action.payload)
    },
    updateTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      const index = state.timeEntries.findIndex((entry) => entry.id === action.payload.id)
      if (index !== -1) state.timeEntries[index] = action.payload
    },
    deleteTimeEntry: (state, action: PayloadAction<string>) => {
      state.timeEntries = state.timeEntries.filter((entry) => entry.id !== action.payload)
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload
    },
    setSelectedServiceId: (state, action: PayloadAction<string | null>) => {
      state.selectedServiceId = action.payload
    },
    setActiveEntryId: (state, action: PayloadAction<string | null>) => {
      state.activeEntryId = action.payload;
    }
  },
})

export const {
  setLoading,
  setOrganizationMemberships,
  setPerson,
  setServices,
  setTimeEntries,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  setSelectedDate,
  setSelectedServiceId,
  setActiveEntryId,
} = timeEntriesSlice.actions

export default timeEntriesSlice.reducer