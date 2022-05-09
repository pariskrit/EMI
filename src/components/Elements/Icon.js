import React from "react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AvTimerIcon from "@material-ui/icons/AvTimer";

function Icon({ name, fontSize = "14px" }) {
	switch (name) {
		case "Stopped":
			return <HighlightOffIcon style={{ color: "red", fontSize }} />;

		case "Scheduled":
			return <CalendarTodayIcon style={{ fontSize }} />;

		case "Cancelled":
			return <BlockIcon style={{ fontSize, color: "red" }} />;

		case "Complete":
			return <CheckCircleIcon style={{ fontSize, color: "#24BA78" }} />;

		case "Complete (By Paper)":
			return <CheckCircleIcon style={{ fontSize, color: "#24BA78" }} />;

		case "Checked Out":
			return <CheckCircleOutlineIcon style={{ fontSize, color: "#24BA78" }} />;

		case "In Progress":
			return <AvTimerIcon style={{ fontSize, color: "#24BA78" }} />;

		default:
			return <HighlightOffIcon />;
	}
}

export default Icon;
