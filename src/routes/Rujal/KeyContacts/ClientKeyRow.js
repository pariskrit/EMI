import React from "react";
import { TableCell, TableRow } from "@material-ui/core";

const ClientKeyRow = ({ row }) => (
	<TableRow>
		<TableCell>{row.name}</TableCell>
		<TableCell>{row.site}</TableCell>
		<TableCell>{row.application}</TableCell>
		<TableCell style={{ wordBreak: "break-word" }}>
			<p>{row.email}</p>
		</TableCell>
		<TableCell>{row.phone}</TableCell>
	</TableRow>
);

export default ClientKeyRow;
