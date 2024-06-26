import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
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
	subcatRow: {
		width: "20%",
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
	yesText: {
		color: ColourConstants.yesText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
	noText: {
		color: ColourConstants.commonText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
}));

function PausesTable({
	data,
	setData,
	handleSort,
	searchQuery,
	currentTableSort,
	setCurrentTableSort,
	searchedData,
	setSearchedData,
	handleEditDialogOpen,
	handleDeleteDialogOpen,
	isReseller,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchedData, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};
	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Model Table">
				<AT.TableHead>
					<TableRow>
						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={cx(classes.nameRow, {
								[classes.selectedTableHeadRow]: currentTableSort[0] === "name",
								[classes.tableHeadRow]: currentTableSort[0] !== "name",
							})}
						>
							<AT.CellContainer>
								Name
								{currentTableSort[0] === "name" &&
								currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("pauseSubcategories");
							}}
							className={cx(classes.subcatRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "pauseSubcategories",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "pauseSubcategories",
							})}
						>
							<AT.CellContainer>
								Number of subcategories
								{currentTableSort[0] === "pauseSubcategories" &&
								currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>
					</TableRow>
				</AT.TableHead>

				<TableBody>
					{(searchQuery === "" ? data : searchedData).map((d, index) => (
						<TableRow key={index}>
							<AT.DataCell>
								<AT.TableBodyText>{d.name}</AT.TableBodyText>
							</AT.DataCell>
							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>
										{d.pauseSubcategories.length
											? d.pauseSubcategories.length
											: null}
									</AT.TableBodyText>

									{!isReseller && (
										<AT.DotMenu
											onClick={(e) => {
												setAnchorEl(
													anchorEl === e.currentTarget ? null : e.currentTarget
												);
												setSelectedData(
													anchorEl === e.currentTarget ? null : index
												);
											}}
										>
											<AT.TableMenuButton>
												<MenuIcon />
											</AT.TableMenuButton>

											<PopupMenu
												index={index}
												selectedData={selectedData}
												anchorEl={anchorEl}
												isLast={
													searchQuery === ""
														? index === data.length - 1
														: index === searchedData.length - 1
												}
												id={d.id}
												clickAwayHandler={() => {
													setAnchorEl(null);
													setSelectedData(null);
												}}
												menuData={[
													{
														name: "Edit",
														handler: handleEditDialogOpen,
														isDelete: false,
														disabled: isReseller,
													},
													{
														name: "Delete",
														handler: handleDeleteDialogOpen,
														isDelete: true,
														disabled: isReseller,
													},
												]}
											/>
										</AT.DotMenu>
									)}
								</AT.CellContainer>
							</AT.DataCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</AT.TableContainer>
	);
}

export default PausesTable;
