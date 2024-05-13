import { CircularProgress, Grid, LinearProgress } from "@mui/material";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import { Link } from "react-router-dom";

import {
	isoDateWithoutTimeZone,
	convertDateToUTC,
	debounce,
	roundedToFixed,
	MuiFormatDate,
	defaultPageSize,
	customFromattedDate,
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
import FilterListIcon from "@mui/icons-material/FilterList";
import { makeStyles } from "tss-react/mui";
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
	SERVICE_STORAGE_DEPARTMENT,
	SERVICE_STORAGE_STATUS,
	SERVICE_STORAGE_TIMEFRAME,
	statusOptions,
	statusTypeClassification,
} from "helpers/constants";
import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import StatusChangePopup from "./StatusChangePopup";
import { changeDate } from "helpers/date";
import MultipleChangeStatusPopup from "./MultipleChangeStatusPopup";
import TabTitle from "components/Elements/TabTitle";
import mainAccess from "helpers/access";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
}));

const formattedData = (data, history) => {
	return data.map((x) => ({
		...x,
		workOrder: (
			<Link
				to={`${x.id}`}
				style={{
					color: ColourConstants.activeLink,
					cursor: "pointer",
					textDecoration: "none",
				}}
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
							? "125px"
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
	const { classes, cx } = useStyles();
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
		position,
		customCaptions,
		siteAppID,
		siteID,
		application: {
			allowIndividualAssetModels,
			name,
			showArrangements,
			allowRegisterAssetsForServices,
		},
		site: { siteDepartmentID, siteDepartmentName, showServiceClientName },
	} = JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

	// init state
	const [currentTableSort, setCurrentTableSort] = useState([
		"scheduledDate",
		"asc",
	]);

	const [openAddService, setOpenAddService] = useState(false);
	const [countOFService, setCountOfService] = useState(0);
	const [openImportCSV, setImportCSV] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedServices, setSelectedServices] = useState([]);
	const [openChnageStatusPopup, setOpenChnageStatusPopup] = useState(false);
	const [openMultipleChnageStatusPopup, setOpenMultipleChnageStatusPopup] =
		useState(false);
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
		pageSize: defaultPageSize(),
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
				SERVICE_STORAGE_DEPARTMENT,
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);
			await fetchServiceList({
				search: searchRef.current,
				siteDepartmentID: selectedItem?.id,
				status: selectedStatus.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				sortField: currentTableSort[0],
				sort: currentTableSort[1],
			});
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem(
				SERVICE_STORAGE_STATUS,
				JSON.stringify(selectedItem)
			);
			setSelectedStatus(selectedItem);
			await fetchServiceList({
				search: searchRef.current,
				status: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				fromDate: selectedTimeframe?.fromDate,
				toDate: selectedTimeframe?.toDate,
				sortField: currentTableSort[0],
				sort: currentTableSort[1],
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
					SERVICE_STORAGE_TIMEFRAME,
					JSON.stringify(selectedItem)
				);
				await fetchServiceList({
					search: searchRef.current,
					siteDepartmentID: selectedDepartment?.id,
					status: selectedStatus?.id,
					fromDate: selectedItem?.fromDate,
					toDate: selectedItem?.toDate,

					sortField: currentTableSort[0],
					sort: currentTableSort[1],
				});
			}
		}
		setSelectedServices([]);
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

		const formattedCustomDate = customFromattedDate(customDate);

		// setting the custom date values to selectedTimeFrame state and checking if From date is greater than To date and managing accordingly
		setSelectedTimeframe({
			...selectedTimeframe,
			...formattedCustomDate,
			name: "Customized Date",
			id: 7,
		});
		sessionStorage.setItem(
			SERVICE_STORAGE_TIMEFRAME,
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
			status: selectedStatus?.id,
			fromDate: formattedCustomDate?.fromDate,
			toDate: formattedCustomDate?.toDate,
			sortField: currentTableSort?.[0],
			sort: currentTableSort?.[1],
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
			sortField = "",
			sort = "",
			shouldCount = true,
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
						sortField,
						sort,
					}),
					shouldCount &&
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
					setAllData(response?.[0]?.data);
					response?.[1].status && setCountOfService(response?.[1]?.data);
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
					sortField: currentTableSort[0],
					sort: currentTableSort[1],
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

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			const localItems =
				JSON.parse(sessionStorage.getItem("me")) ||
				JSON.parse(localStorage.getItem("me"));

			const updatedStorage = {
				...localItems,
				site: {
					...localItems.site,
					showServiceClientName: result?.data?.showServiceClientName,
				},
				application: {
					...localItems.application,
					allowFacilityBasedModels:
						result?.data?.application.showServiceClientName,
					allowIndividualAssetModels:
						result?.data?.application.allowIndividualAssetModels,
					allowRegisterAssetsForServices:
						result?.data?.application.allowRegisterAssetsForServices,
				},
			};
			localStorage.setItem("me", JSON.stringify(updatedStorage));
			sessionStorage.setItem("me", JSON.stringify(updatedStorage));
		} catch (err) {
			dispatch(showError(err?.response?.detail || "Failed to fetch data"));
		}
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
	}, []);

	// searching for services
	const handleSearch = useCallback(
		debounce(
			async (value, department, status, fromDate, toDate, sortField, sort) => {
				setSearching(true);
				searchRef.current = value;
				await fetchServiceList({
					search: value,
					siteDepartmentID: department,
					status: status,
					fromDate: fromDate,
					toDate: toDate,
					sortField,
					sort,
				});
				if (!value || value === "")
					setDataForFetchingService({
						pageNumber: 1,
						pageSize: defaultPageSize(),
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

	// select Service for Multiple change status
	const handleSelectService = (service) => {
		if (selectedServices.findIndex((x) => x.id === service.id) === -1) {
			setSelectedServices((prev) => [...prev, service]);
		} else {
			setSelectedServices((prev) => prev.filter((x) => x.id !== service.id));
		}
	};

	//check if all selected services are stopped
	const isServicesStopped = () => {
		const isAllStopped = selectedServices[0]?.status === "T";
		if (isAllStopped) {
			return selectedServices.every(
				(x) => x.tasksSkipped === selectedServices[0].tasksSkipped
			);
		}
		return true;
	};

	// disable change status button if services selected with different status
	const isMultipleServiceDisable = () => {
		if (selectedServices.length === 0) return true;
		return !(
			selectedServices.every(
				(x) => x?.status === selectedServices?.[0]?.status
			) && isServicesStopped()
		);
	};

	const mainData = searchQuery?.length === 0 ? allData : allData;

	if (loading) return <CircularProgress />;

	return (
		<>
			<TabTitle title={`${customCaptions.servicePlural} | ${name}`} />
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
						sortField: currentTableSort[0],
						sort: currentTableSort[1],
					})
				}
				setDataForFetchingService={setDataForFetchingService}
				serviceId={deleteID}
			/>
			<MultipleChangeStatusPopup
				customCaptions={customCaptions}
				onClose={() => setOpenMultipleChnageStatusPopup(false)}
				open={openMultipleChnageStatusPopup}
				status={selectedServices[0]?.status}
				siteAppID={siteAppID}
				services={selectedServices}
				fetchData={() =>
					fetchServiceList({
						search: searchRef.current,
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
						sortField: currentTableSort[0],
						sort: currentTableSort[1],
					})
				}
				setSelectedServices={setSelectedServices}
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
						sortField: currentTableSort[0],
						sort: currentTableSort[1],
					});
					setDataForFetchingService({
						pageNumber: 1,
						pageSize: defaultPageSize(),
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
				showArrangements={showArrangements}
				showServiceClientName={showServiceClientName}
				allowRegisterAssetsForServices={allowRegisterAssetsForServices}
				customCaptions={customCaptions}
				position={position}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchServiceList({
						search: "",
						status: selectedStatus?.id,
						siteDepartmentID: selectedDepartment?.id,
						fromDate: selectedTimeframe.fromDate,
						toDate: selectedTimeframe.toDate,
						sortField: currentTableSort[0],
						sort: currentTableSort[1],
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
					setOpenMultipleChnageStatusPopup={setOpenMultipleChnageStatusPopup}
					MultipleChangeStatusDisabled={isMultipleServiceDisable()}
					customCaptions={customCaptions}
					setOpenAddService={setOpenAddService}
					setImportCSV={setImportCSV}
					dataLength={countOFService}
					selectedServices={selectedServices}
					statusType={selectedStatus}
					department={selectedDepartment}
					searchFilter={searchRef.current}
					statusId={selectedStatus.id}
					fromDate={selectedTimeframe.fromDate}
					toDate={selectedTimeframe.toDate}
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
							e.persist();
							setDataForFetchingService((prev) => ({
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
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.department ?? "Department"}`,
								},
								{
									id: 2,
									name: `${customCaptions?.location ?? "Location"}`,
								},
							]}
							showHeader
							columns={[
								{ id: 1, name: "name" },
								{ id: 2, name: "description" },
							]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
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
				<div
					style={{
						height: 20,
					}}
				></div>
				<ServiceListTable
					data={mainData}
					headers={serviceTableHeader(
						allowIndividualAssetModels,
						customCaptions,
						showServiceClientName
					)}
					columns={serviceTableColumns(
						allowIndividualAssetModels,
						showServiceClientName
					)}
					setData={setAllData}
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
					handleSort={async (sortField, sortOrder) => {
						setSearching(true);
						await fetchServiceList({
							search: searchRef.current,
							siteDepartmentID: selectedDepartment?.id,
							status: selectedStatus.id,
							fromDate: selectedTimeframe.fromDate,
							toDate: selectedTimeframe.toDate,
							sort: sortOrder,
							sortField,
							shouldCount: false,
						});
						setSearching(false);
					}}
					setDataForFetchingService={setDataForFetchingService}
					siteAppID={siteAppID}
					selectedServices={selectedServices}
					currentTableSort={currentTableSort}
					setCurrentTableSort={setCurrentTableSort}
					handleSelectService={handleSelectService}
					content={customCaptions?.servicePlural}
					isReadOnly={position?.[mainAccess.serviceAccess] === "R"}
				/>
			</div>
		</>
	);
}

export default ServiceLists;
