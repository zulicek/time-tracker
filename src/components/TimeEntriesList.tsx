import React, { useState } from "react";
import { List, Spin, Pagination, Form } from "antd";
import { TimeEntry } from "../types";
import TimeEntryItem from "./TimeEntryItem";
import TimeEntryModal from "./TimeEntryModalForm";
import ConfirmationModal from "./ConfirmationModal";
import {
  deleteTimeEntryApi,
  updateTimeEntryApi,
} from "../store/timeEntriesSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import dayjs from "dayjs";

interface TimeEntriesListProps {
  timeEntries: TimeEntry[];
  loading: boolean;
}

const TimeEntriesList: React.FC<TimeEntriesListProps> = ({
  timeEntries,
  loading,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const sortedEntries = [...timeEntries].sort((a, b) => {
    const dateA = new Date(a.attributes.updated_at || a.attributes.created_at).getTime();
    const dateB = new Date(b.attributes.updated_at || b.attributes.created_at).getTime();
    return dateB - dateA;
  });

  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handleOpenDeleteModal = (id: string) => {
    setEditingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = (id?: string) => {
    if (id) {
      dispatch(deleteTimeEntryApi(id));
    }
    setIsDeleteModalOpen(false);
  };

  const handleOpenEditModal = (entry: TimeEntry) => {
    setEditingId(entry.id);
    form.setFieldsValue({
      ...entry.attributes,
      date: dayjs(entry.attributes.date),
      service_id: entry.service?.id || null,
    });
    setIsEditModalOpen(true);
  };

  const handleOk = () => {
    if (!editingId) return;

    form.validateFields().then((values) => {
      dispatch(
        updateTimeEntryApi({
          entry: {
            id: editingId,
            attributes: {
              ...values,
              date: dayjs(values.date).format("YYYY-MM-DD"),
            },
          },
          service_id: values.service_id,
        })
      );

      setIsEditModalOpen(false);
    });
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="flex flex-col items-center" data-cy="time-entries-list">
          <List
            className="w-full"
            grid={{ gutter: 16, column: 1 }}
            dataSource={paginatedEntries}
            renderItem={(entry) => (
              <List.Item>
                <TimeEntryItem
                  entry={entry}
                  onEdit={() => handleOpenEditModal(entry)}
                  onDelete={() => handleOpenDeleteModal(entry.id)}
                />
              </List.Item>
            )}
          />

          {timeEntries.length > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={timeEntries.length}
              onChange={(page) => setCurrentPage(page)}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          )}
        </div>
      </Spin>

      <TimeEntryModal
        isModalOpen={isEditModalOpen}
        form={form}
        onOk={handleOk}
        onCancel={() => setIsEditModalOpen(false)}
      />

      <ConfirmationModal
        isModalOpen={isDeleteModalOpen}
        onOk={() => handleDelete(editingId)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default TimeEntriesList;
