import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/IOSSwitch";

const Row = ({ row, classes, onDeleteApp, onChangeApp }) => (
	<TableRow>
		<TableCell>
			<span className={classes.appName}>{row.name}</span>
		</TableCell>
		{/* <TableCell>{row.totalSites}</TableCell> */}
		<TableCell
			style={{
				paddingLeft: 90,
				width: "245px",
			}}
		>
			<div className="flex">
				<IOSSwitch onChange={onChangeApp} currentStatus={row.isActive} /> &nbsp;
				{!row.isActive ? (
					<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
				) : (
					<div style={{ width: "32px" }}></div>
				)}
			</div>
		</TableCell>
	</TableRow>
);

export default Row;
