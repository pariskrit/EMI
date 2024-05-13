import {
	analyticsEndtDate,
	analyticsStartDate,
	coalesc,
	convertDateToUTC,
	customFromattedDate,
} from "helpers/utils";
import CustomDateRange from "pages/Services/ServiceLists/CustomDateRange";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { filterByDateOptions, MONTHS } from "constants/Analytics";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { changeDate } from "helpers/date";
import { CircularProgress, Grid } from "@mui/material";
import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getDefectRiskRatings,
	getSiteDepartments,
	getCompletedVsOutstanding,
} from "services/analytics";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import BarGraphVertical from "components/Elements/Analytics/BarGraphVertical";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import MultiLineGraph from "components/Elements/Analytics/MultiLineGraph";
import { makeStyles } from "tss-react/mui";

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

const CompletedOutstandingDefectsPage = () => {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const initialCrumb = [
		{ id: 1, name: `Completed v Outstanding ${customCaptions?.defectPlural}` },
	];
	const [chartData, setChartData] = useState([]);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);
	const [riskRatings, setRiskRatings] = useState([]);
	const [crumbs, setCrumbs] = useState(initialCrumb);
	const [last, setLast] = useState(false);
	const [isLoading, setIsloading] = useState(true);
	const [drillDown, setIsDrillDown] = useState(false);
	const [customDate, setCustomDate] = useState(defaultCustomDate);
	const [month, setMonth] = useState(undefined);
	const [selectedTimeframe, setSelectedTimeframe] = useState(
		filterByDateOptions(new Date())?.[4]
	);

	const [selectedModel, setSelectedModel] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedDepartment, setSelectedDepartment] = useState({
		id: siteDepartmentID,
		name: siteDepartmentName,
	});
	const [selectedRating, setSelectedRating] = useState({
		id: "",
		name: "Show All",
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

	useEffect(() => {
		const fetchData = async () => {
			const [siteDepartmentsResponse, defectRiskRatingsResponse] =
				await Promise.all([
					getSiteDepartments(siteAppID),
					getDefectRiskRatings(),
				]);

			if (
				siteDepartmentsResponse?.status &&
				defectRiskRatingsResponse?.status
			) {
				setDepartments([
					{ id: "", name: "Show All" },
					...siteDepartmentsResponse?.data,
				]);
				setRiskRatings([
					{ id: "", name: "Show All" },
					...defectRiskRatingsResponse?.data,
				]);
			} else {
				dispatch(
					showError(
						siteDepartmentsResponse?.data?.detail ||
							defectRiskRatingsResponse?.data?.detail ||
							"Could not fetch data"
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
			setIsDrillDown(false);
			setCrumbs(initialCrumb);
			setSelectedDepartment(selectedItem);
			setSelectedModel({ id: "", name: "Show All" });
			await fetchCompletedOutstanding({
				siteDepartmentID: selectedItem?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: "",
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "model" && selectedItem.id !== selectedModel.id) {
			setLast(false);
			setIsDrillDown(false);
			setCrumbs(initialCrumb);
			setSelectedModel(selectedItem);
			await fetchCompletedOutstanding({
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedItem.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "riskRatings" && selectedItem.id !== selectedRating.id) {
			setLast(false);
			setIsDrillDown(false);
			setCrumbs(initialCrumb);
			setSelectedRating(selectedItem);
			await fetchCompletedOutstanding({
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedItem.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "timeframe") {
			setLast(false);
			setIsDrillDown(false);
			setCrumbs(initialCrumb);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);
				await fetchCompletedOutstanding({
					siteDepartmentID: selectedDepartment?.id,
					defectRiskRatingId: selectedRating.id,
					modelId: selectedModel.id,
					startDate: selectedItem.fromDate,
					endDate: selectedItem.toDate,
				});
			}
		}
	};

	const fetchCompletedOutstanding = useCallback(
		async ({
			siteDepartmentID = "",
			modelId = "",
			startDate = "",
			endDate = "",
			defectRiskRatingId = "",
		}) => {
			setIsloading(true);
			const response = await getCompletedVsOutstanding({
				startDate,
				endDate,
				defectRiskRatingId,
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
		fetchCompletedOutstanding({
			siteDepartmentID,
			startDate: selectedTimeframe.fromDate,
			endDate: selectedTimeframe.toDate,
		});
	}, [fetchCompletedOutstanding, siteDepartmentID]);

	const handleLineClick = async (data) => {
		setMonth(data?.payload?.month);
		setIsloading(true);
		const response = await getCompletedVsOutstanding({
			siteDepartmentId: selectedDepartment?.id,
			defectRiskRatingId: selectedRating.id,
			modelId: selectedModel.id,
			startDate: analyticsStartDate(data?.payload?.year, data?.payload.month),
			endDate: analyticsEndtDate(data?.payload?.year, data?.payload.month),
			defectStatusType: data?.payload?.type === "C" ? "C" : "O",
		});
		if (response?.data) {
			setChartData(response.data);
			setLast(true);
			setCrumbs([
				{
					id: 1,
					name: data?.payload?.type === "C" ? "Completed" : "Outstanding",
					depth: "T",
				},
				{
					id: 2,
					name: customCaptions.asset,
				},
			]);
			setIsDrillDown(true);
		} else {
			dispatch(
				showError(
					response?.data?.details || response?.data || "Could not fetch data"
				)
			);
		}

		setIsloading(false);
	};

	const handleRevertChart = async (data) => {
		setMonth(undefined);
		setIsloading(true);
		setIsDrillDown(false);
		const response = await getCompletedVsOutstanding({
			siteDepartmentId: selectedDepartment?.id,
			defectRiskRatingId: selectedRating.id,
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

		await fetchCompletedOutstanding({
			siteDepartmentID: selectedDepartment?.id,
			defectRiskRatingId: selectedRating.id,
			modelId: selectedModel?.id,
			startDate: formattedCustomDate.fromDate,
			endDate: formattedCustomDate.toDate,
		});
		handleCloseCustomDate();
	};

	const subTitle = `${
		drillDown
			? MONTHS[month - 1]
			: selectedTimeframe?.id
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
	} ${selectedModel.id ? selectedModel.name : "All " + customCaptions.model} ${
		selectedRating.id
			? selectedRating.name
			: "All " + customCaptions.riskRatingPlural
	}`;

	return (
		<div className={"container"}>
			<NavDetails
				history={false}
				status={false}
				staticCrumbs={[
					{ id: 1, name: "Analytics", url: appPath + analyticsPath },
					{
						id: 2,
						name: `Completed vs Outstanding ${customCaptions.defectPlural}`,
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
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={riskRatings}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.riskRating ?? "Risk Ratings"}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select Risk Rating`}
							width="100%"
							onChange={(item) => onDropdownChange("riskRatings", item)}
							selectdValueToshow="name"
							selectedValue={selectedRating}
							label={`Filter by ${customCaptions.riskRating}`}
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
				title={`Completed vs Outstanding ${customCaptions.defectPlural}`}
				subTitle={subTitle}
				afterClick={handleRevertChart}
			/>
			{isLoading ? (
				<div className={classes.centerItem}>
					<CircularProgress size="70px" />
				</div>
			) : Object.values(chartData).every((d) => d.length > 0) && !drillDown ? (
				<MultiLineGraph
					chartData={chartData}
					crumbs={crumbs}
					handleLineClick={handleLineClick}
				/>
			) : chartData?.length > 0 && drillDown ? (
				<BarGraphVertical
					chartData={chartData}
					crumbs={crumbs}
					line={false}
					isLast={last}
				/>
			) : (
				<h1 className={classes.centerItem}>No data found</h1>
			)}
		</div>
	);
};

export default CompletedOutstandingDefectsPage;
