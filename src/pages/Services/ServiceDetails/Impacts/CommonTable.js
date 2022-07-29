import {
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "0.5px solid",
	},
	noDataTableRow: {
		borderBottom: "none !important",
	},
	tableBody: {
		border: "0.5px solid",
	},
}));

function dynamicWidth(i) {
	if (i === 0) {
		return {
			width: "40vw",
		};
	}

	if (i === 1) {
		return { width: "30vw" };
	}
}

function CommonTable({ data = [], headers = [], columns = [] }) {
	const classes = useStyles();

	const style = { width: Math.floor(100 / headers.length) + "%" };
	return (
		<Table className={classes.tableContainer}>
			<TableHead className={classes.tableHead}>
				<TableRow>
					{headers.map((header, i) => (
						<TableCell key={header} style={dynamicWidth(i)}>
							{header}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody className={classes.tableBody}>
				{data?.length === 0 ? (
					<TableRow>
						<TableCell className={classes.noDataTableRow}>
							No Records Found
						</TableCell>
					</TableRow>
				) : (
					data?.map((row) => (
						<TableRow key={row.createdDateTime + row.userName}>
							{columns.map((column) => (
								<TableCell key={column}>{row[column]}</TableCell>
							))}
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}

export default CommonTable;
