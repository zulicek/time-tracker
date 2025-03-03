import React, { useEffect, useState } from "react";
import { Button, Tooltip, theme } from "antd";
import dayjs from "dayjs";
import { PlayCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/store";
import { startTimer, stopTimer } from "../store/timerSlice";

const { useToken } = theme;

const TimeTracker: React.FC = () => {
  const { token } = useToken();
  const dispatch = useAppDispatch();
  const { person, selectedDate, selectedServiceId } = useAppSelector(
    (state) => state.timeEntries
  );
  const { isRunning, startTime } = useAppSelector((state) => state.timer);
  const [elapsedTime, setElapsedTime] = useState(0);
  const now = new Date();
  const isToday =
    selectedDate &&
    dayjs(selectedDate).format("YYYY-MM-DD") ===
      dayjs(now).format("YYYY-MM-DD");

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const parsedStartTime = dayjs(startTime);

    const interval = setInterval(() => {
      setElapsedTime(
        Math.floor((Date.now() - parsedStartTime.valueOf()) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStartTimer = () =>
    dispatch(startTimer(person?.id, selectedServiceId));
  const handleStopTimer = () => {
    setElapsedTime(0);
    dispatch(stopTimer());
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  if (!isToday) {
    return null;
  }

  if (isRunning) {
    return (
      <Button
        onClick={handleStopTimer}
        style={{
          borderColor: token.colorPrimary,
          color: token.colorPrimary,
        }}
        data-cy="stop-timer-button"
      >
        <span data-cy="timer-display">{formatTime(elapsedTime)}</span>
        <CloseCircleOutlined
          style={{ marginLeft: "0.5rem", color: token.colorPrimary }}
        />
      </Button>
    );
  }

  if (!selectedDate || !selectedServiceId) {
    return (
      <Tooltip title="Please select service to start timer">
        <Button
          onClick={handleStartTimer}
          disabled={!selectedDate || !selectedServiceId}
          data-cy="start-timer-button"
        >
          Start timer
          <PlayCircleOutlined style={{ marginLeft: "0.5rem" }} />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={handleStartTimer}
      disabled={!selectedDate || !selectedServiceId}
      data-cy="start-timer-button"
    >
      Start timer
      <PlayCircleOutlined
        style={{ marginLeft: "0.5rem", color: token.colorPrimary }}
      />
    </Button>
  );
};

export default TimeTracker;
