import React from "react";
import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);
const ClientKeyRow = ({ row }) => {
	let rowData = [];

	for (const property in row) {
		if (property !== "id") {
			rowData.push(row[property]);
		}
	}

	return (
		<TableRow>
			{rowData.map((data) => (
				<TableCell
					className="white-space-nowrap"
					style={{ wordBreak: "break-word" }}
				>
					{data}
				</TableCell>
			))}
			{/* <TableCell
			className="white-space-nowrap"
			style={{ wordBreak: "break-word" }}
		>
			{row.name}
		</TableCell>
		<TableCell
			className="white-space-nowrap"
			style={{ wordBreak: "break-word" }}
		>
			{row.product}
		</TableCell>

		<TableCell
			className="white-space-nowrap"
			style={{ wordBreak: "break-word" }}
		>
			<HtmlTooltip title={row.email}>
				<p className="max-two-line">{row.email}</p>
			</HtmlTooltip>
		</TableCell>
		<TableCell
			className="white-space-nowrap"
			style={{ wordBreak: "break-word" }}
		>
			{row.phone}
		</TableCell> */}
		</TableRow>
	);
};

export default ClientKeyRow;
