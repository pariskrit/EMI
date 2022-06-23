import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Table from "@material-ui/core/Table";
import { useHistory } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";

import useInfiniteScroll from "hooks/useInfiniteScroll";
import { servicesPath } from "helpers/routePaths";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import { getServicesList } from "services/services/serviceLists";
import { DefaultPageSize, statusTypeClassification } from "helpers/constants";
import EMICheckbox from "components/Elements/EMICheckbox";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles({
	tableBody: {
		whiteSpace: "noWrap",
	},

	lastCell: {
		borderBottom: "none",
	},
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
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
});

const ServiceListTable = ({
	data,
	page,
	setData,
	columns,
	headers,
	searchText,
	handleSort,
	searchQuery,
	searchedData,
	setSearchData,
	handleDeleteDialogOpen,
	handleChnageStatus,
	formattedData,
	countOFService,
	siteAppID,
	status,
	department,
	date,
	setDataForFetchingService,
	currentTableSort,
	setCurrentTableSort,
	handleSelectService,
}) => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrollEvent, setScrollEvent] = useState(window);
	const scrollRef = useRef(true);

	const { hasMore, loading, gotoTop, handleScroll } = useInfiniteScroll(
		data,
		countOFService,
		async (pageSize, prevData, name) =>
			await onPageChange(pageSize + 1, prevData, name),
		page,
		searchText,
		scrollEvent,
		{
			statusType:
				status === 2 || status === 1 ? statusTypeClassification[status] : "",
			status: status === 2 || status === 1 ? "" : status,
			sortField: currentTableSort[0],
			sort: currentTableSort[1],
			siteDepartmentID: department,
			fromDate: date.fromDate,
			toDate: date.toDate,
			search: searchText,
			page,
		}
	);

	useEffect(() => {
		if (data) {
			if (scrollRef.current === true) {
				document
					.getElementById("table-scroll-wrapper-container")
					.addEventListener("scroll", (e) =>
						handleScroll(e, "table-scroll-wrapper-container")
					);
				setScrollEvent(
					document.getElementById("table-scroll-wrapper-container")
				);
				scrollRef.current = false;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	//Pagination

	const onPageChange = async (p, prevData, name) => {
		try {
			const response = await getServicesList({
				siteAppId: siteAppID,
				pageNumber: p,
				pageSize: DefaultPageSize,
				...name,
			});
			if (response.status) {
				setDataForFetchingService((prev) => ({ ...prev, pageNumber: p }));
				setData([...prevData, ...response.data]);
				response.data = [...prevData, ...response.data];
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		handleSort(field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<>
			<AutoFitContentInScreen containsTable={true}>
				<Table aria-label="Table" className={classes.table}>
					<AT.TableHead className={classes.taskHeader}>
						<TableRow className={classes.tableHead}>
							{headers.map((header, index) => (
								<TableCell
									key={header.id}
									onClick={() => {
										handleSortClick(columns[index]);
									}}
									style={{ width: header?.width || "auto" }}
									className={clsx(classes.nameRow, {
										[classes.selectedTableHeadRow]:
											currentTableSort[0] === columns[index],
										[classes.tableHeadRow]:
											currentTableSort[0] !== columns[index],
									})}
								>
									<AT.CellContainer
										className="flex justify-between"
										style={index === 0 ? { marginLeft: "38px" } : {}}
									>
										{header.name}
										{
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
										}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody className={classes.tableBody}>
						{formattedData(data, history)?.map((row, index) => (
							<TableRow key={index}>
								{columns?.map((col, i, arr) => (
									<AT.DataCell key={col}>
										<AT.CellContainer key={col}>
											<AT.TableBodyText>
												{col === "workOrder" ? (
													<span
														style={{
															display: "flex",
															flexDirection: "space-around",
															alignItems: "center",
															gap: 10,
														}}
													>
														{" "}
														<EMICheckbox
															// state={false}
															changeHandler={({ target: { checked } }) => {
																handleSelectService(data[index], checked);
															}}
														/>
														{col === "modelName"
															? row[col] + " " + row["model"]
															: row[col]}
													</span>
												) : col === "modelName" ? (
													row[col] + " " + row["model"]
												) : (
													row[col]
												)}
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
																	history.push(`${servicesPath}/${row.id}`);
																},
																isDelete: false,
																showInStatus: "Edit",
															},
															{
																name: "Cancel",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "S",
																otherDetail: "X",
															},
															{
																name: "Cancel Checkout",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "O" || "H",
																otherDetail: "R",
															},
															{
																name: "Reset",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "I",
																otherDetail: "R",
															},
															{
																name: "Complete",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "T",
																tasksSkipped: true,
																otherDetail: "C",
															},
															{
																name: "Incomplete",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "T",
																otherDetail: "N",
															},
															{
																name: "Completed by Paper",
																handler: handleChnageStatus,
																isDelete: false,
																showInStatus: "S",
																otherDetail: "P",
															},
															{
																name: "Delete",
																handler: handleDeleteDialogOpen,
																isDelete: true,
																showInStatus: "S",
															},
														].filter((x) => {
															if (x.showInStatus === "Edit") return true;
															if (
																x.name === "Complete" &&
																x.showInStatus === data[index]["status"] &&
																x?.tasksSkipped === true
															) {
																return true;
															}
															if (x.showInStatus === data[index]["status"])
																return true;
															return false;
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

					{/* scroll to load */}
					{loading && (
						<div style={{ padding: "16px 10px" }}>
							<b>Loading...</b>
						</div>
					)}
				</Table>
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
			</AutoFitContentInScreen>
		</>
	);
};

export default ServiceListTable;
