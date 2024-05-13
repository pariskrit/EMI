import React from "react";
import RestoreIcon from "@mui/icons-material/Restore";
import { ReactComponent as CancelIcon } from "assets/icons/cancelled.svg";
import { ReactComponent as StoppedIcon } from "assets/icons/stopped.svg";
import { ReactComponent as CompleteIcon } from "assets/icons/complete.svg";
import { ReactComponent as ScheduleIcon } from "assets/icons/Scheduled.svg";
import { ReactComponent as InProgressIcon } from "assets/icons/in-progress.svg";
import { ReactComponent as CheckedOutIcon } from "assets/icons/checked-out.svg";
import { ReactComponent as SafteryCritical } from "assets/icons/safety-critical.svg";
import { ReactComponent as HistoryAdd } from "assets/history-add.svg";
import { ReactComponent as HistoryDelete } from "assets/history-delete.svg";
import { ReactComponent as HistoryUpdate } from "assets/history-edit.svg";

function Icon({
	name,
	fontSize = "12px",
	className,
	height = "36px",
	width = "36px",
	...style
}) {
	switch (name) {
		case "historyadd":
			return <HistoryAdd style={{ height, width }} />;

		case "historyupdate":
			return <HistoryUpdate style={{ height, width }} />;

		case "historydelete":
			return <HistoryDelete style={{ height, width }} />;

		case "Stopped":
			return <StoppedIcon style={{ fontSize }} {...style} />;

		case "Stopped (Tasks Skipped)":
			return <StoppedIcon style={{ fontSize }} {...style} />;

		case "Scheduled":
			return <ScheduleIcon style={{ fontSize }} {...style} />;

		case "Cancelled":
			return <CancelIcon style={{ fontSize }} {...style} />;

		case "Complete":
			return <CompleteIcon style={{ fontSize }} {...style} />;

		case "Complete (Tasks Skipped)":
			return <CompleteIcon style={{ fontSize }} {...style} />;

		case "Complete (By Paper)":
			return <CompleteIcon style={{ fontSize }} {...style} />;

		case "Checked Out":
			return <CheckedOutIcon style={{ fontSize }} {...style} />;

		case "In Progress":
			return <InProgressIcon style={{ fontSize }} {...style} />;

		case "Restore":
			return <RestoreIcon className={className} {...style} />;

		case "Incomplete":
			return <CheckedOutIcon style={{ fontSize }} {...style} />;
		case "SafteryCritical":
			return <SafteryCritical style={{ fontSize }} {...style} />;

		default:
			return "No Such Icon";
	}
}

export default Icon;
