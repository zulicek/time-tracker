import type React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setSelectedDate } from "../store/timeEntriesSlice";

const DateSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedDate } = useAppSelector((state) => state.timeEntries);

  const handleDateChange = (date: string) => {
    dispatch(setSelectedDate(date));
  };

  return (
    <DatePicker
      value={selectedDate ? dayjs(selectedDate) : null}
      onChange={(date) => handleDateChange(date?.format())}
      data-cy="date-selector"
    />
  );
};

export default DateSelector;
