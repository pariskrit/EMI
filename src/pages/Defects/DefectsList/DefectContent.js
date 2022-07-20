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
import AddNewDefectDetail from "./AddDefects";
import Header from "./Header";
import FilterListIcon from "@material-ui/icons/FilterList";
import { makeStyles } from "@material-ui/core/styles";
import SafteryCritical from "assets/icons/safety-critical.svg";
import DefectListTable from "./DefectsListTable";
import {
	defaultTimeframe,
	filterByDateOptions,
} from "constants/serviceDetails";

import { defectsPath } from "helpers/routePaths";
import {
	DefaultPageSize,
	DEFECTS_STORAGE_DEPARTMENT,
	DEFECTS_STORAGE_STATUS,
	DEFECTS_STORAGE_TIMEFRAME,
} from "helpers/constants";
import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import { changeDate } from "helpers/date";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import {
	getCountOfDefectsList,
	getDefectsList,
	postNewDefect,
} from "services/defects/defectsList";
import { DefectTableColumns, DefectTableHeader } from "constants/DefectDetails";

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

const formattedData = (data, history) => {
	return data.map((x) => ({
		...x,
		modelName: x.modelModel ? x.modelName + " " + x.modelModel : x.modelName,
		taskName: x?.actionName ? x?.actionName + " " + x?.taskName : x?.taskName,
		defectStatusName: (
			<span
				style={{
					color: x?.defectStatusType === "C" ? ColourConstants.green : "",
				}}
			>
				{x?.defectStatusName}
			</span>
		),
		riskRatingName: (
			<span
				style={{
					color: x?.safetyCritical === true ? ColourConstants.red : "",
				}}
			>
				{x?.riskRatingName}
			</span>
		),
		number: (
			<Link
				onClick={() => history.push(`${defectsPath}/${x.id}`)}
				style={{ color: ColourConstants.activeLink, cursor: "pointer" }}
			>
				{x.number}
			</Link>
		),
		safetyCritical:
			x.safetyCritical === true ? (
				<img src={SafteryCritical} alt="saftey critical" />
			) : (
				""
			),

		createdDateTime: isoDateWithoutTimeZone(x.createdDateTime + "Z"),
		details: (
			<HtmlTooltip title={x.details}>
				<p className="max-two-line">
					<Link
						onClick={() => history.push(`${defectsPath}/${x.id}`)}
						style={{
							color: ColourConstants.commonText,
							cursor: "pointer",
							textDecoration: "none",
						}}
					>
						{x.details}
					</Link>
				</p>
			</HtmlTooltip>
		),
	}));
};

const defaultCustomDate = { from: "", to: "" };

