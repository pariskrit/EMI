import React, { useState } from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

import PopupMenu from "components/Elements/PopupMenu";

const AT = TableStyle();

const mediaMobile = "@media (max-width: 414px)";
const mediaIpadpro = "@media (max-width: 1024px)";
const mediaIpad = "@media (max-width: 768px)";

const useStyles = makeStyles()((theme) => ({
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
		[mediaMobile]: {
			maxWidth: "87vw",
			overflowX: "auto",
		},
		[mediaIpadpro]: {
			maxWidth: "87vw",
			overflowX: "auto",
		},
		[mediaIpad]: {
			maxWidth: "85vw",
			overflowX: "auto",
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
}));

function RoleListTable({ data, setData, headers, columns, menuData }) {
	const { classes, cx } = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedData, setSelectedData] = useState(null);

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<Table aria-label="Table" className={classes.table}>
			<AT.TableHead>
				<TableRow className={classes.tableHead}>
					{headers.map((header, index) => (
						<TableCell
							key={header.id}
							onClick={() => {
								handleSortClick(columns[index]);
							}}
							style={{ width: header?.width || "auto" }}
							className={cx(classes.nameRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === columns[index],
								[classes.tableHeadRow]: currentTableSort[0] !== columns[index],
							})}
						>
							<AT.CellContainer className="flex justify-between">
								{header.name}

								<div className="arrow">
									<AT.DescArrow
										fill={
											currentTableSort[0] === columns[index] &&
											currentTableSort[1] === "asc"
												? "#D2D2D9"
												: "#F9F9FC"
										}
										className="arrowUp"
									/>
									<AT.DefaultArrow
										fill={
											currentTableSort[0] === columns[index] &&
											currentTableSort[1] === "desc"
												? "#D2D2D9"
												: "#F9F9FC"
										}
										className="arrowDown"
									/>
								</div>
							</AT.CellContainer>
						</TableCell>
					))}
				</TableRow>
			</AT.TableHead>
			<TableBody>
				{data.length !== 0 ? (
					data.map((row, index) => (
						<TableRow key={row.id} id={`role-${row.id}`} className="roleEl">
							{columns.map((col, i, arr) => (
								<TableCell
									key={col}
									scope="row"
									className={cx(classes.dataCell, classes.nameRow, {
										[classes.lastCell]: index === data.length - 1,
									})}
								>
									<AT.CellContainer key={col}>
										<AT.TableBodyText>{row[col]}</AT.TableBodyText>
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
													menuData={menuData}
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
								return <TableCell key={head.id}>No Record Found</TableCell>;
							} else {
								return <TableCell key={head.id}></TableCell>;
							}
						})}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

export default RoleListTable;
