import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React from "react";

const useStyles = makeStyles()((theme) => ({
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "0.5px solid",
	},
	tableHeadPrint: {
		backgroundColor: "#D2D2D9",
		border: "0.5px solid",
		display: "table-row-group",
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
			width: "50vw",
		};
	}
	if (i === 1) {
		return { width: "20vw" };
	} else {
		return { width: "20vw" };
	}
}

function CommonTable({ data = [], headers = [], columns = [], isPrint }) {
	const { classes, cx } = useStyles();

	const style = { width: Math.floor(100 / headers.length) + "%" };
	return (
		<Table className={classes.tableContainer}>
			<TableHead
				className={isPrint ? classes.tableHeadPrint : classes.tableHead}
			>
				<TableRow>
					{headers.map((header, i) => (
						<TableCell
							key={header}
							style={headers.length === 4 ? dynamicWidth(i) : style}
						>
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
