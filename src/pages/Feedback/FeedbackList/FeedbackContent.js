import {
	CircularProgress,
	Grid,
	LinearProgress,
	Link,
	Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import {
	isoDateWithoutTimeZone,
	convertDateToUTC,
	debounce,
	MuiFormatDate,
	getLocalStorageData,
} from "helpers/utils";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import AddNewFeedbackDetail from "./AddFeedback";
import Header from "./Header";
import FilterListIcon from "@material-ui/icons/FilterList";
import { makeStyles } from "@material-ui/core/styles";
import FeedbackListTable from "./FeedbackListTable";
import {
	defaultTimeframe,
	filterByDateOptions,
} from "constants/serviceDetails";

import { feedbackPath } from "helpers/routePaths";
import {
	DefaultPageSize,
	FEEDBACK_STORAGE_DEPARTMENT,
	FEEDBACK_STORAGE_MY_FEEDBACK,
	FEEDBACK_STORAGE_STATUS,
	FEEDBACK_STORAGE_TIMEFRAME,
} from "helpers/constants";
import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import { changeDate } from "helpers/date";
import {
	getCountOfFeedbackList,
	getFeedbackList,
	postNewFeedback,
} from "services/feedback/feedbackList";
import {
	FeedbackTableColumns,
	FeedbackTableHeader,
} from "constants/FeedbackDetails";
import EMICheckbox from "components/Elements/EMICheckbox";
import { getFeedbackStatuses } from "services/clients/sites/siteApplications/feedbackStatuses";
import ErrorIcon from "@material-ui/icons/Error";
import TabTitle from "components/Elements/TabTitle";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
});

export const isRelevantFeedback = (feedback, me) => {
	return (
		feedback.assignUserID === me.userId ||
		(feedback.assignUserID === null &&
			feedback.assignPositionID === me.positionId) ||
		feedback.createdUserID === me.userId
	);
};

const formattedData = (data, history, me) => {
	return data.map((x) => ({
		...x,
		number: (
			<Link
				onClick={() => history.push(`${feedbackPath}/${x.id}`)}
				style={{ color: ColourConstants.activeLink, cursor: "pointer" }}
			>
				{x.number}
			</Link>
		),
		safetyCritical: isRelevantFeedback(x, me) ? (
			<ErrorIcon style={{ color: ColourConstants.activeLink }} />
		) : (
			""
		),
		createdDateTime: isoDateWithoutTimeZone(x.createdDateTime + "Z"),
		benefit: (
			<HtmlTooltip title={x.benefit}>
				<p className="max-two-line">
					<Link
						onClick={() => history.push(`${feedbackPath}/${x.id}`)}
						style={{
							color: ColourConstants.commonText,
							cursor: "pointer",
							textDecoration: "none",
						}}
					>
						{x.benefit}
					</Link>
				</p>
			</HtmlTooltip>
		),
		changeRequired: (
			<HtmlTooltip title={x.changeRequired}>
				<p className="max-two-line">
					<Link
						onClick={() => history.push(`${feedbackPath}/${x.id}`)}
						style={{
							color: ColourConstants.commonText,
							cursor: "pointer",
							textDecoration: "none",
						}}
					>
						{x.changeRequired}
					</Link>
				</p>
			</HtmlTooltip>
		),
		feedbackStatusName: (
			<span
				style={{
					color: x?.feedbackStatusType === "C" ? ColourConstants.green : "",
				}}
			>
				{x?.feedbackStatusName}
			</span>
		),
	}));
};

const defaultCustomDate = { from: "", to: "" };

