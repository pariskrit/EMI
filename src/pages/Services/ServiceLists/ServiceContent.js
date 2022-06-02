import {
	CircularProgress,
	Grid,
	LinearProgress,
	Link,
} from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import {
	handleSort,
	isoDateWithoutTimeZone,
	convertDateToUTC,
	debounce,
	roundedToFixed,
	MuiFormatDate,
} from "helpers/utils";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	getCountOfServiceList,
	getServicesList,
	getSiteDepartmentsInService,
	postNewService,
} from "services/services/serviceLists";
import AddNewServiceDetail from "./AddService";
import ImportCSVFile from "./CSVImport";
import Header from "./Header";
import FilterListIcon from "@material-ui/icons/FilterList";
import { makeStyles } from "@material-ui/core/styles";
import ServiceListTable from "./ServiceListTable";
import {
	defaultTimeframe,
	filterByDateOptions,
	serviceTableColumns,
	serviceTableHeader,
	showAllInDropDown,
	statusOfServices,
} from "constants/serviceDetails";
import Icon from "components/Elements/Icon";
import ProgressBar from "components/Elements/ProgressBar";
import { servicesPath } from "helpers/routePaths";
import {
	DefaultPageSize,
	statusOptions,
	statusTypeClassification,
} from "helpers/constants";
import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import StatusChangePopup from "./StatusChangePopup";
import { changeDate } from "helpers/date";

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
		workOrder: (
			<Link
				onClick={() => history.push(`${servicesPath}/${x.id}`)}
				style={{ color: ColourConstants.activeLink, cursor: "pointer" }}
			>
				{x.workOrder}
			</Link>
		),

		status: (
			<span
				style={{
					display: "inline-flex",
					gap: 5,
				}}
			>
				<Icon name={statusOfServices(x.status, x.tasksSkipped)} />
				{statusOfServices(x.status, x.tasksSkipped)}
			</span>
		),
		percentageComplete: (
			<span style={{ width: "100%" }}>
				<ProgressBar
					value={roundedToFixed(x?.percentageComplete, 0)}
					customLabel={x?.percentageComplete === 100 ? "Complete" : undefined}
					height="30px"
					width={
						x.percentageComplete === 0 || x.percentageComplete > 20
							? "200px"
							: "50px"
					}
					bgColour={
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212"
					}
					baseBgColor="#fafafa"
					labelAlignment={
						x.percentageComplete !== 0 && x.percentageComplete < 20
							? "outside"
							: "left"
					}
					labelColor={
						x.percentageComplete === 0
							? "#000000"
							: x.percentageComplete > 20
							? "#fff"
							: x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212"
					}
					borderRadius="20px"
				/>
			</span>
		),
		percentageOverTime: (
			<span
				style={{
					color:
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212",
				}}
			>
				{x?.percentageOverTime !== null ? `${x?.percentageOverTime}%` : ""}
			</span>
		),
		minutesOverTime: (
			<span
				style={{
					color:
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212",
				}}
			>
				{x?.minutesOverTime !== null ? `${x?.minutesOverTime}` : ""}
			</span>
		),

		scheduledDate: isoDateWithoutTimeZone(x.scheduledDate + "Z"),
		estimatedMinutes: roundedToFixed(x.estimatedMinutes, 1),
		checkoutDate: x.checkoutDate
			? isoDateWithoutTimeZone(x.checkoutDate + "Z")
			: "",
	}));
};

const defaultCustomDate = { from: "", to: "" };

