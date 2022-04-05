import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import React from "react";
import Link from "@material-ui/core/Link";
import { isoDateWithoutTimeZone } from "helpers/utils";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const Row = ({ row, classes, onDeleteClick, isReadOnly }) => {
	console.log(isoDateWithoutTimeZone(row.date + "Z").toString());
	return (
		<TableRow>
			<TableCell className="note-field" style={{ whiteSpace: "unset" }}>
				<HtmlTooltip title={row.filename} className="note-field">
					<Link
						href={row.documentURL}
						download={row.filename}
						className="max-two-line new-link"
					>
						{row.filename}
					</Link>
				</HtmlTooltip>
			</TableCell>
			<TableCell style={{ width: "100px" }}>{row.name}</TableCell>
			<TableCell style={{ width: "100px" }}>
				{isoDateWithoutTimeZone(row.date + "Z")}
			</TableCell>

			{isReadOnly ? null : (
				<TableCell style={{ width: "50px" }}>
					<DeleteIcon className={classes.deleteIcon} onClick={onDeleteClick} />
				</TableCell>
			)}
		</TableRow>
	);
};

export default Row;
