import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TableStyle from "../../../styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import PositionAccessTypes from "../../../helpers/positionAccessTypes";
import ColourConstants from "../../../helpers/colourConstants";
import PopupMenu from "../../../components/PopupMenu";

// Position Table CSS
import "./positionTable.css";

// Icon imports
import { ReactComponent as MenuIcon } from "../../../assets/icons/3dot-icon.svg";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles({
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
		width: 130,
	},
	headerName: {
		width: 95,
	},
	arrowContainer: {
		marginLeft: "auto",
		width: 15,
	},
});

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
}) => {
	// Init hooks
	const classes = useStyles();

	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

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
		<div className="positionTableContainer" component={Paper} elevation={0}>
			<Table aria-label="Positions Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={clsx(classes.rowWithRightRow, {
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
								handleSortClick("modelAccess");
							}}
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
								handleSortClick("serviceAccess");
							}}
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
								handleSortClick("defectExportAccess");
							}}
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "defectExportAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "defectExportAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Defect Exports</div>
								<div className={classes.arrowContainer}>
									{currentTableSort[0] === "defectExportAccess" &&
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
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
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
							className={clsx(classes.generalRow, classes.rowWithRightRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "analyticsAccess",
								[classes.tableHeadRow]:
									currentTableSort[0] !== "analyticsAccess",
							})}
						>
							<AT.CellContainer>
								<div className={classes.headerName}>Reporting</div>
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
							className={clsx(classes.generalRow, {
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
							<AT.DataCell className={classes.generalRow}>
								<AT.CellContainer>
									<AT.TableBodyText>
										{PositionAccessTypes[d.modelAccess]}
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
										{PositionAccessTypes[d.defectExportAccess]}
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
								</AT.CellContainer>
							</AT.DataCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default PositionsTable;
