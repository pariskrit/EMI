import { coalesc, convertDateToUTC, customFromattedDate } from "helpers/utils";
import CustomDateRange from "pages/Services/ServiceLists/CustomDateRange";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { defaultTimeframe } from "constants/serviceDetails";
import { filterByDateOptions } from "constants/Analytics";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { changeDate } from "helpers/date";
import { CircularProgress, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getSiteDepartments,
	getMissingPartsTools,
} from "services/analytics";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import BarGraphVertical from "components/Elements/Analytics/BarGraphVertical";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import updateStorage from "helpers/updateStorage";

const defaultCustomDate = { from: "", to: "" };
const useStyles = makeStyles()((theme) => ({
	header: {
		marginTop: "35px",
	},
	centerItem: {
		display: "flex",
		justifyContent: "center",
		marginTop: "150px",
	},
}));

const MissingPartsToolsPage = () => {
	const { classes } = useStyles();
	const dispatch = useDispatch();
	const {
		application,
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const initialCrumb = [
		{
			id: 1,
			name: `${customCaptions.partPlural} and ${customCaptions.toolPlural}`,
		},
	];
	const [chartData, setChartData] = useState([]);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);
	const [crumbs, setCrumbs] = useState(initialCrumb);
	const [last, setLast] = useState(false);
	const [isLoading, setIsloading] = useState(true);
	const [customDate, setCustomDate] = useState(defaultCustomDate);
	const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
	const [selectedModel, setSelectedModel] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedDepartment, setSelectedDepartment] = useState({
		id: siteDepartmentID,
		name: siteDepartmentName,
	});

	const modifyModelData = (datas) => {
		const data = datas.map((d) => {
			return {
				...d,
				name: d?.name + " " + coalesc(d?.modelName),
			};
		});
		return data;
	};

	const [siteAppState, setSiteAppState] = useState({ application });
	const reduxDispatch = useDispatch();

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			setSiteAppState(result?.data);
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		}
	};
	useEffect(() => {
		fetchSiteApplicationDetails();
		if (siteAppID) updateStorage(siteAppID);
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			const [siteDepartmentsResponse] = await Promise.all([
				getSiteDepartments(siteAppID),
			]);

			if (siteDepartmentsResponse?.status) {
				setDepartments([
					{ id: "", name: "Show All" },
					...siteDepartmentsResponse?.data,
				]);
			} else {
				dispatch(
					showError(
						siteDepartmentsResponse?.data?.detail || "Could not fetch data"
					)
				);
			}
		};
		fetchData();
	}, [dispatch, siteAppID]);

	useEffect(() => {
		const fetchData = async () => {
			const [modelsPublishedResponse] = await Promise.all([
				getModelsPublished({
					siteDepartmentId: selectedDepartment.id,
				}),
			]);
			if (modelsPublishedResponse?.status) {
				setModels(
					modifyModelData([
						{ id: "", name: "Show All" },
						...modelsPublishedResponse?.data,
					])
				);
			} else {
				dispatch(
					showError(
						modelsPublishedResponse?.data?.detail || "Could not fetch data"
					)
				);
			}
		};
		fetchData();
	}, [dispatch, selectedDepartment.id]);

	const onDropdownChange = async (type, selectedItem) => {
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedDepartment(selectedItem);
			setSelectedModel({ id: "", name: "Show All" });
			await fetchMissingPartsTools({
				siteDepartmentID: selectedItem?.id,
				modelId: "",
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "model" && selectedItem.id !== selectedModel.id) {
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedModel(selectedItem);
			await fetchMissingPartsTools({
				siteDepartmentID: selectedDepartment?.id,
				modelId: selectedItem.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "timeframe") {
			setLast(false);
			setCrumbs(initialCrumb);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);
				await fetchMissingPartsTools({
					siteDepartmentID: selectedDepartment?.id,
					modelId: selectedModel.id,
					startDate: selectedItem.fromDate,
					endDate: selectedItem.toDate,
				});
			}
		}
	};

	const fetchMissingPartsTools = useCallback(
		async ({
			siteDepartmentID = "",
			modelId = "",
			startDate = "",
			endDate = "",
		}) => {
			setIsloading(true);
			const response = await getMissingPartsTools({
				startDate,
				endDate,
				siteDepartmentId: siteDepartmentID,
				modelId,
			});
			if (response?.status) {
				setChartData(response?.data);
			} else {
				dispatch(
					showError(
						response?.data?.details || response?.data || "Could not fetch data"
					)
				);
			}
			setIsloading(false);
		},
		[dispatch]
	);

	useEffect(() => {
		fetchMissingPartsTools({ siteDepartmentID });
	}, [fetchMissingPartsTools, siteDepartmentID]);

	const handleBarClick = async (data) => {
		if (chartData.depth === "P") {
			return;
		}
		setIsloading(true);

		let response = null;

		if (chartData.depth === "R") {
			response = await getMissingPartsTools({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				missingPartToolId: data.id,
			});
			if (response?.data) {
				setChartData(response?.data);
				setLast(true);
				setCrumbs([
					{
						id: 1,
						name: data.name,
						depth: "R",
					},
					{
						id: 2,
						name: `${customCaptions.partPlural} / ${customCaptions.toolPlural} by ${customCaptions.part} and ${customCaptions.tool}`,
					},
				]);
			} else {
				dispatch(
					showError(
						response?.data?.details || response?.data || "Could not fetch data"
					)
				);
			}
		}
		setIsloading(false);
	};

	const handleRevertChart = async (data) => {
		setIsloading(true);
		const response = await getMissingPartsTools({
			siteDepartmentId: selectedDepartment?.id,
			modelId: selectedModel.id,
			startDate: selectedTimeframe.fromDate,
			endDate: selectedTimeframe.toDate,
		});
		if (response?.data) {
			setChartData(response?.data);
			setCrumbs(initialCrumb);
			setLast(false);
		} else {
			dispatch(
				showError(
					response?.data?.details || response?.data || "Could not fetch data"
				)
			);
		}

		setIsloading(false);
	};

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

	const handleCustomDateSubmit = async (e) => {
		e.preventDefault();
		const isFromDateEmpty = customDate.from === "";
		const isToDateEmpty = customDate.to === "";
		if (isFromDateEmpty || isToDateEmpty) {
			setCustomDateRangeError({ from: isFromDateEmpty, to: isToDateEmpty });
			return;
		}

		const formattedCustomDate = customFromattedDate(customDate);
		setSelectedTimeframe({
			...selectedTimeframe,
			...formattedCustomDate,
			name: "Customized Date",
			id: 5,
		});

		await fetchMissingPartsTools({
			siteDepartmentID: selectedDepartment?.id,
			modelId: selectedModel?.id,
			startDate: formattedCustomDate.fromDate,
			endDate: formattedCustomDate.toDate,
		});
		handleCloseCustomDate();
	};

	const subTitle = `${
		selectedTimeframe?.id
			? selectedTimeframe.id === 5
				? `From ${changeDate(customDate?.from)} To ${changeDate(
						customDate?.to
				  )}`
				: selectedTimeframe?.name
			: `All Dates`
	} ${
		selectedDepartment.id
			? selectedDepartment.name
			: "All " + customCaptions.departmentPlural
	} ${selectedModel.id ? selectedModel.name : "All " + customCaptions.model}`;

	return (
		<div className={"container"}>
			<NavDetails
				history={false}
				status={false}
				staticCrumbs={[
					{ id: 1, name: "Analytics", url: appPath + analyticsPath },
					{
						id: 2,
						name: `Missing ${
							siteAppState.application.showParts
								? `${customCaptions.partPlural ?? "Parts"} and `
								: ""
						}${customCaptions.toolPlural} by Reason`,
					},
				]}
			/>
			<CustomDateRange
				open={openCustomDatePopup}
				handleChange={handleCustomDateChange}
				customDate={customDate}
				closeHandler={handleCloseCustomDate}
				onSubmit={handleCustomDateSubmit}
				isError={isCustomDateRangeError}
				isLoading={isLoading}
			/>
			<div className={classes.header}>
				<Grid container spacing={2}>
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
									selectedTimeframe.id === 5
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
							dataSource={departments}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.department ?? "Department"}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
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
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={models}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.model ?? "Model"}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select ${customCaptions.model}`}
							width="100%"
							onChange={(item) => onDropdownChange("model", item)}
							selectdValueToshow="name"
							selectedValue={selectedModel}
							label={`Filter by ${customCaptions.model}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
			</div>
			<GraphAnalyticsTitle
				datas={crumbs}
				title={`Missing ${
					siteAppState.application.showParts
						? `${customCaptions.partPlural ?? "Parts"} and `
						: ""
				}${customCaptions.toolPlural} by Reason`}
				subTitle={subTitle}
				afterClick={handleRevertChart}
			/>
			{isLoading ? (
				<div className={classes.centerItem}>
					<CircularProgress size="70px" />
				</div>
			) : chartData?.data?.length > 0 ? (
				<BarGraphVertical
					chartData={chartData.data}
					crumbs={crumbs}
					handleBarClick={handleBarClick}
					line={false}
					isLast={last}
				/>
			) : (
				<h1 className={classes.centerItem}>No data found</h1>
			)}
		</div>
	);
};

export default MissingPartsToolsPage;
