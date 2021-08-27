import React from "react";
import PropTypes from "prop-types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import Row from "./Row";
import "./style.scss";

const useStyles = makeStyles((theme) => ({
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
		width: "100%",
	},
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
const ApplicationTable = ({ data, onDeleteApp, onChangeApp }) => {
	const classes = useStyles();

	return (
		<Table>
			<TableHead className={classes.tableHead}>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>Sites(Qty)</TableCell>
					<TableCell style={{ paddingLeft: 90 }}>Status</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{data.map((row) => (
					<Row
						key={row.id}
						row={row}
						classes={classes}
						onDeleteApp={() => onDeleteApp(row.id)}
						onChangeApp={() => onChangeApp(row.id)}
					/>
				))}
			</TableBody>
		</Table>
	);
};

ApplicationTable.defaultProps = {
	data: [
		{
			applicationID: 1,
			id: 34,
			isActive: false,
			name: "ComponentStatus",
			totalSites: 0,
		},
	],
};

ApplicationTable.propTypes = {
	data: PropTypes.array,
	onDeleteApp: PropTypes.func,
	onChangeApp: PropTypes.func,
};

export default ApplicationTable;
