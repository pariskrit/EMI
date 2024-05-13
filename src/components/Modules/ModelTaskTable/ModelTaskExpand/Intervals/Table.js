import React from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ColourConstants from "helpers/colourConstants";

import EMICheckbox from "components/Elements/EMICheckbox";

const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
		borderRightColor: "#979797",
		borderRightStyle: "solid",
		borderRightWidth: "1px",
	},
	nameRow: {
		width: "78px",
		height: "10px",
		lineHeight: "1rem",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 40,
	},
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
	},
}));

function IntervalTable({ data = [], handleIntervalCheckbox, isDisabled }) {
	const { classes, cx } = useStyles();
	return (
		<div>
			<Table aria-label="Table" className={classes.table}>
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						<TableCell
							className={cx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Selected
						</TableCell>
						<TableCell
							style={{ width: "auto" }}
							className={cx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Name
						</TableCell>
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data?.length !== 0 ? (
						data?.map((row) => (
							<TableRow key={row?.modelVersionIntervalID}>
								<TableCell
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<EMICheckbox
										state={row?.checked}
										changeHandler={(e) =>
											handleIntervalCheckbox(
												e.target.checked,
												row.modelVersionIntervalID,
												row.id
											)
										}
										disabled={isDisabled}
									/>
								</TableCell>
								<TableCell>{row.name}</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell>No Record Found</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default IntervalTable;
