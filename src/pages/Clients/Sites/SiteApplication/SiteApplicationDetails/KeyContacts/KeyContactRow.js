import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import React from "react";

const KeyContactRow = ({ row, classes, onDeleteNote }) => {
	return (
		<TableRow>
			<TableCell style={{ width: "32vw" }}>{row.displayName}</TableCell>
			<TableCell style={{ width: "32vw" }}>{row.email}</TableCell>
			<TableCell style={{ width: "32vw" }}>{row.phone}</TableCell>
			<TableCell style={{ width: "4vw" }}>
				{
					<DeleteIcon
						className={classes.deleteIcon}
						onClick={() => onDeleteNote(row.id)}
					/>
				}
			</TableCell>
		</TableRow>
	);
};

export default KeyContactRow;
