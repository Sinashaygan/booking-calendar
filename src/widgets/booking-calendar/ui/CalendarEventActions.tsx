"use client";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack, Tooltip } from "@mui/material";

type CalendarEventActionsProps = {
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function CalendarEventActions({
  disabled = false,
  onEdit,
  onDelete,
}: CalendarEventActionsProps) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="ویرایش">
        <span>
          <IconButton
            size="small"
            aria-label="ویرایش رزرو"
            disabled={disabled}
            onClick={onEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="حذف">
        <span>
          <IconButton
            size="small"
            color="error"
            aria-label="حذف رزرو"
            disabled={disabled}
            onClick={onDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
