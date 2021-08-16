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
		<TableCell
			style={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
			}}
		>
			<IOSSwitch onChange={onChangeApp} currentStatus={row.isActive} /> &nbsp;
			{!row.isActive ? (
				<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
			) : (
				<div style={{ width: "32px" }}></div>
			)}
		</TableCell>
	</TableRow>
);

export default ClientAppRow;
