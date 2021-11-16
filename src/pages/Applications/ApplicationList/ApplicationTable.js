import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import PopupMenu from "components/Elements/PopupMenu";
import ColourConstants from "helpers/colourConstants";

import "./applicationtable.css";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { applicationListPath } from "helpers/routePaths";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles({
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
		width: "40%",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 85,
	},
	nameLink: {
		color: ColourConstants.activeLink,
	},
	applicationLogo: {
		maxHeight: MAX_LOGO_HEIGHT,
	},
	noImage: {
		color: ColourConstants.commonText,
		opacity: "50%",
	},
	lastCell: {
		borderBottom: "none",
	},
});

const ApplicationTable = ({
	data,
	setData,
	handleSort,
	searchQuery,
	handleDeleteDialogOpen,
	handleDuplicateDialogOpen,
	searchedData,
	setSearchedData,
}) => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init State
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
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
		<AT.TableContainer
			component={Paper}
			elevation={0}
			className="applicationTableContainer"
		>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						<TableCell
							onClick={() => {
								handleSortClick("name");
							}}
							className={clsx(classes.nameRow, {
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
						<AT.MiddleTableRow className={classes.tableHeadRow}>
							Logo
						</AT.MiddleTableRow>
						<AT.MiddleTableRow className={classes.tableHeadRow}>
							Status
						</AT.MiddleTableRow>
						<TableCell
							onClick={() => {
								handleSortClick("clients");
							}}
							className={clsx(classes.clientsRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "clients",
								[classes.tableHeadRow]: currentTableSort[0] !== "clients",
							})}
						>
							<AT.CellContainer>
								Number of Clients
								{currentTableSort[0] === "clients" &&
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
					{(searchQuery === "" ? data : searchedData).map((row, index) => (
						<TableRow key={index}>
							<TableCell
								component="th"
								scope="row"
								className={clsx(classes.dataCell, classes.nameRow, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								<Link
									className={classes.nameLink}
									to={`/app${applicationListPath}/${row.id}`}
								>
									{row.name}
								</Link>
							</TableCell>
							<TableCell
								className={clsx(classes.dataCell, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								{row.logoURL === null || row.logoURL === undefined ? (
									<Typography className={classes.noImage}>
										No Image...
									</Typography>
								) : (
									<img
										className={classes.applicationLogo}
										src={row.logoURL}
										alt="application logo"
									/>
								)}
							</TableCell>
							<TableCell
								className={clsx(classes.dataCell, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								{row.isActive ? "Active" : "Inactive"}
							</TableCell>
							<TableCell
								className={clsx(classes.dataCell, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								<AT.CellContainer>
									<AT.TableBodyText>{row.clients}</AT.TableBodyText>

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
											id={row.id}
											clickAwayHandler={() => {
												setAnchorEl(null);
												setSelectedData(null);
											}}
											menuData={[
												{
													name: "Edit",
													handler: () => {
														history.push(`${applicationListPath}/${row.id}`);
													},
													isDelete: false,
												},
												{
													name: "Duplicate",
													handler: handleDuplicateDialogOpen,
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</AT.TableContainer>
	);
};

export default ApplicationTable;
