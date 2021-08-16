import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { changeDate } from "helpers/date";
import React from "react";

const ClientNoteRow = ({ row, classes, onDeleteNote }) => {
	return (
		<TableRow>
			<TableCell style={{ width: "170px" }}>{row.name}</TableCell>
			<TableCell>{changeDate(row.date)}</TableCell>
			<TableCell>
				<p title={row.note}>
					{row.note.length > 57 ? row.note.substring(0, 57) + "..." : row.note}
				</p>
			</TableCell>
			<TableCell>
				<DeleteIcon className={classes.deleteIcon} onClick={onDeleteNote} />
			</TableCell>
		</TableRow>
	);
};

export default ClientNoteRow;
