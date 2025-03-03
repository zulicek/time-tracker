import type React from "react";
import { Select } from "antd";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setSelectedServiceId } from "../store/timeEntriesSlice";
import type { Service } from "../types";

const { Option } = Select;

const ServiceSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services, selectedServiceId } = useAppSelector(
    (state) => state.timeEntries
  );

  const handleServiceChange = (value: string | null) => {
    dispatch(setSelectedServiceId(value));
  };

  return (
    <Select
      allowClear
      placeholder="Services"
      onChange={handleServiceChange}
      value={selectedServiceId}
      data-cy="main-service-selector"
    >
      {services.map((service: Service) => (
        <Option key={service.id} value={service.id} data-cy="main-service-option">
          {service.attributes.name}
        </Option>
      ))}
    </Select>
  );
};

export default ServiceSelector;
