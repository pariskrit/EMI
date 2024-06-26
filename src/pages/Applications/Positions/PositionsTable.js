import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PositionAccessTypes from "helpers/positionAccessTypes";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";

// Position Table CSS
import "./positionTable.css";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { DefaultPageOptions } from "helpers/constants";

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
	rowWithRightRow: {
		borderRightColor: ColourConstants.tableBorder,
		borderRightStyle: "solid",
		borderRightWidth: 1,
	},
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	generalRow: {
		width: `${100 / 11}%`,
	},
	headerName: {
		width: 95,
	},
	arrowContainer: {
		marginLeft: "auto",
		width: 15,
	},
	tableHead: {
		whiteSpace: "nowrap",
	},
}));

const PositionsTable = ({
	data,
	setData,
	handleSort,
	searchQuery,
	handleDeleteDialogOpen,
	handleEditDialogOpen,
	currentTableSort,
	setCurrentTableSort,
	searchedData,
	setSearchedData,
	isReadOnly = false,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	let defaultoptions = DefaultPageOptions();

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
			<Table aria-label="Positions Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]: currentTableSort[0] === "name",
								[classes.tableHeadRow]: currentTableSort[0] !== "name",
							})}
						>
							<AT.CellContainer>
								Name
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "name" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "defaultPage",
								[classes.tableHeadRow]: currentTableSort[0] !== "defaultPage",
							})}
						>
							<AT.CellContainer>
								Default Page
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "defaultPage" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("modelAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "modelAccess",
								[classes.tableHeadRow]: currentTableSort[0] !== "modelAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Asset Models</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "modelAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("allowPublish");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "allowPublish",
								[classes.tableHeadRow]: currentTableSort[0] !== "allowPublish",
							})}
						>
							<AT.CellContainer>
								Allow Publish
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "allowPublish" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("assets");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "assets",
								[classes.tableHeadRow]: currentTableSort[0] !== "assets",
							})}
						>
							<AT.CellContainer>
								Assets
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "assets" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("serviceAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "serviceAccess",
								[classes.tableHeadRow]: currentTableSort[0] !== "serviceAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Services</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "serviceAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("defectAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "defectAccess",
								[classes.tableHeadRow]: currentTableSort[0] !== "defectAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Defects</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "defectAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("noticeboardAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "noticeboardAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "noticeboardAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Notice Boards</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "noticeboardAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("feedbackAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "feedbackAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "feedbackAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Feedback</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "feedbackAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("userAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "userAccess",
								[classes.tableHeadRow]: currentTableSort[0] !== "userAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Users</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "userAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("analyticsAccess");
							}}
							className={cx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "analyticsAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "analyticsAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Analytics</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "analyticsAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
						<TableCell
							onClick={() => {
								handleSortClick("settingsAccess");
							}}
							className={cx(classes.generalRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "settingsAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "settingsAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Settings</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "settingsAccess" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							</AT.CellContainer>
						</TableCell>
					</TableRow>
				</AT.TableHead>

				<TableBody>
					{(searchQuery === "" ? data : searchedData).map((d, index) => (
						<TableRow key={d.id}>
							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>{d.name}</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>

							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>
										{defaultoptions[d.defaultPage]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>

							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.modelAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>

							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>{d.allowPublish}</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>

							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.assetAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>

							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.serviceAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.defectAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.noticeboardAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.feedbackAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.userAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.analyticsAccess]}
									</AT.TableBodyText>
								</AT.CellContainer>
							</AT.DataCell>
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.settingsAccess]}
									</AT.TableBodyText>

									{!isReadOnly && (
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
													},
													{
														name: "Delete",
														handler: handleDeleteDialogOpen,
														isDelete: true,
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
};

export default PositionsTable;
