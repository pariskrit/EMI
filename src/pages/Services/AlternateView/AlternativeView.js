// import TextFieldContainer from "components/Elements/TextFieldContainer";
import React from "react";
import { useState } from "react";
import { Grid, LinearProgress } from "@mui/material";
// import ActionButtonStyle from "styles/application/ActionButtonStyle";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import CustomDateRange from "pages/Services/ServiceLists/CustomDateRange";
import { makeStyles } from "tss-react/mui";

import {
	getCountOfServiceList,
	getSiteDepartmentsInService,
	getServicesList,
} from "services/services/serviceLists";
import { changeDate } from "helpers/date";
import DetailsPanel from "components/Elements/DetailsPanel";
import { useNavigate } from "react-router-dom";
import { appPath, servicesPath } from "helpers/routePaths";
import ColourConstants from "helpers/colourConstants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ChartView from "pages/Services/AlternateView/ChartView";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchField from "components/Elements/SearchField/SearchField";

import {
	SERVICE_STORAGE_DEPARTMENT,
	SERVICE_STORAGE_STATUS,
	SERVICE_STORAGE_TIMEFRAME,
	statusOptions,
	statusTypeClassification,
} from "helpers/constants";
import {
	defaultTimeframe,
	filterByDateOptions,
	serviceGarphId,
	showAllInDropDown,
} from "constants/serviceDetails";
import {
	debounce,
	convertDateToUTC,
	MuiFormatDate,
	isoDateWithoutTimeZone,
	customFromattedDate,
} from "helpers/utils";
import { useRef } from "react";
import { useCallback } from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
const AT = ActionButtonStyle();

const useStyles = makeStyles()((theme) => ({
	alignCenter: {
		alignItems: "center",
	},
	title: {
		display: "inline-block",
		color: ColourConstants.activeLink,
		fontSize: "20px",
		fontWeight: "bold",
		"&:hover": {
			cursor: "pointer",
		},
	},
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
}));

const columns = [
	{ type: "string", label: "Task ID" },
	{ type: "string", label: "Work Order" },
	{ type: "string", role: "tooltip", p: { html: true } },
	{ type: "date", label: "Start Date" },
	{ type: "date", label: "End Date" },
	{ type: "number", label: "duration" },
	{ type: "number", label: "Percent Complete" },
	{ type: "string", label: "Dependencies" },
];

const defaultCustomDate = { from: "", to: "" };

