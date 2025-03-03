"use client";

import type React from "react";

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../store/store";
import { addTimeEntryApi } from "../store/timeEntriesSlice";
import TimeEntryModal from "./TimeEntryModalForm";
import DateSelector from "./DateSelector";
import ServiceSelector from "./ServiceSelector";
import AddEntryButton from "./AddEntryButton";
import TimeTracker from "./TimerTracker";

const TimeEntryActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { person, selectedDate, selectedServiceId, activeEntryId } =
    useAppSelector((state) => state.timeEntries);

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      date: selectedDate ? dayjs(selectedDate) : null,
      service_id: selectedServiceId ? selectedServiceId : null,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (person) {
        dispatch(
          addTimeEntryApi({
            entry: {
              attributes: {
                ...values,
                date: dayjs(selectedDate)?.format("YYYY-MM-DD") || null,
              },
            },
            person_id: person.id,
            service_id: values.service_id,
          })
        );
        setIsModalOpen(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-4" data-cy="main-add-entry-form">
      <DateSelector />
      <ServiceSelector />
      <AddEntryButton onClick={handleAdd} disabled={activeEntryId !== null} />
      <TimeTracker />

      <TimeEntryModal
        isModalOpen={isModalOpen}
        form={form}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TimeEntryActions;
