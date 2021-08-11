import React from "react";
import { TableCell, TableRow } from "@material-ui/core";

const ClientKeyRow = ({ row }) => (
	<TableRow>
		<TableCell>{row.name}</TableCell>
		<TableCell>{row.site}</TableCell>
		<TableCell>{row.product}</TableCell>
		<TableCell>{row.email}</TableCell>
		<TableCell>{row.phone}</TableCell>
	</TableRow>
);

export default ClientKeyRow;
