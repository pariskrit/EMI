import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
	TableCell,
	TableRow,
	Tooltip,
	Button,
	Typography,
} from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { changeDate } from "helpers/date";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const ClientNoteRow = ({ row, classes, onDeleteNote }) => (
	<TableRow>
		<TableCell style={{ width: "170px" }}>{row.name}</TableCell>
		<TableCell>{changeDate(row.date)}</TableCell>
		<TableCell>
			{row.note.length > 57 ? (
				<HtmlTooltip title={<React.Fragment>{row.note}</React.Fragment>}>
					<p>{row.note.substring(0, 57) + "..."}</p>
				</HtmlTooltip>
			) : (
				<p>{row.note}</p>
			)}
		</TableCell>
		<TableCell>
			<DeleteIcon className={classes.deleteIcon} onClick={onDeleteNote} />
		</TableCell>
	</TableRow>
);

export default ClientNoteRow;
