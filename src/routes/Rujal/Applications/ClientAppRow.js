import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import IOSSwitch from "../../../components/IOSSwitch";

const ClientAppRow = ({ row, classes }) => {
	const [currentStatus, setCurrentStatus] = React.useState(true);

	return (
		<TableRow>
			<TableCell>
				<span className={classes.appName}>{row.name}</span>
			</TableCell>
			<TableCell>{row.qty}</TableCell>
			<TableCell>{row.location}</TableCell>
			<TableCell>
				<IOSSwitch
					onChange={() => setCurrentStatus(!currentStatus)}
					currentStatus={currentStatus}
				/>
			</TableCell>
		</TableRow>
	);
};

export default ClientAppRow;
