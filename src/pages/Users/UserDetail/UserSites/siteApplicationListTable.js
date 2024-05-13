import React from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ColourConstants from "helpers/colourConstants";

import ApplicationRow from "./ApplicationRow";

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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	nameRow: {
		width: "200px",
		height: "10px",
		lineHeight: "1rem",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 40,
	},
	applicationContainer: {
		padding: 40,
	},
}));

function UserSiteApplicationListTable({
	data,
	headers,
	columns,
	clientUserSiteID,
	fetchUserSites,
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.applicationContainer}>
			<AT.TableContainer style={{ overflow: "visible" }}>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header, index) => (
								<TableCell
									key={header.id}
									style={{ width: header?.width || "auto" }}
									className={cx(classes.nameRow, {
										[classes.tableHeadRow]: true,
									})}
								>
									<AT.CellContainer className="flex justify-between">
										{header.name}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{data?.length !== 0 ? (
							data?.map((row, index) => (
								<ApplicationRow
									row={row}
									data={data}
									index={index}
									key={row.id}
									clientUserSiteID={clientUserSiteID}
									fetchUserSites={fetchUserSites}
								/>
							))
						) : (
							<TableRow>
								{headers.map((head, i) => {
									if (i === 0) {
										return <TableCell key={head.id}>No Record Found</TableCell>;
									} else {
										return <TableCell key={head.id}></TableCell>;
									}
								})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
}

export default UserSiteApplicationListTable;