function FeedbackLists({
	statusFromMemory,
	departmentFromMemory,
	timeFrameFromMemory,
	myFeedbackFromMemory,
}) {
	// init hooks
	const dispatch = useDispatch();
	const classes = useStyles();
	const {
		allData,
		setAllData,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useUserSearch();

	// gets localstoarge || sessionStorage data
	const {
		customCaptions,
		siteAppID,
		siteID,
		site: { siteDepartmentID, siteDepartmentName },
		id,
		application,
		position: { id: positionId },
	} = getLocalStorageData("me");

	// init state
	const [currentTableSort, setCurrentTableSort] = useState(["", "asc"]);
	const [openAddFeedback, setOpenAddFeedback] = useState(false);
	const [countOFFeedback, setCountOfFeedback] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [siteDepartments, setSiteDepartments] = useState([]);
	const [feedbackStatus, setFeedbackStatus] = useState([]);
	const [selectedMyFeedback, setSelectedMyFeedback] = useState(true);
	const [selectedTimeframe, setSelectedTimeframe] = useState(
		timeFrameFromMemory === null ? defaultTimeframe : timeFrameFromMemory
	);

	const [customDate, setCustomDate] = useState(
		timeFrameFromMemory !== null && timeFrameFromMemory.id === 7
			? {
					from: MuiFormatDate(timeFrameFromMemory.fromDate),
					to: MuiFormatDate(timeFrameFromMemory.toDate),
			  }
			: defaultCustomDate
	);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(
		statusFromMemory === null
			? { id: "O", name: "Outstanding", statusType: "O" }
			: statusFromMemory
	);
	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);
	const [dataForFetchingFeedback, setDataForFetchingFeedback] = useState({
		pageNumber: 1,
		pageSize: DefaultPageSize,
		search: "",
		sortField: "",
		sort: "",
	});

	const searchRef = useRef("");

	// handling onChange for the 3 dropdowns
	const onDropdownChange = async (type, selectedItem) => {
		setSearching(true);
		// is a department dropdown and the selectedItem is different from the previously selected
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			sessionStorage.setItem(
				FEEDBACK_STORAGE_DEPARTMENT,
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);
			await fetchFeedbackList({
				search: searchRef.current,
				siteDepartmentID: selectedItem?.id,
				feedbackStatusID: selectedStatus.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				myFeedback: selectedMyFeedback,
				sortField: currentTableSort[0],
				sortOrder: currentTableSort[1],
			});
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem(
				FEEDBACK_STORAGE_STATUS,
				JSON.stringify(selectedItem)
			);
			setSelectedStatus(selectedItem);
			await fetchFeedbackList({
				search: searchRef.current,
				feedbackStatusID: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				myFeedback: selectedMyFeedback,
				sortField: currentTableSort[0],
				sortOrder: currentTableSort[1],
			});
		}
		// is a timeframe dropdown
		if (type === "timeframe") {
			// for Custom Range option open pop up

			if (selectedItem.id === 7) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);
				sessionStorage.setItem(
					FEEDBACK_STORAGE_TIMEFRAME,
					JSON.stringify(selectedItem)
				);
				await fetchFeedbackList({
					search: searchRef.current,
					siteDepartmentID: selectedDepartment?.id,
					feedbackStatusID: selectedStatus.id,
					fromDate: selectedItem.fromDate,
					toDate: selectedItem.toDate,
					myFeedback: selectedMyFeedback,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				});
			}
		}
		setSearching(false);
	};

	// handling Custom Date input change
	const handleCustomDateChange = (type, e) => {
		setCustomDate({ ...customDate, [type]: e.target.value });
	};

	// close Custom Date popup
	const handleCloseCustomDate = () => {
		setOpenCustomDatePopup(false);
		setCustomDateRangeError(defaultCustomDate);
	};

	// when the Custom Date popup is submitted
	const handleCustomDateSubmit = async (e) => {
		e.preventDefault();

		const isFromDateEmpty = customDate.from === "";
		const isToDateEmpty = customDate.to === "";
		// show error if date fields are empty
		if (isFromDateEmpty || isToDateEmpty) {
			setCustomDateRangeError({ from: isFromDateEmpty, to: isToDateEmpty });
			return;
		}

		setSearching(true);

		const formattedCustomDate = {
			fromDate: convertDateToUTC(
				new Date(
					customDate.from > customDate.to ? customDate.to : customDate.from
				)
			),
			toDate: convertDateToUTC(
				new Date(
					customDate.from > customDate.to ? customDate.from : customDate.to
				)
			),
		};

		// setting the custom date values to selectedTimeFrame state and checking if From date is greater than To date and managing accordingly
		setSelectedTimeframe({
			...selectedTimeframe,
			...formattedCustomDate,
			name: "Customized Date",
			id: 7,
		});
		sessionStorage.setItem(
			FEEDBACK_STORAGE_TIMEFRAME,
			JSON.stringify({
				...selectedTimeframe,
				...formattedCustomDate,
				name: "Customized Date",
				id: 7,
			})
		);

		await fetchFeedbackList({
			search: searchRef.current,
			siteDepartmentID: selectedDepartment?.id,
			feedbackStatusID: selectedStatus.id,
			fromDate: formattedCustomDate.fromDate,
			toDate: formattedCustomDate.toDate,
			myFeedback: selectedMyFeedback,
			sortField: currentTableSort[0],
			sortOrder: currentTableSort[1],
		});
		setSearching(false);

		handleCloseCustomDate();
	};

	// attemp to fetch feedback list
	const fetchFeedbackList = useCallback(
		async ({
			search = "",
			feedbackStatusID = "",
			siteDepartmentID = "",
			fromDate = "",
			toDate = "",
			myFeedback = true,
			sortField,
			sortOrder,
			shouldCount = true,
		}) => {
			try {
				const response = await Promise.all([
					getFeedbackList({
						feedbackStatusID: ["C", "O"].includes(feedbackStatusID)
							? ""
							: feedbackStatusID,
						statusType: ["C", "O"].includes(feedbackStatusID)
							? feedbackStatusID
							: "",
						siteAppId: siteAppID,
						search,
						siteDepartmentID,
						fromDate,
						toDate,
						myFeedback,
						sortField,
						sortOrder,
					}),
					shouldCount &&
						getCountOfFeedbackList({
							feedbackStatusID: ["C", "O"].includes(feedbackStatusID)
								? ""
								: feedbackStatusID,
							statusType: ["C", "O"].includes(feedbackStatusID)
								? feedbackStatusID
								: "",
							siteAppId: siteAppID,
							search,
							siteDepartmentID,
							fromDate,
							toDate,
							myFeedback,
						}),
				]);
				if (response[0].status) {
					setAllData(response[0].data);
					response[1].status && setCountOfFeedback(response[1].data);
					setDataForFetchingFeedback((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(
							response?.data?.detail ||
								`Failed to fetch ${customCaptions?.feedback} list`
						)
					);
				}
			} catch (error) {
				dispatch(
					showError(
						error?.response?.detail ||
							`Failed to fetch ${customCaptions?.feedback} list`
					)
				);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			siteAppID,
			dispatch,
			setAllData,
			searchRef.current,
			// eslint-disable-next-line react-hooks/exhaustive-deps
			selectedDepartment?.id,
			// eslint-disable-next-line react-hooks/exhaustive-deps
			selectedStatus?.id,
			selectedTimeframe.fromDate,
			selectedTimeframe.toDate,
			dataForFetchingFeedback.pageNumber,
			selectedMyFeedback,
		]
	);

	// calling feedback list api after mounting
	useEffect(() => {
		const fetchData = async () => {
			const [, response2, response3] = await Promise.all([
				fetchFeedbackList({
					search: "",
					siteDepartmentID: selectedDepartment?.id,
					feedbackStatusID: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
					myFeedback: selectedMyFeedback,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				}),
				getSiteDepartmentsInService(siteID),
				getFeedbackStatuses(siteAppID),
			]);
			if (response2.status) {
				setSiteDepartments([{ id: "", name: "Show All" }, ...response2.data]);
			}
			if (response3.status) {
				setFeedbackStatus([
					{ id: "", name: "Show All" },
					...response3.data.map((x) => {
						if (x.type === "C") return { ...x, groupBy: "Complete" };
						return { ...x, groupBy: "Outstanding" };
					}),
				]);
			}
			setLoading(false);
		};
		fetchData();
		document.body.style.overflowX = "hidden";
		document.body.style.maxWidth = "100%";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteID]);

	// searching for feedback
	const handleSearch = useCallback(
		debounce(
			async (
				value,
				department,
				feedbackStatusID,
				fromDate,
				toDate,
				myFeedback,
				sortField,
				sortOrder
			) => {
				setSearching(true);
				searchRef.current = value;
				await fetchFeedbackList({
					search: value,
					siteDepartmentID: department,
					feedbackStatusID: feedbackStatusID,
					fromDate: fromDate,
					toDate: toDate,
					myFeedback: myFeedback,
					sortField,
					sortOrder,
				});
				if (!value || value === "")
					setDataForFetchingFeedback({
						pageNumber: 1,
						pageSize: DefaultPageSize,
						search: "",
						sortField: "",
						sort: "",
					});
				setSearching(false);
			},
			500
		),
		[]
	);

	// calling add new feedback api
	const addNewFeedback = async (payload) => {
		return await postNewFeedback(payload);
	};

	//Filter by Timeframe dropdown options
	const timeframeOptions = (customCaptions) => {
		return filterByDateOptions(new Date(), customCaptions).filter(
			(x) => x.id !== 6
		);
	};

	// opens DELETE feedback  popup
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	// remove feedback from client table list after successfull deletion of feedback
	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
		setCountOfFeedback((prev) => prev - 1);
	};

	const mainData = searchQuery.length === 0 ? allData : allData;

	if (loading) return <CircularProgress />;

	return (
		<>
			<TabTitle title={`${customCaptions.feedback} | ${application.name}`} />
			{isSearching && <LinearProgress className={classes.loading} />}

			<DeleteDialog
				entityName={customCaptions?.feedback}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={"/api/feedback"}
				handleRemoveData={handleRemoveData}
			/>
			<AddNewFeedbackDetail
				open={openAddFeedback}
				closeHandler={() => setOpenAddFeedback(false)}
				siteAppId={siteAppID}
				title={"Add " + customCaptions?.feedback}
				createProcessHandler={addNewFeedback}
				customCaptions={customCaptions}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchFeedbackList({
						search: "",
						feedbackStatusID: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
						myFeedback: selectedMyFeedback,
						sortField: currentTableSort[0],
						sortOrder: currentTableSort[1],
					})
				}
				setDataForFetchingFeedback={setDataForFetchingFeedback}
				siteID={siteID}
			/>
			<CustomDateRange
				open={openCustomDatePopup}
				handleChange={handleCustomDateChange}
				customDate={customDate}
				closeHandler={handleCloseCustomDate}
				onSubmit={handleCustomDateSubmit}
				isError={isCustomDateRangeError}
				isLoading={isSearching}
			/>
			<div className="container">
				<Header
					setOpenAddFeedback={setOpenAddFeedback}
					dataLength={countOFFeedback}
					feedbackCC={customCaptions?.feedbackPlural}
				/>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`View all ${customCaptions?.feedbackPlural} across your operations`}
					/>
					<SearchField
						searchQuery={dataForFetchingFeedback?.search}
						setSearchQuery={(e) => {
							e.persist();
							setDataForFetchingFeedback((prev) => ({
								...prev,
								search: e.target.value,
							}));
							handleSearch(
								e.target.value,
								selectedDepartment.id,
								selectedStatus.id,
								selectedTimeframe.fromDate,
								selectedTimeframe.toDate,
								selectedMyFeedback,
								currentTableSort[0],
								currentTableSort[1]
							);
						}}
					/>
				</div>
				<Grid container alignItems={"center"}>
					<EMICheckbox
						state={selectedMyFeedback}
						changeHandler={async ({ target: { checked } }) => {
							setSearching(true);
							setSelectedMyFeedback((th) => checked);
							await fetchFeedbackList({
								search: searchRef.current,
								siteDepartmentID: selectedDepartment?.id,
								feedbackStatusID: selectedStatus.id,
								fromDate: selectedTimeframe.fromDate,
								toDate: selectedTimeframe.toDate,
								myFeedback: checked,
								sortField: currentTableSort[0],
								sortOrder: currentTableSort[1],
							});
							sessionStorage.setItem(
								FEEDBACK_STORAGE_MY_FEEDBACK,
								JSON.stringify(checked)
							);
							setSearching(false);
						}}
					/>
					<label> My {customCaptions.feedback}</label>
				</Grid>
				<div style={{ height: 10 }}></div>
				<Grid container spacing={2}>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={feedbackStatus}
							groupBy={[
								{ id: "", name: "Show All", statusType: "" },
								{ id: "C", name: "Complete", statusType: "C" },
								{ id: "O", name: "Outstanding", statusType: "O" },
							]}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							width="100%"
							placeholder={`Select Status`}
							onChange={(item) => onDropdownChange("status", item)}
							selectdValueToshow="name"
							selectedValue={selectedStatus}
							label={`Filter by Status`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
							hasGroup
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={timeframeOptions(customCaptions)}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							width="100%"
							placeholder={`Select Timeframe`}
							onChange={(list) => onDropdownChange("timeframe", list)}
							selectdValueToshow="name"
							selectedValue={{
								...selectedTimeframe,
								name:
									selectedTimeframe.id === 7
										? selectedTimeframe.fromDate
											? changeDate(selectedTimeframe.fromDate) +
											  " - " +
											  changeDate(selectedTimeframe.toDate)
											: selectedTimeframe.name
										: selectedTimeframe.name,
							}}
							label={`Filter by Timeframe`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={siteDepartments}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							placeholder={`Select Department`}
							width="100%"
							onChange={(item) => onDropdownChange("department", item)}
							selectdValueToshow="name"
							selectedValue={selectedDepartment}
							label={`Filter by ${customCaptions.department}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
				<div style={{ height: 20 }}></div>
				<div className="dynamic-width-table">
					<FeedbackListTable
						data={mainData}
						headers={FeedbackTableHeader(customCaptions)}
						columns={FeedbackTableColumns()}
						setData={setAllData}
						handleSort={async (sortField, sort) => {
							setSearching(true);
							await fetchFeedbackList({
								search: searchRef.current,
								siteDepartmentID: selectedDepartment?.id,
								feedbackStatusID: selectedStatus.id,
								fromDate: selectedTimeframe.fromDate,
								toDate: selectedTimeframe.toDate,
								myFeedback: selectedMyFeedback,
								sortField: sortField,
								sortOrder: sort,
								shouldCount: false,
							});
							setSearching(false);
						}}
						searchQuery={searchRef.current}
						formattedData={formattedData}
						searchedData={searchedData}
						setSearchData={setSearchData}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						searchText={searchRef.current}
						page={dataForFetchingFeedback.pageNumber}
						countOFFeedback={countOFFeedback}
						department={selectedDepartment.id}
						status={selectedStatus.id}
						date={{
							fromDate: selectedTimeframe.fromDate,
							toDate: selectedTimeframe.toDate,
						}}
						setDataForFetchingFeedback={setDataForFetchingFeedback}
						siteAppID={siteAppID}
						myFeedback={selectedMyFeedback}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						userId={id}
						positionId={positionId}
					/>
				</div>
			</div>
		</>
	);
}

export default FeedbackLists;
