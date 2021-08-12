import React from "react";
import { TableCell, TableRow } from "@material-ui/core";

const ClientKeyRow = ({ row }) => (
	<TableRow>
		<TableCell style={{ whiteSpace: "nowrap" }}>{row.name}</TableCell>
		<TableCell style={{ whiteSpace: "nowrap" }}>{row.site}</TableCell>
		<TableCell style={{ whiteSpace: "nowrap" }}>{row.application}</TableCell>
		<TableCell style={{ wordBreak: "break-word" }}>
			<p>{row.email}</p>
		</TableCell>
		<TableCell>{row.phone}</TableCell>
	</TableRow>
);

export default ClientKeyRow;