function ServiceLists({
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
		application: { allowIndividualAssetModels },
		site: { siteDepartmentID, siteDepartmentName },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// init state
	const [openAddService, setOpenAddService] = useState(false);
	const [countOFService, setCountOfService] = useState(0);
	const [openImportCSV, setImportCSV] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openChnageStatusPopup, setOpenChnageStatusPopup] = useState(false);
	const [siteDepartments, setSiteDepartments] = useState([]);
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
		statusFromMemory === null ? showAllInDropDown : statusFromMemory
	);
	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);
	const [dataForFetchingService, setDataForFetchingService] = useState({
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
				"service-department",
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);
			await fetchServiceList({
				search: searchRef.current,
				siteDepartmentID: selectedItem?.id,
				status: selectedStatus.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
			});
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem("service-status", JSON.stringify(selectedItem));
			setSelectedStatus(selectedItem);
			await fetchServiceList({
				search: searchRef.current,
				status: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
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
					"service-timeFrame",
					JSON.stringify(selectedItem)
				);
				await fetchServiceList({
					search: searchRef.current,
					siteDepartmentID: selectedDepartment?.id,
					status: selectedStatus.id,
					fromDate: selectedItem.fromDate,
					toDate: selectedItem.toDate,
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
			"service-timeFrame",
			JSON.stringify({
				...selectedTimeframe,
				...formattedCustomDate,
				name: "Customized Date",
				id: 7,
			})
		);

		await fetchServiceList({
			search: searchRef.current,
			siteDepartmentID: selectedDepartment?.id,
			status: selectedStatus.id,
			fromDate: formattedCustomDate.fromDate,
			toDate: formattedCustomDate.toDate,
		});
		setSearching(false);

		handleCloseCustomDate();
	};

	// attemp to fetch service list
	const fetchServiceList = useCallback(
		async ({
			search = "",
			status = "",
			siteDepartmentID = "",
			fromDate = "",
			toDate = "",
		}) => {
			try {
				const response = await Promise.all([
					getServicesList({
						statusType:
							status === 2 || status === 1
								? statusTypeClassification[status]
								: "",
						status: status === 2 || status === 1 ? "" : status,
						siteAppId: siteAppID,
						search,
						siteDepartmentID,
						fromDate,
						toDate,
					}),
					getCountOfServiceList({
						statusType:
							status === 2 || status === 1
								? statusTypeClassification[status]
								: "",
						status: status === 2 || status === 1 ? "" : status,
						siteAppId: siteAppID,
						search,
						siteDepartmentID,
						fromDate,
						toDate,
					}),
				]);
				if (response[0].status) {
					setAllData(response[0].data);
					setCountOfService(response[1].data);
					setDataForFetchingService((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(response?.data?.detail || "Failed to fetch service list")
					);
				}
			} catch (error) {
				dispatch(
					showError(error?.response?.detail || "Failed to fetch service list")
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
			dataForFetchingService.pageNumber,
		]
	);

	// calling service list api after mounting
	useEffect(() => {
		const fetchData = async () => {
			const [, response2] = await Promise.all([
				fetchServiceList({
					search: "",
					siteDepartmentID: selectedDepartment?.id,
					status: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
				}),
				getSiteDepartmentsInService(siteID),
			]);
			if (response2.status) {
				setSiteDepartments([{ id: "", name: "Show All" }, ...response2.data]);
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
		debounce(async (value, department, status, fromDate, toDate) => {
			setSearching(true);
			searchRef.current = value;
			await fetchServiceList({
				search: value,
				siteDepartmentID: department,
				status: status,
				fromDate: fromDate,
				toDate: toDate,
			});
			if (!value || value === "")
				setDataForFetchingService({
					pageNumber: 1,
					pageSize: DefaultPageSize,
					search: "",
					sortField: "",
					sort: "",
				});
			setSearching(false);
		}, 500),
		[]
	);

	// calling add new service api
	const addNewService = async (payload) => {
		return await postNewService(payload);
	};

	//Filter by Timeframe dropdown options
	const timeframeOptions = (customCaptions) => {
		return filterByDateOptions(new Date(), customCaptions);
	};

	// opens DELETE service  popup
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	// opens change status popup
	const handleChangeStatus = (id, name, changeTostatus) => {
		setDeleteID({ id, name, changeTostatus });
		setOpenChnageStatusPopup(true);
	};

	// remove serivce from client table list after successfull deletion of service
	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
		setCountOfService((prev) => prev - 1);
	};

	const mainData = searchQuery.length === 0 ? allData : allData;

	if (loading) return <CircularProgress />;

	return (
		<>
			{isSearching && <LinearProgress className={classes.loading} />}
			<StatusChangePopup
				open={openChnageStatusPopup}
				title={`Change Status to ${deleteID?.name}`}
				onClose={() => setOpenChnageStatusPopup(false)}
				siteAppID={siteAppID}
				fetchData={() =>
					fetchServiceList({
						search: searchRef.current,
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
					})
				}
				setDataForFetchingService={setDataForFetchingService}
				serviceId={deleteID}
			/>

			<DeleteDialog
				entityName="Service"
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={"/api/services"}
				handleRemoveData={handleRemoveData}
			/>
			<ImportCSVFile
				open={openImportCSV}
				handleClose={() => {
					setImportCSV(false);
				}}
				importSuccess={async () => {
					await fetchServiceList({
						search: "",
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
					});
					setDataForFetchingService({
						pageNumber: 1,
						pageSize: DefaultPageSize,
						search: "",
						sortField: "",
						sort: "",
					});
				}}
				siteAppID={siteAppID}
			/>
			<AddNewServiceDetail
				open={openAddService}
				closeHandler={() => setOpenAddService(false)}
				siteAppId={siteAppID}
				title={"Add " + customCaptions?.service}
				createProcessHandler={addNewService}
				customCaptions={customCaptions}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchServiceList({
						search: "",
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
					})
				}
				setDataForFetchingService={setDataForFetchingService}
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
					setOpenAddService={setOpenAddService}
					setImportCSV={setImportCSV}
					dataLength={countOFService}
				/>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`View all ${customCaptions?.servicePlural} across your operations`}
					/>
					<SearchField
						searchQuery={dataForFetchingService?.search}
						setSearchQuery={(e) => {
							setDataForFetchingService((prev) => ({
								...prev,
								search: e.target.value,
							}));
							handleSearch(
								e.target.value,
								selectedDepartment.id,
								selectedStatus.id,
								selectedTimeframe.fromDate,
								selectedTimeframe.toDate
							);
						}}
					/>
				</div>

				<Grid container spacing={2}>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={statusOptions}
							groupBy={[
								{ id: "", name: "Show All", statusType: "" },
								{ id: 1, name: "Complete", statusType: "C" },
								{ id: 2, name: "Not Complete", statusType: "O" },
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
					<ServiceListTable
						data={mainData}
						headers={serviceTableHeader(
							allowIndividualAssetModels,
							customCaptions
						)}
						columns={serviceTableColumns(allowIndividualAssetModels)}
						setData={setAllData}
						handleSort={handleSort}
						searchQuery={searchRef.current}
						formattedData={formattedData}
						searchedData={searchedData}
						setSearchData={setSearchData}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						handleChnageStatus={handleChangeStatus}
						searchText={searchRef.current}
						page={dataForFetchingService.pageNumber}
						countOFService={countOFService}
						department={selectedDepartment.id}
						status={selectedStatus.id}
						date={{
							fromDate: selectedTimeframe.fromDate,
							toDate: selectedTimeframe.toDate,
						}}
						setDataForFetchingService={setDataForFetchingService}
						siteAppID={siteAppID}
					/>
				</div>
			</div>
		</>
	);
}

export default ServiceLists;
