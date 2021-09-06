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

const media = "@media (max-width: 414px)";

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		[media]: {
			whiteSpace: "nowrap",
		},
	},
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
	noDataTableRow: {
		borderBottom: "none !important",
	},
}));
const ApplicationTable = ({
	data,
	onDeleteApp,
	onChangeApp,
	showDeleteIcon,
	showQuantity,
}) => {
	const classes = useStyles();
	console.log(data);
	return (
		<Table className={classes.tableContainer}>
			<TableHead className={classes.tableHead}>
				<TableRow>
					<TableCell>Name</TableCell>
					{showQuantity && <TableCell>Sites(Qty)</TableCell>}
					<TableCell style={{ paddingLeft: 90 }}>Status</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{data.length === 0 ? (
					<TableRow>
						<TableCell className={classes.noDataTableRow}>
							No Records Found
						</TableCell>
					</TableRow>
				) : (
					data.map((row) => (
						<Row
							key={row.id}
							row={row}
							classes={classes}
							showDeleteIcon={showDeleteIcon}
							showQuantity={showQuantity}
							onDeleteApp={() => onDeleteApp(row.id)}
							onChangeApp={() => onChangeApp(row.id)}
						/>
					))
				)}
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
	showDeleteIcon: true,
	showQuantity: true,
};

ApplicationTable.propTypes = {
	data: PropTypes.array,
	showDeleteIcon: PropTypes.bool,
	showQuantity: PropTypes.bool,
	onDeleteApp: PropTypes.func,
	onChangeApp: PropTypes.func,
};

export default ApplicationTable;
