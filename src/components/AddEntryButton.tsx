import type React from "react"
import { Button, Tooltip } from "antd"
import { FileAddOutlined } from "@ant-design/icons"
import { useAppSelector } from "../store/store"

interface AddEntryButtonProps {
  onClick: () => void,
  disabled: boolean
}

const AddEntryButton: React.FC<AddEntryButtonProps> = ({ onClick, disabled }) => {
  const { selectedDate } = useAppSelector(state => state.timeEntries)

  if (!selectedDate) {
    return (
      <Tooltip title="Please select a date to add entry">
        <Button type="primary" onClick={onClick} disabled={true} data-cy="add-entry-button">
          Add Entry
          <FileAddOutlined style={{ marginLeft: "0.5rem" }} />
        </Button>
      </Tooltip>
    )
  }

  return (
    <Button type="primary" onClick={onClick} disabled={disabled} data-cy="add-entry-button">
      Add Entry
      <FileAddOutlined style={{ marginLeft: "0.5rem" }} />
    </Button>
  )
}

export default AddEntryButton

