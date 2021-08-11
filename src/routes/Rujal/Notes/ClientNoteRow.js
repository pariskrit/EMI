import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/deleteIcon.svg";

const ClientNoteRow = ({ row, classes }) => {
	const [full, setFull] = React.useState(false);
	return (
		<TableRow>
			<TableCell>{row.name}</TableCell>
			<TableCell>{row.date}</TableCell>
			<TableCell>
				<p
					onMouseEnter={() => setFull(true)}
					onMouseLeave={() => setFull(false)}
				>
					{!full ? row.note.substring(0, 50) : row.note}
				</p>
			</TableCell>
			<TableCell>
				<span className={classes.view}>View</span>
			</TableCell>
			<TableCell>
				<DeleteIcon className={classes.deleteIcon} />
			</TableCell>
		</TableRow>
	);
};

export default ClientNoteRow;
