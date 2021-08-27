import React from "react";
import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "./style.scss";
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
			if (property === "application" || property === "email") {
				rowData.push(
					<TableCell style={{ wordBreak: "break-word" }} key={row[property]}>
						<HtmlTooltip title={row.email}>
							<p className="max-two-line">{row[property]}</p>
						</HtmlTooltip>
					</TableCell>
				);
			} else {
				rowData.push(
					<TableCell className="white-space-nowrap" key={row[property]}>
						{row[property]}
					</TableCell>
				);
			}
		}
	}

	return <TableRow>{rowData}</TableRow>;
};

export default ClientKeyRow;
