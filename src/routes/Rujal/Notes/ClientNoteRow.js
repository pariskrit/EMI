import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/deleteIcon.svg";
import { changeDate } from "../../../helpers/date";

const ClientNoteRow = ({ row, classes }) => {
	const [full, setFull] = React.useState(false);

	return (
		<TableRow>
			<TableCell style={{ whiteSpace: "nowrap" }}>{row.name}</TableCell>
			<TableCell>{changeDate(row.date)}</TableCell>
			<TableCell>
				<p
					onMouseEnter={() => setFull(true)}
					onMouseLeave={() => setFull(false)}
					style={
						!full ? { height: "3em", overflow: "hidden" } : { minHeight: "3em" }
					}
				>
					{row.note}
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
