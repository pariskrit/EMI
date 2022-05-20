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
} from "helpers/utils";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useRef,
} from "react";
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
import { DefaultPageSize, statusOptions } from "helpers/constants";
import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import StatusChangePopup from "./StatusChangePopup";

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
				<Icon
					name={statusOfServices(x.status, x.tasksSkipped)}
					fontSize={"22px"}
				/>
				{statusOfServices(x.status, x.tasksSkipped)}
			</span>
		),
		percentageComplete: (
			<span style={{ width: "100%" }}>
				<ProgressBar
					value={
						x.percentageComplete === 100 ? "Complete" : x?.percentageComplete
					}
					height="30px"
					width="200px"
					bgColour={
						x?.percentageOverTime <= 5
							? "#23BB79"
							: x?.percentageOverTime > 5 && x?.percentageOverTime <= 10
							? "#ED8738"
							: "#E31212"
					}
					baseBgColor="#fafafa"
					labelAlignment="left"
					labelColor={x.percentageComplete === 0 ? "#000000" : "#fff"}
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
		checkoutDate: x.checkoutDate
			? isoDateWithoutTimeZone(x.checkoutDate + "Z")
			: "",
	}));
};

const defaultCustomDate = { from: "", to: "" };

function ServiceLists() {
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
	const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
	const [customDate, setCustomDate] = useState(defaultCustomDate);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(showAllInDropDown);
	const [selectedDepartment, setSelectedDepartment] = useState(
		showAllInDropDown
	);
	const [dataForFetchingService, setDataForFetchingService] = useState({
		pageNumber: 1,
		pageSize: DefaultPageSize,
		search: "",
		sortField: "",
		sort: "",
	});

	const searchRef = useRef("");

	// gets localstoarge || sessionStorage data
	const {
		customCaptions,
		siteAppID,
		siteID,
		application: { allowIndividualAssetModels },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// handling onChange for the 3 dropdowns
	const onDropdownChange = async (type, selectedItem) => {
		setSearching(true);
		// is a department dropdown and the selectedItem is different from the previously selected
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
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
			setSelectedTimeframe(selectedItem);
			if (selectedItem.id === 7) {
				setOpenCustomDatePopup(true);
			} else {
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
		setCustomDate(defaultCustomDate);
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
			from: convertDateToUTC(
				new Date(
					customDate.from > customDate.to ? customDate.to : customDate.from
				)
			),
			to: convertDateToUTC(
				new Date(
					customDate.from > customDate.to ? customDate.from : customDate.to
				)
			),
		};

		// setting the custom date values to selectedTimeFrame state and checking if From date is greater than To date and managing accordingly
		setSelectedTimeframe({
			...selectedTimeframe,
			...formattedCustomDate,
		});
		await fetchServiceList({
			search: searchRef.current,
			siteDepartmentID: selectedDepartment?.id,
			status: selectedStatus.id,
			fromDate: formattedCustomDate.from,
			toDate: formattedCustomDate.to,
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
						siteAppId: siteAppID,
						search,
						status,
						siteDepartmentID,
						fromDate,
						toDate,
					}),
					getCountOfServiceList({
						siteAppId: siteAppID,
						search,
						status,
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
					siteDepartmentID: "",
					status: "",
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
	const timeframeOptions = useMemo(() => {
		return filterByDateOptions(new Date());
	}, []);

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
						search: searchRef.current,
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
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
						search: searchRef.current,
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
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
						setSearchQuery={(e) => {
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

				<Grid container spacing={10}>
					<Grid item lg={4}>
						<DyanamicDropdown
							dataSource={statusOptions}
							groupBy={[
								{ id: 1, name: "Complete" },
								{ id: 2, name: "Not Complete" },
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
					<Grid item lg={4}>
						<DyanamicDropdown
							dataSource={timeframeOptions}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							width="100%"
							placeholder={`Select Timeframe`}
							onChange={(list) => onDropdownChange("timeframe", list)}
							selectdValueToshow="name"
							selectedValue={selectedTimeframe}
							label={`Filter by Timeframe`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={4}>
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
							label={`Filter by Department`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
				<div style={{ height: 20 }}></div>
				<ServiceListTable
					data={mainData}
					headers={serviceTableHeader(allowIndividualAssetModels)}
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
		</>
	);
}

export default ServiceLists;
