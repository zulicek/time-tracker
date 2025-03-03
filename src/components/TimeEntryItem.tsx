import React from "react";
import { Card, Button, Tooltip, theme } from "antd";
import { TimeEntry } from "../types";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  LoadingOutlined,
  FormOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { stopTimer } from "../store/timerSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

interface TimeEntryProps {
  entry: TimeEntry;
  onEdit: (record: TimeEntry) => void;
  onDelete: (id: string) => void;
}

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en");

const { useToken } = theme;

const TimeEntryItem: React.FC<TimeEntryProps> = ({
  entry,
  onEdit,
  onDelete
}) => {
  const createdAt = entry?.attributes?.created_at;
  const updatedAt = entry?.attributes?.updated_at;
  const createdDate = createdAt ? new Date(createdAt) : null;
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const dispatch = useAppDispatch();

  const { isRunning, activeEntryId } = useAppSelector(state => state.timer);

  const isTimerRunning = isRunning && activeEntryId === entry.id

  const isUpdated =
    updatedDate &&
    createdDate &&
    createdDate.getTime() !== updatedDate.getTime();

  const createdTimeAgo = createdDate ? timeAgo.format(createdDate) : null;
  const updatedTimeAgo = updatedDate ? timeAgo.format(updatedDate) : null;

  const createdFormatted = createdDate
    ? dayjs(createdDate).format("D MMM YYYY, H:mm")
    : null;
  const updatedFormatted = updatedDate
    ? dayjs(updatedDate).format("D MMM YYYY, H:mm")
    : null;

  const { token } = useToken();

  const handleStopTimer = () => dispatch(stopTimer());

  return (
    <Card
      title={entry.service?.attributes.name}
      data-cy="time-entry-item"
      extra={
        <>
          {isTimerRunning &&
            <Button type="primary" style={{ marginRight: "0.5rem" }} onClick={handleStopTimer}>
              <strong>Stop timer</strong>
              <CloseCircleOutlined />
            </Button>
      }
          <Button
            disabled={isTimerRunning}
            type="link"
            onClick={() => onEdit(entry)}
            data-cy="edit-entry-button"
          >
            <FormOutlined />
          </Button>
          <Button
            disabled={isTimerRunning}
            type="link"
            onClick={() => onDelete(entry.id)}
            data-cy="delete-entry-button"
          >
            <DeleteOutlined />
          </Button>
        </>
      }
    >
      <div className="flex gap-2 w-full flex-col">
        <div>
          <p>
            <strong>Date:</strong>{" "}
            {dayjs(entry.attributes.date).format("D MMM YYYY")}
          </p>
          <p>
            {isTimerRunning ? (
              <>
                <strong>Timer running</strong>
                <LoadingOutlined
                  style={{ color: token.colorPrimary, marginLeft: "0.5rem" }}
                />
              </>
            ) : (
              <>
                <strong>Logged time:</strong> {entry.attributes.time}
                {entry.attributes.time === 1 ? " minute" : " minutes"}
              </>
            )}
          </p>
          <p className="mt-2" data-cy="description-input">{entry.attributes.note}</p>
        </div>

        {(createdTimeAgo || updatedTimeAgo) && (
          <Tooltip
            placement="topRight"
            title={`Created: ${createdFormatted}${
              isUpdated ? ` | Updated: ${updatedFormatted}` : ""
            }`}
          >
            <p className="text-right text-xs text-gray-500 cursor-default">
              Last change {isUpdated ? updatedTimeAgo : createdTimeAgo}
            </p>
          </Tooltip>
        )}
      </div>
    </Card>
  );
};

export default TimeEntryItem;
