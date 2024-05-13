import React, { useState } from "react";

import PropTypes from "prop-types";
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import PopupMenu from "components/Elements/PopupMenu";
import ColourConstants from "helpers/colourConstants";
import TableStyle from "styles/application/TableStyle";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";

const AT = TableStyle();

const mediaMobile = "@media(max-width: 414px)";
const mediaIpad = "@media(max-width: 1024px)";

const useStyles = makeStyles()((theme) => ({
	tableContainer: {
		tableLayout: "fixed",
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
		[mediaMobile]: {
			tableLayout: "auto",
		},
		[mediaIpad]: {
			maxWidth: "100%",
			overflowX: "auto",
			tableLayout: "auto",
		},
	},
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
		width: "20%",
	},

	dataCell: {
		height: 50,
	},
	defaultText: {
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		color: ColourConstants.tableBorder,
		fontStyle: "italic",
		paddingLeft: 5,
		display: "inline-flex",
	},
	defaultNameText: {
		fontWeight: "bold",
	},
	tableHead: {
		whiteSpace: "nowrap",
	},
}));

const ArragementListTable = ({
	data,
	columns,
	headers,
	isLoading,
	defaultID,
	menuData,
	access,
	handleEdit,
	handleDelete,
}) => {
	const { classes, cx } = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<AutoFitContentInScreen containsTable>
			<Table aria-label="Table" className={classes.tableContainer}>
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						{headers.map((header, index) => (
							<TableCell
								key={header}
								className={cx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === columns[index],
									[classes.tableHeadRow]:
										currentTableSort[0] !== columns[index],
								})}
							>
								<AT.CellContainer className="flex justify-between">
									{header}
								</AT.CellContainer>
							</TableCell>
						))}
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data.length !== 0 ? (
						data.map((row, index) => (
							<TableRow
								key={row.id}
								id={`arrangement-${row.id}`}
								className={`arrangementEl`}
							>
								{columns.map((col, i, arr) => (
									<TableCell
										key={col}
										scope="row"
										className={cx(classes.dataCell, classes.nameRow, {
											[classes.lastCell]: index === data.length - 1,
										})}
									>
										<AT.CellContainer key={col}>
											<AT.TableBodyText
												className={cx({
													[classes.defaultNameText]:
														row.id === defaultID && i === 0,
												})}
											>
												{`${row[col]}`}
											</AT.TableBodyText>
											{row.id === defaultID && i === 0 ? (
												<Typography className={classes.defaultText}>
													(Default)
												</Typography>
											) : null}
											{arr.length === i + 1 ? (
												<AT.DotMenu
													onClick={(e) => {
														setAnchorEl(
															anchorEl === e.currentTarget
																? null
																: e.currentTarget
														);
														setSelectedData(
															anchorEl === e.currentTarget ? null : index
														);
													}}
												>
													{menuData.length > 0 && (
														<AT.TableMenuButton>
															<MenuIcon />
														</AT.TableMenuButton>
													)}

													<PopupMenu
														index={index}
														selectedData={selectedData}
														anchorEl={anchorEl}
														id={row.id}
														clickAwayHandler={() => {
															setAnchorEl(null);
															setSelectedData(null);
														}}
														menuData={[
															{
																name: "Edit",
																handler: () => handleEdit(row),
																isDelete: false,
															},
															{
																name: "Delete",
																handler: handleDelete,
																isDelete: true,
															},
														].filter((x) => {
															if (access === "F") return true;
															if (access === "E") {
																if (x.name === "Edit") return true;
																else return false;
															}
															return false;
														})}
													/>
												</AT.DotMenu>
											) : null}
										</AT.CellContainer>
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							{headers.map((head, i) => {
								if (i === 0) {
									return <TableCell key={head}>No Record Found</TableCell>;
								} else {
									return <TableCell key={head}></TableCell>;
								}
							})}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</AutoFitContentInScreen>
	);
};

ArragementListTable.defaultProps = {
	data: [
		{
			id: 1,
			name: "XYZ",
		},
		{
			id: 2,
			name: "ABC",
		},
	],
	columns: ["name"],
	headers: ["Name"],
	defaultID: null,
};

ArragementListTable.propTypes = {
	data: PropTypes.array,
	defaultID: PropTypes.number,
	columns: PropTypes.array,
	headers: PropTypes.array,
};

export default ArragementListTable;
