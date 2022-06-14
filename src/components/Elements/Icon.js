import React from "react";
import RestoreIcon from "@material-ui/icons/Restore";
import { ReactComponent as CancelIcon } from "assets/icons/cancelled.svg";
import { ReactComponent as StoppedIcon } from "assets/icons/stopped.svg";
import { ReactComponent as CompleteIcon } from "assets/icons/complete.svg";
import { ReactComponent as ScheduleIcon } from "assets/icons/Scheduled.svg";
import { ReactComponent as InProgressIcon } from "assets/icons/in-progress.svg";
import { ReactComponent as CheckedOutIcon } from "assets/icons/checked-out.svg";
import { ReactComponent as SafteryCritical } from "assets/icons/safety-critical.svg";

function Icon({ name, fontSize = "12px", className }) {
	switch (name) {
		case "Stopped":
			return <StoppedIcon style={{ fontSize }} />;

		case "Stopped (Tasks Skipped)":
			return <StoppedIcon style={{ fontSize }} />;

		case "Scheduled":
			return <ScheduleIcon style={{ fontSize }} />;

		case "Cancelled":
			return <CancelIcon style={{ fontSize }} />;

		case "Complete":
			return <CompleteIcon style={{ fontSize }} />;

		case "Complete (Tasks Skipped)":
			return <CompleteIcon style={{ fontSize }} />;

		case "Complete (By Paper)":
			return <CompleteIcon style={{ fontSize }} />;

		case "Checked Out":
			return <CheckedOutIcon style={{ fontSize }} />;

		case "In Progress":
			return <InProgressIcon style={{ fontSize }} />;

		case "Restore":
			return <RestoreIcon className={className} />;

		case "Incomplete":
			return <CheckedOutIcon style={{ fontSize }} />;
		case "SafteryCritical":
			return <SafteryCritical style={{ fontSize }} />;

		default:
			return "No Such Icon";
	}
}

export default Icon;