const AlternativeView = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { classes } = useStyles();
	const [rows, setRows] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [siteDepartments, setSiteDepartments] = useState([]);
	const statusFromMemory = JSON.parse(sessionStorage.getItem("service-status"));
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [isSearching, setSearching] = useState(false);

	const searchRef = useRef("");
	const customDateRef = useRef(false);

	const departmentFromMemory = JSON.parse(
		sessionStorage.getItem("service-department")
	);
	const timeFrameFromMemory = JSON.parse(
		sessionStorage.getItem("service-timeFrame")
	);

	const {
		siteID,
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

	const [customDate, setCustomDate] = useState(
		timeFrameFromMemory !== null && timeFrameFromMemory.id === 7
			? {
					from: MuiFormatDate(timeFrameFromMemory.fromDate),
					to: MuiFormatDate(timeFrameFromMemory.toDate),
			  }
			: defaultCustomDate
	);

	const [selectedStatus, setSelectedStatus] = useState(
		statusFromMemory === null ? showAllInDropDown : statusFromMemory
	);

	const [dataForFetchingService, setDataForFetchingService] = useState({
		pageNumber: 1,
		pageSize: 200,
		search: "",
		sortField: "",
		sort: "",
	});

	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);

	const [selectedTimeframe, setSelectedTimeframe] = useState(
		timeFrameFromMemory === null ? defaultTimeframe : timeFrameFromMemory
	);
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (count > 0 && document.querySelector(`#${serviceGarphId} > div `)) {
			document.querySelector(`#${serviceGarphId} > div `).style.height = `${
				count * 30 + 110
			}px`;
			document.querySelector(
				`#${serviceGarphId}> div>div>svg `
			).style.height = `${count * 30 + 110}px`;
			document.querySelector(`#${serviceGarphId}`).parentNode.style.height = `${
				count * 30 + 50
			}px`;
			document.querySelector(`#${serviceGarphId}`).style.height = `${
				count * 30 + 110
			}px`;
		}
	}, [count]);

	useEffect(() => {
		const fetchData = async () => {
			const [, response2] = await Promise.all([
				fetchServiceList({
					search: "",
					siteDepartmentID: selectedDepartment?.id,
					status: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
					pageSize: 100,
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

	useEffect(() => {
		if (selectedTimeframe?.id === 7) {
			customDateRef.current = true;
		}
	}, []);

	const handleCustomDateChange = (type, e) => {
		setCustomDate({ ...customDate, [type]: e.target.value });
	};

	const handleCloseCustomDate = () => {
		setOpenCustomDatePopup(false);
		setCustomDateRangeError(defaultCustomDate);
	};

	const timeframeOptions = (customCaptions) => {
		return filterByDateOptions(new Date(), customCaptions);
	};

	const dateConverter = (date, estimateTime) => {
		const estimateDate =
			new Date(date + "Z").getTime() + estimateTime * 60 * 1000;
		const requiredEstimateDate = new Date(estimateDate);
		return requiredEstimateDate;
	};
	const onDropdownChange = async (type, selectedItem) => {
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
			});
		}
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
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
			});
		}
		if (type === "timeframe") {
			if (selectedItem.id === 7) {
				setOpenCustomDatePopup(true);
			} else {
				customDateRef.current = false;
				setSelectedTimeframe(selectedItem);
				sessionStorage.setItem(
					SERVICE_STORAGE_TIMEFRAME,
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
	};
	const handleCustomDateSubmit = async (e) => {
		e.preventDefault();
		const isFromDateEmpty = customDate.from === "";
		const isToDateEmpty = customDate.to === "";
		if (isFromDateEmpty || isToDateEmpty) {
			setCustomDateRangeError({ from: isFromDateEmpty, to: isToDateEmpty });
			return;
		}
		customDateRef.current = true;

		const formattedCustomDate = customFromattedDate(customDate);

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
			status: selectedStatus.id,
			fromDate: formattedCustomDate.fromDate,
			toDate: formattedCustomDate.toDate,
		});
		handleCloseCustomDate();
	};

	const fetchServiceList = async ({
		search = "",
		status = "",
		siteDepartmentID = "",
		fromDate = "",
		toDate = "",
		sortField = "",
		sort = "",
		shouldCount = true,
	}) => {
		setLoading(true);
		try {
			const response = await Promise.all([
				getServicesList({
					statusType:
						status === 2 || status === 1
							? statusTypeClassification[status]
							: "",
					status: status === 2 || status === 1 ? "" : status,
					siteAppId: siteAppID,
					siteDepartmentID,
					search,
					fromDate,
					toDate,
					sortField,
					sort,
					pageSize: 200,
				}),
				shouldCount &&
					getCountOfServiceList({
						statusType:
							status === 2 || status === 1
								? statusTypeClassification[status]
								: "",
						status: status === 2 || status === 1 ? "" : status,
						siteAppId: siteAppID,
						siteDepartmentID,
						search,
						fromDate,
						toDate,
						pageSize: 200,
					}),
			]);
			if (response[0].status) {
				if (response[0].status) {
					setTableData(response[0]?.data);
					let mainData = response[0].data.map((d) => [
						d.id,
						d.workOrder,
						`${isoDateWithoutTimeZone(d.scheduledDate + "Z")}`,
						new Date(d.scheduledDate + "Z"),
						dateConverter(d.scheduledDate, d.estimatedMinutes),
						null,
						Math.round(d.percentageComplete),
						null,
					]);

					const firstDate = customDateRef.current
						? new Date(new Date(customDate.from).setHours(0, 0, 0, 0))
						: new Date(response[0]?.data?.[0]?.scheduledDate + "Z");

					const secondDate = customDateRef.current
						? new Date(
								new Date(
									new Date(customDate.to).getTime() + 3600000 * 24
								).setHours(0, 0, 0, 0)
						  )
						: new Date(response[0]?.data?.[0]?.scheduledDate + "Z");

					if (mainData.length > 0) {
						setRows([
							[null, null, null, firstDate, secondDate, null, null, null],
							...mainData,
						]);
					} else {
						setRows(mainData);
					}
					setCount(response[1].data);
				}
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
		setLoading(false);
	};

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
				});
				if (!value || value === "")
					setDataForFetchingService({
						pageNumber: 1,
						pageSize: 200,
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

	//for chart
	const data = [columns, ...rows];

	let options = {
		title: "Service Chart",
		height: `${count * 30 + 110}px`,
		tooltip: { isHtml: true, trigger: "visible" },
		isStacked: true,
		gantt: {
			trackHeight: 30,
			criticalPathEnabled: false,
			palette: rows?.map((d, index) => {
				if (index === 0) {
					return {
						color: "transparent",
						dark: "transparent",
						light: "transparent",
					};
				} else {
					return {
						color: "#05a7f2",
						dark: "#03adfc",
						light: "#05a7f2",
					};
				}
			}),
		},
	};

	const onTimeLineHover = (datas) => {
		if (datas?.row === 0) return;

		const resourceText = document.querySelectorAll(
			"#serviceganttchartid svg g:nth-child(10) text:nth-child(7)"
		)[0];
		if (resourceText && resourceText.innerHTML !== "Scheduled Date: ")
			resourceText.innerHTML = "Scheduled Date: ";

		const rectEl = document.querySelectorAll(
			"#serviceganttchartid svg g:nth-child(10) rect"
		)[0];
		if (rectEl) {
			let y = rectEl.getAttribute("y");
			y = parseFloat(y) + 40;
			rectEl.style.y = y;
		}
	};
	//

	useEffect(() => {
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
		fetchSiteApplicationDetails();
	}, [siteAppID]);
	return (
		<>
			<div
				className={classes.title}
				onClick={() => navigate(appPath + servicesPath)}
			>{`${customCaptions.servicePlural} (${count})`}</div>
			<CustomDateRange
				open={openCustomDatePopup}
				handleChange={handleCustomDateChange}
				customDate={customDate}
				closeHandler={handleCloseCustomDate}
				onSubmit={handleCustomDateSubmit}
				isError={isCustomDateRangeError}
				// isLoading={isSearching}
			/>

			<div
				className="detailsContainer"
				style={{ alignItems: "center", marginTop: "-15px" }}
			>
				<DetailsPanel
					showHeader={false}
					description={`View all ${customCaptions?.servicePlural} across your operations`}
				/>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<AT.GeneralButton
						className={classes.importButton}
						style={{ marginLeft: "auto", backgroundColor: "ED8738" }}
						onClick={() => navigate(appPath + servicesPath)}
					>
						View List
					</AT.GeneralButton>
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
								selectedTimeframe.toDate
							);
						}}
					/>
				</div>
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
			<div style={{ height: 20 }}></div>
			{/* {isSearching && <LinearProgress className={classes.loading} />} */}
			{loading && <LinearProgress className={classes.loading} />}

			{rows.length > 0 && !loading && (
				<ChartView
					loading={loading}
					data={data}
					options={options}
					rows={rows}
					columns={columns}
					hoverFunc={onTimeLineHover}
					tableDataContent={tableData}
				/>
			)}
		</>
	);
};

export default AlternativeView;
