import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, FormInstance, InputNumber } from "antd";
import { Service } from "../types";
import { getServices } from "../store/timeEntriesSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const { Option } = Select;

const { TextArea } = Input;

interface TimeEntryModalProps {
  isModalOpen: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
  initialValues?: Record<string, string | number | null>;
}

const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  isModalOpen,
  form,
  onOk,
  onCancel,
  initialValues,
}) => {
  const dispatch = useAppDispatch();
  const { services } = useAppSelector((state) => state.timeEntries);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  return (
    <Modal
      title="Add Time Entry"
      open={isModalOpen}
      onOk={onOk}
      onCancel={onCancel}
      data-cy="time-entry-modal"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Date is required" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time (minutes)"
          rules={[
            { required: true, message: "Time is required" },
          ]}
        >
          <InputNumber min="1" className="w-full!"  data-cy="time-input" />
        </Form.Item>
        <Form.Item name="note" label="Note" data-cy="note-input">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="service_id"
          label="Service"
          rules={[{ required: true, message: "Service is required" }]}
        >
          <Select data-cy="service-selector">
            {services.map((service: Service) => (
              <Option
                key={service.id}
                value={service.id}
                data-cy="service-option"
              >
                {service.attributes.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TimeEntryModal;
