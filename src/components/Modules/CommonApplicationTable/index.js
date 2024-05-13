import React, { useState } from "react";

import PropTypes from "prop-types";
import {
	CircularProgress,
	Paper,
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
import { dyanamicCellSize, handleSort } from "helpers/utils";
import { DefaultPageOptions } from "helpers/constants";

const AT = TableStyle();

const mediaMobile = "@media(max-width: 414px)";
const mediaIpad = "@media(max-width: 1375px)";

const useStyles = makeStyles()((theme) => ({
	tableContainer: {
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

const CommonApplicationTable = ({
	data,
	setData,
	setSearch,
	searchedData,
	searchQuery,
	columns,
	headers,
	isLoading,
	defaultID,
	menuData,
	isReadOnly = false,
	defaultCustomCaptionsData,
}) => {
	const { classes, cx } = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const defaultOptions = DefaultPageOptions(defaultCustomCaptionsData);
	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Sorting table
		if (searchQuery.length === 0) handleSort(data, setData, field, newMethod);
		else handleSort(searchedData, setSearch, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<AT.TableContainer component={Paper} elevation={0}>
				<Table aria-label="Table" className={classes.tableContainer}>
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header, index) => (
								<TableCell
									key={header}
									onClick={() => {
										handleSortClick(columns[index]);
									}}
									className={cx(
										classes.dataCell,
										dyanamicCellSize(headers.length),
										{
											[classes.selectedTableHeadRow]:
												currentTableSort[0] === columns[index],
											[classes.tableHeadRow]:
												currentTableSort[0] !== columns[index],
										}
									)}
								>
									<AT.CellContainer className="flex justify-between">
										{header}
										{currentTableSort[0] === columns[index] &&
										currentTableSort[1] === "desc" ? (
											<AT.DefaultArrow fill="#FFFFFF" />
										) : (
											<AT.DescArrow fill="#FFFFFF" />
										)}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{data.length !== 0 ? (
							(searchQuery.length === 0 ? data : searchedData).map(
								(row, index) => (
									<TableRow key={row.id}>
										{columns.map((col, i, arr) => (
											<TableCell
												key={col}
												component="th"
												scope="row"
												className={cx(
													classes.dataCell,
													dyanamicCellSize(columns.length),
													{
														[classes.lastCell]: index === data.length - 1,
													}
												)}
											>
												<AT.CellContainer key={col}>
													<AT.TableBodyText
														className={cx({
															[classes.defaultNameText]:
																row.id === defaultID && i === 0,
														})}
													>
														{col === "defaultPage"
															? defaultOptions[row[col]]
															: col === "allowPublish"
															? row[col]
																? "Yes"
																: "No"
															: `${row[col]}`}
													</AT.TableBodyText>
													{row.id === defaultID && i === 0 ? (
														<Typography className={classes.defaultText}>
															(Default)
														</Typography>
													) : null}
													{!isReadOnly && arr.length === i + 1 ? (
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
								)
							)
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
			</AT.TableContainer>
		</div>
	);
};

CommonApplicationTable.defaultProps = {
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

CommonApplicationTable.propTypes = {
	data: PropTypes.array,
	defaultID: PropTypes.number,
	columns: PropTypes.array,
	headers: PropTypes.array,
};

export default CommonApplicationTable;
