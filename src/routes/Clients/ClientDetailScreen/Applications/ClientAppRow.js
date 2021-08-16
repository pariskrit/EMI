import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/IOSSwitch";
import React from "react";

const ClientAppRow = ({ row, classes, onDeleteApp, onChangeApp }) => (
	<TableRow>
		<TableCell>
			<span className={classes.appName}>{row.name}</span>
		</TableCell>
		<TableCell>{row.totalSites}</TableCell>
		<TableCell>
			<IOSSwitch onChange={onChangeApp} currentStatus={row.isActive} />
		</TableCell>
		<TableCell>
			{" "}
			{!row.isActive && (
				<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
			)}
		</TableCell>
	</TableRow>
);

export default ClientAppRow;
