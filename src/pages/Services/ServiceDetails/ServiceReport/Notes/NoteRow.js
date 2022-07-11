import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { changeDate } from "helpers/date";
import React from "react";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const NotesRow = ({ row, classes, onDeleteNote, onViewNote, isReadOnly }) => {
	return (
		<TableRow>
			<TableCell style={{ width: "300px" }}>{row.name}</TableCell>
			<TableCell style={{ width: "300px" }}>{changeDate(row.date)}</TableCell>
			<TableCell
				className="note-field"
				style={{ whiteSpace: "unset", maxWidth: "500px" }}
			>
				<HtmlTooltip title={row.note}>
					<p className="max-two-line">{row.note}</p>
				</HtmlTooltip>
			</TableCell>
		</TableRow>
	);
};

export default NotesRow;
