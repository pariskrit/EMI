import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";

import useInfiniteScroll from "hooks/useInfiniteScroll";
import { usersPath } from "helpers/routePaths";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { defaultPageSize } from "helpers/utils";
import { REMOVE, SuperAdminType } from "constants/UserConstants/indes";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const media = "@media (max-width: 414px)";

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
	tableBody: {
		whiteSpace: "noWrap",
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
		width: 130,
		[media]: {
			width: 130,
			// width: "auto",
		},
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

const UserTable = ({
	data,
	page,
	setPage,
	setData,
	columns,
	headers,
	searchText,
	handleSort,
	searchQuery,
	onPageChange,
	searchedData,
	setSearchData,
	handleDeleteDialogOpen,
	position,
	access,
	count,
	setCurrentTableSort,
	currentTableSort,
	handleResendInvitation,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	// Init State
	// const [currentTableSort, setCurrentTableSort] = useState(["name", "desc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const { hasMore, loading, gotoTop } = useInfiniteScroll(
		data,
		count,
		async (pageSize, prevData, extraInfo, searchText) =>
			await onPageChange(
				pageSize + 1,
				prevData,
				searchText,
				extraInfo.currentTableSort[1],
				extraInfo.currentTableSort[0]
			),
		page,
		searchText,
		window,
		{ currentTableSort }
	);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[1] === "" || field !== currentTableSort[0]
				? "asc"
				: currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		// Updating header state
		setCurrentTableSort([field, newMethod]);
		setPage({ pageNo: 1, perPage: defaultPageSize() });
	};

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow>
						{headers.map((header, i) => (
							<TableCell
								key={header}
								onClick={() => {
									handleSortClick(columns[i]);
								}}
								className={cx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === columns[i],
									[classes.tableHeadRow]: currentTableSort[0] !== columns[i],
								})}
							>
								<AT.CellContainer>
									{header}
									{currentTableSort[0] === columns[i] &&
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
				<TableBody className={classes.tableBody}>
					{(searchQuery === "" ? data : searchedData).map((row, index) => (
						<TableRow key={index}>
							{columns.map((col, i, arr) => (
								<AT.DataCell key={col}>
									<AT.CellContainer key={col}>
										<AT.TableBodyText>
											{/* <Link
												className={classes.nameLink}
												to={`${usersPath}/${row.id}`}
											> */}
											{col === "Type" &&
												SuperAdminType.find((d) => d.id === row?.adminType)
													?.role}

											{col === "isAdmin" &&
												(row["isAdmin"] ? (
													<span style={{ color: "green" }}>Yes</span>
												) : (
													""
												))}

											{col === "active"
												? row[col]
													? "Active"
													: "Inactive"
												: row[col]}
											{/* </Link> */}
										</AT.TableBodyText>

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
												{position === null ||
												access === "F" ||
												access === "E" ? (
													<AT.TableMenuButton>
														<MenuIcon />
													</AT.TableMenuButton>
												) : null}

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
																navigate(
																	`${
																		row?.clientUserSiteAppID ||
																		row?.clientUserID ||
																		row?.id
																	}`
																);
															},
															isDelete: false,
															access: "E",
														},
														...(row?.lastLogin === null
															? [
																	{
																		name: "Resend Invitation",
																		handler: () => handleResendInvitation(row),
																		isDelete: false,
																		access: "F",
																	},
															  ]
															: []),
														{
															name: REMOVE,
															handler: () => handleDeleteDialogOpen(row),
															isDelete: true,
															access: "F",
														},
													].filter((x) => {
														if (
															position === null ||
															access === "F" ||
															access === x.access
														)
															return true;
														else return false;
													})}
												/>
											</AT.DotMenu>
										) : null}
									</AT.CellContainer>
								</AT.DataCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* scroll to load */}
			{loading && (
				<div style={{ padding: "16px 10px" }}>
					<b>Loading...</b>
				</div>
			)}

			{!hasMore && (
				<div
					style={{ textAlign: "center", padding: "16px 10px" }}
					className="flex justify-center"
				>
					<span
						className="link-color ml-md cursor-pointer"
						onClick={() => gotoTop()}
					>
						Go to top
					</span>
				</div>
			)}
		</AT.TableContainer>
	);
};

export default UserTable;
