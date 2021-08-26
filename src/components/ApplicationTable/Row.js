import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/IOSSwitch";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
		verticalAlign: "middle",
	},
	appName: {
		color: "#307AD6",
		textDecoration: "underline",
		wordBreak: "break-word",
	},
}));

const Row = ({ row, onDeleteApp, onChangeApp }) => {
	const classes = useStyles();
	return (
		<TableRow>
			<TableCell>
				<span className={classes.appName}>{row.name}</span>
			</TableCell>
			<TableCell>{row.totalSites}</TableCell>
			<TableCell
				style={{
					paddingLeft: 90,
					width: "245px",
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
};

export default Row;
