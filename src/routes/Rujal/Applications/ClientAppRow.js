import React, { useState } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import IOSSwitch from "../../../components/IOSSwitch";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/deleteIcon.svg";

const ClientAppRow = ({ row, classes }) => {
	const [currentStatus, setCurrentStatus] = useState(row.isActive);

	return (
		<TableRow>
			<TableCell>
				<span className={classes.appName}>{row.name}</span>
			</TableCell>
			<TableCell>{row.totalSites}</TableCell>
			<TableCell>
				<IOSSwitch
					onChange={() => setCurrentStatus(!currentStatus)}
					currentStatus={currentStatus}
				/>
			</TableCell>
			<TableCell>
				{" "}
				<DeleteIcon className={classes.deleteIcon} />
			</TableCell>
		</TableRow>
	);
};

export default ClientAppRow;
