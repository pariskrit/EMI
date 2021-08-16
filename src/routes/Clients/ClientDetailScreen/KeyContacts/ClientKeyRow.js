import React from "react";
import { TableCell, TableRow } from "@material-ui/core";

const ClientKeyRow = ({ row }) => (
	<TableRow>
		<TableCell style={{ wordBreak: "break-word" }}>{row.name}</TableCell>
		<TableCell style={{ wordBreak: "break-word", whiteSpace: "nowrap" }}>
			{row.site}
		</TableCell>
		<TableCell style={{ wordBreak: "break-word" }}>{row.application}</TableCell>
		<TableCell style={{ wordBreak: "break-word" }}>{row.email}</TableCell>
		<TableCell style={{ wordBreak: "break-word" }}>{row.phone}</TableCell>
	</TableRow>
);

export default ClientKeyRow;
