import React, { useEffect, useRef, useState } from "react";
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
import { feedbackPath } from "helpers/routePaths";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import { defaultPageSize } from "helpers/utils";
import { getFeedbackList } from "services/feedback/feedbackList";
import { isRelevantFeedback } from "./FeedbackContent";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles()((theme) => ({
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
}));

const FeedbackListTable = ({
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
	formattedData,
	countOFFeedback,
	siteAppID,
	status,
	department,
	date,
	myFeedback,
	setDataForFetchingFeedback,
	currentTableSort,
	setCurrentTableSort,
	userId,
	positionId,
	content,
	isReadOnly,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrollEvent, setScrollEvent] = useState(window);
	const scrollRef = useRef(true);
	const dispatch = useDispatch();

	const { hasMore, loading, gotoTop, handleScroll } = useInfiniteScroll(
		data,
		countOFFeedback,
		async (pageSize, prevData, name) =>
			await onPageChange(pageSize + 1, prevData, name),
		page,
		searchText,
		scrollEvent,
		{
			feedbackStatusID: ["C", "O"].includes(status) ? "" : status,
			statusType: ["C", "O"].includes(status) ? status : "",
			siteDepartmentID: department,
			fromDate: date.fromDate,
			toDate: date.toDate,
			search: searchText,
			sortField: currentTableSort[0],
			sortOrder: currentTableSort[1],
			myFeedback,
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

	//Pagination of feedback
	const onPageChange = async (p, prevData, name) => {
		try {
			const response = await getFeedbackList({
				siteAppId: siteAppID,
				pageNumber: p,
				pageSize: defaultPageSize(),
				...name,
			});
			if (response.status) {
				setDataForFetchingFeedback((prev) => ({ ...prev, pageNumber: p }));
				setData([...prevData, ...response.data]);
				response.data = [...prevData, ...response.data];
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			dispatch(
				showError(
					err?.response?.detail ||
						`Failed to fetch ${content || "feedback"} list`
				)
			);
			return err;
		}
	};

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

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
										header.disableSort !== true &&
											handleSortClick(columns[index]);
									}}
									style={{
										width: header?.width || "auto",
										minWidth: header?.minWidth || "auto",
									}}
									className={cx(classes.nameRow, {
										[classes.selectedTableHeadRow]:
											currentTableSort[0] === columns[index],
										[classes.tableHeadRow]:
											currentTableSort[0] !== columns[index],
									})}
								>
									<AT.CellContainer className="flex justify-between">
										{header.name}

										{header.disableSort !== true && (
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
										)}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody className={classes.tableBody}>
						{formattedData(data, navigate, { userId, positionId })?.map(
							(row, index) => (
								<TableRow key={index}>
									{columns?.map((col, i, arr) => (
										<TableCell
											key={col}
											style={{
												width: headers[i]?.width || "auto",
												minWidth: headers[i]?.minWidth || "auto",
												maxWidth: "350px",
												whiteSpace: "normal",
												fontWeight: isRelevantFeedback(row, {
													userId,
													positionId,
												})
													? "bold"
													: "",
											}}
										>
											<AT.CellContainer key={col}>
												{row[col]}
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
															menuData={
																isReadOnly
																	? [
																			{
																				name: "View",
																				handler: () => {
																					navigate(`${feedbackPath}/${row.id}`);
																				},
																				isDelete: false,
																			},
																	  ]
																	: [
																			{
																				name: "Edit",
																				handler: () => {
																					navigate(`${row.id}`);
																				},
																				isDelete: false,
																			},
																			{
																				name: "Delete",
																				handler: handleDeleteDialogOpen,
																				isDelete: true,
																			},
																	  ]
															}
														/>
													</AT.DotMenu>
												) : null}
											</AT.CellContainer>
										</TableCell>
									))}
								</TableRow>
							)
						)}
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

export default FeedbackListTable;