function DefectsLists({
	statusFromMemory,
	departmentFromMemory,
	timeFrameFromMemory,
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
	} = getLocalStorageData("me");

	// init state
	const [currentTableSort, setCurrentTableSort] = useState(["", "asc"]);
	const [openAddDefect, setOpenAddDefect] = useState(false);
	const [countOFDefects, setCountOfDefect] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [siteDepartments, setSiteDepartments] = useState([]);
	const [defectsStatus, setDefectsStatus] = useState([]);
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
			? { id: "O", name: "All Outstanding", statusType: "O" }
			: statusFromMemory
	);
	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);
	const [dataForFetchingDefect, setDataForFetchingDefect] = useState({
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
				DEFECTS_STORAGE_DEPARTMENT,
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);
			await fetchDefectList({
				search: searchRef.current,
				siteDepartmentID: selectedItem?.id,
				defectStatusID: selectedStatus.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				sortField: currentTableSort[0],
				sortOrder: currentTableSort[1],
			});
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem(
				DEFECTS_STORAGE_STATUS,
				JSON.stringify(selectedItem)
			);
			setSelectedStatus(selectedItem);
			await fetchDefectList({
				search: searchRef.current,
				defectStatusID: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
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
					DEFECTS_STORAGE_TIMEFRAME,
					JSON.stringify(selectedItem)
				);
				await fetchDefectList({
					search: searchRef.current,
					siteDepartmentID: selectedDepartment?.id,
					defectStatusID: selectedStatus.id,
					fromDate: selectedItem.fromDate,
					toDate: selectedItem.toDate,
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
			DEFECTS_STORAGE_TIMEFRAME,
			JSON.stringify({
				...selectedTimeframe,
				...formattedCustomDate,
				name: "Customized Date",
				id: 7,
			})
		);

		await fetchDefectList({
			search: searchRef.current,
			siteDepartmentID: selectedDepartment?.id,
			defectStatusID: selectedStatus.id,
			fromDate: formattedCustomDate.fromDate,
			toDate: formattedCustomDate.toDate,
			sortField: currentTableSort[0],
			sortOrder: currentTableSort[1],
		});
		setSearching(false);

		handleCloseCustomDate();
	};

	// attemp to fetch defects list
	const fetchDefectList = useCallback(
		async ({
			search = "",
			defectStatusID = "",
			siteDepartmentID = "",
			fromDate = "",
			toDate = "",
			sortField = "",
			sortOrder = "",
			shouldCount = true,
		}) => {
			try {
				const response = await Promise.all([
					getDefectsList({
						defectStatusType: ["C", "N", "O"].includes(defectStatusID)
							? defectStatusID
							: "",
						defectStatusID: ["C", "N", "O"].includes(defectStatusID)
							? ""
							: defectStatusID,
						siteAppId: siteAppID,
						search,
						siteDepartmentID,
						fromDate,
						toDate,
						sortField,
						sortOrder,
					}),
					shouldCount &&
						getCountOfDefectsList({
							defectStatusType: ["C", "N", "O"].includes(defectStatusID)
								? defectStatusID
								: "",
							defectStatusID: ["C", "N", "O"].includes(defectStatusID)
								? ""
								: defectStatusID,
							siteAppId: siteAppID,
							search,
							siteDepartmentID,
							fromDate,
							toDate,
						}),
				]);
				if (response[0].status) {
					setAllData(response[0].data);
					response[1].status && setCountOfDefect(response[1].data);
					setDataForFetchingDefect((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(
							response?.data?.detail ||
								`Failed to fetch ${customCaptions?.defect} list`
						)
					);
				}
			} catch (error) {
				dispatch(
					showError(
						error?.response?.detail ||
							`Failed to fetch ${customCaptions?.defect} list`
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
			dataForFetchingDefect.pageNumber,
		]
	);

	// calling defect list api after mounting
	useEffect(() => {
		const fetchData = async () => {
			const [, response2, response3] = await Promise.all([
				fetchDefectList({
					search: "",
					siteDepartmentID: selectedDepartment?.id,
					defectStatusID: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				}),
				getSiteDepartmentsInService(siteID),
				getDefectStatuses(siteAppID),
			]);
			if (response2.status) {
				setSiteDepartments([{ id: "", name: "Show All" }, ...response2.data]);
			}
			if (response3.status) {
				setDefectsStatus([
					{ id: "", name: "Show All" },
					...response3.data.map((x) => {
						if (x.type === "C") return { ...x, groupBy: "All Complete" };
						else if (x.type === "N")
							return { ...x, groupBy: "All Notification Raised" };
						return { ...x, groupBy: "All Outstanding" };
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

	// searching for services
	const handleSearch = useCallback(
		debounce(
			async (
				value,
				department,
				defectStatusID,
				fromDate,
				toDate,
				sortField,
				sortOrder
			) => {
				setSearching(true);
				searchRef.current = value;
				await fetchDefectList({
					search: value,
					siteDepartmentID: department,
					defectStatusID: defectStatusID,
					fromDate: fromDate,
					toDate: toDate,
					sortField,
					sortOrder,
				});
				if (!value || value === "")
					setDataForFetchingDefect({
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

	// calling add new defect api
	const addNewDefect = async (payload) => {
		return await postNewDefect(payload);
	};

	//Filter by Timeframe dropdown options
	const timeframeOptions = (customCaptions) => {
		return filterByDateOptions(new Date(), customCaptions);
	};

	// opens DELETE defect  popup
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	// remove defect from client table list after successfull deletion of defect
	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
		setCountOfDefect((prev) => prev - 1);
	};

	const mainData = searchQuery.length === 0 ? allData : allData;

	if (loading) return <CircularProgress />;

	return (
		<>
			{isSearching && <LinearProgress className={classes.loading} />}

			<DeleteDialog
				entityName={customCaptions?.defect}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={"/api/defects"}
				handleRemoveData={handleRemoveData}
			/>
			<AddNewDefectDetail
				open={openAddDefect}
				closeHandler={() => setOpenAddDefect(false)}
				siteAppId={siteAppID}
				siteId={siteID}
				title={"Add " + customCaptions?.defect}
				createProcessHandler={addNewDefect}
				customCaptions={customCaptions}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchDefectList({
						search: "",
						defectStatusID: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
						sortField: currentTableSort[0],
						sortOrder: currentTableSort[1],
					})
				}
				setDataForFetchingDefect={setDataForFetchingDefect}
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
					setOpenAddDefect={setOpenAddDefect}
					dataLength={countOFDefects}
					defectsCC={customCaptions?.defectPlural}
				/>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`View all ${customCaptions?.defectPlural} across your operations`}
					/>
					<SearchField
						searchQuery={dataForFetchingDefect?.search}
						setSearchQuery={(e) => {
							e.persist();
							setDataForFetchingDefect((prev) => ({
								...prev,
								search: e.target.value,
							}));
							handleSearch(
								e.target.value,
								selectedDepartment.id,
								selectedStatus.id,
								selectedTimeframe.fromDate,
								selectedTimeframe.toDate,
								currentTableSort[0],
								currentTableSort[1]
							);
						}}
					/>
				</div>

				<Grid container spacing={2}>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={defectsStatus}
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
							groupBy={[
								{ id: "", name: "Show All", statusType: "" },
								{ id: "C", name: "All Complete", statusType: "C" },
								{ id: "O", name: "All Outstanding", statusType: "O" },
							]}
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
					<DefectListTable
						data={mainData}
						headers={DefectTableHeader(customCaptions)}
						columns={DefectTableColumns()}
						setData={setAllData}
						handleSort={async (sortField, sortOrder) => {
							setSearching(true);
							await fetchDefectList({
								search: searchRef.current,
								siteDepartmentID: selectedDepartment?.id,
								defectStatusID: selectedStatus.id,
								fromDate: selectedTimeframe.fromDate,
								toDate: selectedTimeframe.toDate,
								sortField: sortField,
								sortOrder: sortOrder,
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
						page={dataForFetchingDefect.pageNumber}
						countOFDefects={countOFDefects}
						department={selectedDepartment.id}
						status={selectedStatus.id}
						date={{
							fromDate: selectedTimeframe.fromDate,
							toDate: selectedTimeframe.toDate,
						}}
						setDataForFetchingDefect={setDataForFetchingDefect}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						siteAppID={siteAppID}
					/>
				</div>
			</div>
		</>
	);
}

export default DefectsLists;
