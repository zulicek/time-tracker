import type React from "react";
import { useEffect } from "react";
import { Card } from "antd";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getTimeEntries } from "../store/timeEntriesSlice";
import TimeEntriesList from "../components/TimeEntriesList";
import Header from "../components/Header";
import TimeEntryActions from "../components/TimeEntryActions";
import dayjs from "dayjs";

const DashBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { timeEntries, loading, person, selectedDate, selectedServiceId } =
    useAppSelector((state) => state.timeEntries);

  useEffect(() => {
    if (person) {
      if (selectedDate) {
        dispatch(
          getTimeEntries({
            personId: person.id,
            date: dayjs(selectedDate)?.format("YYYY-MM-DD"),
            serviceId: selectedServiceId || undefined,
          })
        );
      } else {
        dispatch(
          getTimeEntries({
            personId: person.id,
            serviceId: selectedServiceId || undefined,
          })
        );
      }
    }
  }, [person, selectedDate, selectedServiceId]);

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Header person={person} />

      <div className="px-6 flex gap-8 bg-gray-100 p-6 flex-col md:flex-row">
        <div className="flex flex-col gap-4 w-full md:w-1/4">
          <Card>
            <TimeEntryActions />
          </Card>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-3/4">
          <h2 className="text-lg font-semibold">
            {selectedDate
              ? `Time Entries for ${dayjs(selectedDate).format(
                  "dddd, Do MMMM YYYY"
                )}`
              : "All Time Entries"}
          </h2>

          <TimeEntriesList timeEntries={timeEntries} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
