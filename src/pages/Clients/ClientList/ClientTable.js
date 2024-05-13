import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PopupMenu from "components/Elements/PopupMenu";
import ColourConstants from "helpers/colourConstants";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { clientsPath } from "helpers/routePaths";
import { getLocalStorageData } from "helpers/utils";
import { RESELLER_ID } from "constants/UserConstants/indes";
import { shareModelsOptions } from "helpers/constants";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

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
	clientLogo: {
		maxHeight: MAX_LOGO_HEIGHT,
	},
	noImage: {
		color: ColourConstants.commonText,
		opacity: "50%",
	},
	lastCell: {
		borderBottom: "none",
	},
}));

const ClientTable = ({
	data,
	setData,
	handleSort,
	searchQuery,
	handleStatusChangeDialogOpen,
	searchedData,
	setSearchedData,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	// Init State
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
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

	const { adminType } = getLocalStorageData("me");

	const isReseller = adminType === RESELLER_ID;

	const getDynamicmenuData = (row) => {
		const initialMenu = [
			{
				name: "Edit",
				handler: () => {
					navigate(`${row.id}`);
				},
				isDelete: false,
			},
		];

		if (!isReseller) {
			initialMenu.push({
				name: row.isActive ? "Make Inactive" : "Make active",
				handler: () => {
					handleStatusChangeDialogOpen(row.id, row.isActive);
				},
				isDelete: false,
			});
		}
		if (isReseller && row.isActive) {
			initialMenu.push({
				name: "Make Inactive",
				handler: () => {
					handleStatusChangeDialogOpen(row.id, row.isActive);
				},
				isDelete: false,
			});
		}

		return initialMenu;
	};

	//get the name of shareModels Label
	function getShareModelName(value) {
		const shareModelType = shareModelsOptions.find((x) => x.value === value);
		return shareModelType.label;
	}

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
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
								handleSortClick("shareModels");
							}}
							className={cx(classes.clientsRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "shareModels",
								[classes.tableHeadRow]: currentTableSort[0] !== "shareModels",
							})}
						>
							<AT.CellContainer>
								Model Sharing
								{currentTableSort[0] === "shareModels" &&
								currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>

						<TableCell
							onClick={() => {
								handleSortClick("status");
							}}
							className={cx(classes.clientsRow, {
								[classes.selectedTableHeadRow]:
									currentTableSort[0] === "status",
								[classes.tableHeadRow]: currentTableSort[0] !== "status",
							})}
						>
							<AT.CellContainer>
								Status
								{currentTableSort[0] === "status" &&
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
								className={cx(classes.dataCell, classes.nameRow, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								<AT.CellContainer>
									<AT.TableBodyText>
										<Link className={classes.nameLink} to={`${row.id}`}>
											{row.name}
										</Link>
									</AT.TableBodyText>
								</AT.CellContainer>
							</TableCell>
							<TableCell
								component="th"
								scope="row"
								className={cx(classes.dataCell, classes.nameRow, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								<AT.CellContainer>
									<AT.TableBodyText>
										<>{getShareModelName(row.shareModels)}</>
									</AT.TableBodyText>
								</AT.CellContainer>
							</TableCell>
							<TableCell
								className={cx(classes.dataCell, {
									[classes.lastCell]: index === data.length - 1,
								})}
							>
								<AT.CellContainer>
									{row.isActive ? (
										<p style={{ color: ColourConstants.black }}>Active</p>
									) : (
										<p style={{ color: ColourConstants.red }}>Inactive</p>
									)}

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
											menuData={getDynamicmenuData(row)}
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

export default ClientTable;
