import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { withStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

function ErrorMessageWithErrorIcon({ message }) {
	let msg;
	if (typeof message === "object") {
		msg = message.map((x) => <p style={{ padding: 0, margin: 0 }}>{x}</p>);
	} else {
		msg = message;
	}
	return (
		<>
			<HtmlTooltip title={msg}>
				<ErrorIcon style={{ color: "red" }} />
			</HtmlTooltip>
		</>
	);
}

export default ErrorMessageWithErrorIcon;
