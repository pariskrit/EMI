import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { changeDate } from "helpers/date";
import React from "react";

const ClientNoteRow = ({ row, classes, onDeleteNote }) => {
	const [full, setFull] = React.useState(false);

	return (
		<TableRow>
			<TableCell style={{ whiteSpace: "nowrap" }}>{row.name}</TableCell>
			<TableCell>{changeDate(row.date)}</TableCell>
			<TableCell
				onMouseEnter={() => setFull(true)}
				onMouseLeave={() => setFull(false)}
			>
				<p
					style={
						!full
							? { height: "3em", overflow: "hidden", marginTop: 33 }
							: { minHeight: "3em", marginTop: 33 }
					}
				>
					{row.note}
				</p>
			</TableCell>
			<TableCell>
				<span className={classes.view}>View</span>
			</TableCell>
			<TableCell>
				<DeleteIcon className={classes.deleteIcon} onClick={onDeleteNote} />
			</TableCell>
		</TableRow>
	);
};

export default ClientNoteRow;
