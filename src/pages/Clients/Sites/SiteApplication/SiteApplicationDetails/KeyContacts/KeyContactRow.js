import { TableCell, TableRow } from "@mui/material";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import React from "react";

const KeyContactRow = ({ row, classes, onDeleteNote, isReadOnly }) => {
	return (
		<TableRow>
			<TableCell style={{ width: "32vw" }}>{row.displayName}</TableCell>
			<TableCell style={{ width: "32vw" }}>{row.email}</TableCell>
			<TableCell style={{ width: "4vw" }}>
				{!isReadOnly && (
					<DeleteIcon
						className={classes.deleteIcon}
						onClick={() => onDeleteNote(row.id)}
					/>
				)}
			</TableCell>
		</TableRow>
	);
};

export default KeyContactRow;
