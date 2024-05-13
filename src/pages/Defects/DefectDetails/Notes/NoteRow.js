import { TableCell, TableRow, Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";
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

const NoteRow = ({ row, classes, onDeleteNote, onViewNote, isReadOnly }) => {
	return (
		<TableRow>
			<TableCell style={{ width: "170px" }}>{row.name}</TableCell>
			<TableCell style={{ width: "100px" }}>{changeDate(row.date)}</TableCell>
			<TableCell
				className="note-field"
				style={{ whiteSpace: "unset", maxWidth: "300px" }}
			>
				<HtmlTooltip title={row.note}>
					<p className="max-two-line">{row.note}</p>
				</HtmlTooltip>
			</TableCell>
			<TableCell>
				<p className="new-link" onClick={() => onViewNote(row.note)}>
					View
				</p>
			</TableCell>
			<TableCell style={{ width: "50px" }}>
				{isReadOnly ? null : (
					<DeleteIcon
						className={classes.deleteIcon}
						onClick={() => onDeleteNote(row.id)}
					/>
				)}
			</TableCell>
		</TableRow>
	);
};

export default NoteRow;
