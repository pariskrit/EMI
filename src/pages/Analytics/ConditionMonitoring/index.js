import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { defaultTimeframe } from "constants/serviceDetails";
import { filterByDateOptions } from "constants/Analytics";
import { coalesc, convertDateToUTC, customFromattedDate } from "helpers/utils";
import CustomDateRange from "pages/Services/ServiceLists/CustomDateRange";
import FilterListIcon from "@mui/icons-material/FilterList";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { changeDate } from "helpers/date";
import { CircularProgress, Grid } from "@mui/material";
import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getConditionMonitoring,
	getSiteDepartments,
	getModelAssetsAvailable,
	getModelVersionRoles,
	getModelVersionIntervals,
	getConditionMonitoringQuestions,
} from "services/analytics";
import { makeStyles } from "tss-react/mui";

import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import { serviceMonitorQuestionHeader } from "constants/serviceDetails";
import LineGraph from "components/Elements/Analytics/LineGraph";

const defaultCustomDate = { from: "", to: "" };
const useStyles = makeStyles()((theme) => ({
	titleCenter: {
		display: "flex",
		justifyContent: "center",
		marginTop: "150px",
	},
	header: {
		marginTop: "35px",
	},
	centerItem: {
		display: "flex",
		justifyContent: "center",
		marginTop: "150px",
	},
}));

const ConditionMonitoringPage = () => {
	const { classes } = useStyles();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const initialCrumb = [{ id: 1, name: "Condition Monitoring" }];
	const [chartData, setChartData] = useState([]);
	const dispatch = useDispatch();
	const [crumbs, setCrumbs] = useState(initialCrumb);
	const [last, setLast] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);
	const [modelAssetAvailable, setModelAssetAvailable] = useState([]);
	const [modelVersionRoles, setModelVersionRoles] = useState([]);
	const [modelVersionIntervals, setModelVersionIntervals] = useState([]);
	const [conditionMonitoringQuestions, setConditionMonitoringQuestions] =
		useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [customDate, setCustomDate] = useState(defaultCustomDate);
	const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
	const [selectedModel, setSelectedModel] = useState({});
	const [selectedDepartment, setSelectedDepartment] = useState({
		id: siteDepartmentID,
		name: siteDepartmentName,
	});
	const [selectedModelAssetAvailable, setSelectedModelAssetAvailable] =
		useState({});
	const [selectedModelVersionRoles, setSelectedModelVersionRoles] = useState(
		{}
	);
	const [selectedModelVersionIntervals, setSelectedModelVersionIntervals] =
		useState({});
	const [
		selectedConditionMonitoringQuestions,
		setSelectedConditionMonitoringQuestions,
	] = useState({});
	const [hasAsset, setHasAsset] = useState(false);

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
			const siteDepartmentsResponse = await getSiteDepartments(siteAppID);
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
			const modelsPublishedResponse = await getModelsPublished({
				siteDepartmentId: selectedDepartment?.id,
			});
			if (modelsPublishedResponse?.status) {
				setModels(modifyModelData([...modelsPublishedResponse?.data]));
			} else {
				dispatch(
					showError(
						modelsPublishedResponse?.data?.detail || "Could not fetch data"
					)
				);
			}
		};
		fetchData();
	}, [dispatch, selectedDepartment]);

	useEffect(() => {
		if (hasAsset) {
			const fetchData = async () => {
				const modelAssetsAvailableResponse = await getModelAssetsAvailable({
					modelId: selectedModel?.id,
				});
				if (modelAssetsAvailableResponse?.status) {
					setModelAssetAvailable([
						{ id: "", name: "Show All" },
						...modelAssetsAvailableResponse?.data.map((d) => ({
							...d,
							id: d?.siteAssetID,
						})),
					]);
				} else {
					dispatch(
						showError(
							modelAssetsAvailableResponse?.data?.detail ||
								"Could not fetch data"
						)
					);
				}
			};
			fetchData();
		}
	}, [dispatch, hasAsset, selectedModel]);

	useEffect(() => {
		if (selectedModel?.id) {
			const fetchData = async () => {
				const modelVersionRolesResponse = await getModelVersionRoles({
					modelVersionId: selectedModel?.activeModelVersionID,
				});
				if (modelVersionRolesResponse?.status) {
					setModelVersionRoles([
						{ id: "", name: "Show All" },
						...modelVersionRolesResponse?.data,
					]);
				} else {
					dispatch(
						showError(
							modelVersionRolesResponse?.data?.detail || "Could not fetch data"
						)
					);
				}
			};
			fetchData();
		}
	}, [dispatch, selectedModel]);

	useEffect(() => {
		if (selectedModel?.id) {
			const fetchData = async () => {
				const modelVersionIntervalsResponse = await getModelVersionIntervals({
					modelVersionId: selectedModel?.activeModelVersionID,
				});
				if (modelVersionIntervalsResponse?.status) {
					setModelVersionIntervals([
						{ id: "", name: "Show All" },
						...modelVersionIntervalsResponse?.data,
					]);
				} else {
					dispatch(
						showError(
							modelVersionIntervalsResponse?.data?.detail ||
								"Could not fetch data"
						)
					);
				}
			};
			fetchData();
		}
	}, [dispatch, selectedModel]);

	useEffect(() => {
		if (
			selectedModel?.activeModelVersionID &&
			selectedModelVersionRoles &&
			selectedModelVersionIntervals
		) {
			const fetchData = async () => {
				const conditionMonitoringQuestionsResponse =
					await getConditionMonitoringQuestions({
						modelVersionId: selectedModel?.activeModelVersionID,
						modelVersionRoleId: selectedModelVersionRoles?.id,
						modelVersionIntervalId: selectedModelVersionIntervals?.id,
					});
				if (conditionMonitoringQuestionsResponse?.status) {
					setConditionMonitoringQuestions(() =>
						conditionMonitoringQuestionsResponse?.data.map((d) => ({
							...d,
							id:
								Math.random(d?.modelVersionStageID) +
								Math.random(d?.modelVersionTaskQuestionID) +
								Math.random(d?.modelVersionZoneID) +
								Math.random(d?.modelVersionTaskID),
						}))
					);
				} else {
					dispatch(
						showError(
							conditionMonitoringQuestionsResponse?.data?.detail ||
								"Could not fetch data"
						)
					);
				}
			};
			fetchData();
		}
	}, [
		dispatch,
		selectedModel,
		selectedModelVersionRoles,
		selectedModelVersionIntervals,
	]);

	const onDropdownChange = async (type, selectedItem) => {
		if (type === "department" && selectedItem?.id !== selectedDepartment?.id) {
			setSelectedDepartment(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedModel({});
			setSelectedModelAssetAvailable({ id: "", name: "Show All" });
			setSelectedModelVersionRoles({ id: "", name: "Show All" });
			setSelectedModelVersionIntervals({ id: "", name: "Show All" });
			setSelectedConditionMonitoringQuestions({});
			setHasAsset(false);
		}
		if (type === "model" && selectedItem?.id !== selectedModel?.id) {
			setSelectedModel(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedModelAssetAvailable({ id: "", name: "Show All" });
			setSelectedModelVersionRoles({ id: "", name: "Show All" });
			setSelectedModelVersionIntervals({ id: "", name: "Show All" });
			setSelectedConditionMonitoringQuestions({});
			setConditionMonitoringQuestions([]);
			setHasAsset(false);
			if (selectedItem?.modelTemplateType === "A") {
				setHasAsset(true);
			}
		}
		if (
			type === "modelAssetAvailable" &&
			selectedItem?.siteAssetID !== selectedModelAssetAvailable?.id
		) {
			setSelectedModelAssetAvailable({
				id: selectedItem?.siteAssetID,
				...selectedItem,
			});
			setLast(false);
			setCrumbs(initialCrumb);
			if (selectedConditionMonitoringQuestions?.id) {
				await fetchConditionMonitoring({
					modelVersionTaskQuestionId:
						selectedConditionMonitoringQuestions?.modelVersionTaskQuestionID,
					siteAssetId: selectedItem?.id,
					modelVersionStageId:
						selectedConditionMonitoringQuestions?.modelVersionStageID,
					modelVersionZoneId:
						selectedConditionMonitoringQuestions?.modelVersionZoneID
							? selectedConditionMonitoringQuestions?.modelVersionZoneID
							: "",
					startDate: selectedTimeframe?.fromDate,
					endDate: selectedTimeframe?.toDate,
				});
			}
		}
		if (
			type === "modelVersionRoles" &&
			selectedItem?.id !== selectedModelVersionRoles?.id
		) {
			setSelectedModelVersionRoles(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedConditionMonitoringQuestions({});
			setConditionMonitoringQuestions([]);
		}
		if (
			type === "modelVersionIntervals" &&
			selectedItem?.id !== selectedModelVersionIntervals?.id
		) {
			setSelectedModelVersionIntervals(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setSelectedConditionMonitoringQuestions({});
			setConditionMonitoringQuestions([]);
		}
		if (
			type === "conditionMonitoringQuestions" &&
			selectedItem?.id !== selectedConditionMonitoringQuestions?.id
		) {
			setSelectedConditionMonitoringQuestions({
				...selectedItem,
				id:
					selectedItem?.modelVersionStageID +
					selectedItem?.modelVersionTaskQuestionID +
					selectedItem?.modelVersionZoneID +
					selectedItem?.modelVersionTaskID,
			});
			setLast(false);
			setCrumbs(initialCrumb);
			await fetchConditionMonitoring({
				modelVersionTaskQuestionId: selectedItem?.modelVersionTaskQuestionID,
				siteAssetId: selectedModelAssetAvailable?.id,
				modelVersionStageId: selectedItem?.modelVersionStageID,
				modelVersionZoneId: selectedItem?.modelVersionZoneID
					? selectedItem?.modelVersionZoneID
					: "",
				startDate: selectedTimeframe?.fromDate,
				endDate: selectedTimeframe?.toDate,
			});
		}
		if (type === "timeframe") {
			setCrumbs(initialCrumb);
			setLast(false);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
				setIsloading(false);
			} else {
				setSelectedTimeframe(selectedItem);
				if (selectedConditionMonitoringQuestions?.id) {
					await fetchConditionMonitoring({
						modelVersionTaskQuestionId:
							selectedConditionMonitoringQuestions?.modelVersionTaskQuestionID,
						siteAssetId: selectedModelAssetAvailable?.id,
						modelVersionStageId:
							selectedConditionMonitoringQuestions?.modelVersionStageID,
						modelVersionZoneId:
							selectedConditionMonitoringQuestions?.modelVersionZoneID
								? selectedConditionMonitoringQuestions?.modelVersionZoneID
								: "",
						startDate: selectedItem?.fromDate,
						endDate: selectedItem?.toDate,
					});
				}
			}
		}
	};

	const fetchConditionMonitoring = useCallback(
		async ({
			modelVersionTaskQuestionId = "",
			siteAssetId = "",
			modelVersionStageId = "",
			modelVersionZoneId = "",
			startDate = "",
			endDate = "",
		}) => {
			setIsloading(true);
			const response = await getConditionMonitoring({
				modelVersionTaskQuestionId,
				siteAssetId,
				modelVersionStageId,
				modelVersionZoneId,
				startDate,
				endDate,
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

		if (selectedConditionMonitoringQuestions?.id) {
			await fetchConditionMonitoring({
				modelVersionTaskQuestionId:
					selectedConditionMonitoringQuestions?.modelVersionTaskQuestionID,
				siteAssetId: selectedModelAssetAvailable?.id,
				modelVersionStageId:
					selectedConditionMonitoringQuestions?.modelVersionStageID,
				modelVersionZoneId:
					selectedConditionMonitoringQuestions?.modelVersionZoneID
						? selectedConditionMonitoringQuestions?.modelVersionZoneID
						: "",
				startDate: formattedCustomDate?.fromDate,
				endDate: formattedCustomDate?.toDate,
			});
		}
		handleCloseCustomDate();
	};

	const subTitle = `${
		selectedTimeframe?.id
			? selectedTimeframe?.id === 5
				? `From ${changeDate(customDate?.from)} To ${changeDate(
						customDate?.to
				  )}`
				: selectedTimeframe?.name
			: `All Dates`
	} ${
		selectedDepartment?.id
			? selectedDepartment?.name
			: "All " + customCaptions?.departmentPlural
	} ${selectedModel?.id ? selectedModel?.name : "All " + customCaptions?.model}
	${
		selectedModel?.modelTemplateType === "A"
			? selectedModelAssetAvailable?.id
				? selectedModelAssetAvailable?.name
				: "All " + customCaptions?.asset
			: ""
	} ${
		selectedModelVersionRoles?.id
			? selectedModelVersionRoles?.name
			: selectedModelVersionRoles?.id === ""
			? "All " + customCaptions?.role
			: ""
	}
    ${
			selectedModelVersionIntervals.id
				? selectedModelVersionIntervals?.name
				: selectedModelVersionIntervals?.id === ""
				? "All " + customCaptions?.interval
				: ""
		}
    `;

	const conditionMonitorData = selectedConditionMonitoringQuestions?.id
		? `${selectedConditionMonitoringQuestions?.stageName ?? ""} ${
				selectedConditionMonitoringQuestions?.zoneName ?? ""
		  } ${selectedConditionMonitoringQuestions?.taskName ?? ""}  ${
				selectedConditionMonitoringQuestions?.questionName
		  }`
		: "";

	return (
		<div className={"container"}>
			<NavDetails
				history={false}
				status={false}
				staticCrumbs={[
					{ id: 1, name: "Analytics", url: appPath + analyticsPath },
					{
						id: 2,
						name: `Condition Monitoring`,
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
									selectedTimeframe?.id === 5
										? selectedTimeframe?.fromDate
											? changeDate(selectedTimeframe?.fromDate) +
											  " - " +
											  changeDate(selectedTimeframe?.toDate)
											: selectedTimeframe?.name
										: selectedTimeframe?.name,
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
							label={`Filter by ${customCaptions?.department}`}
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
							placeholder={`Select ${customCaptions?.model}`}
							width="100%"
							onChange={(item) => onDropdownChange("model", item)}
							selectdValueToshow="name"
							selectedValue={selectedModel}
							label={`Filter by ${customCaptions?.model}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					{hasAsset && (
						<Grid item lg={3} md={6} xs={12}>
							<DyanamicDropdown
								dataSource={modelAssetAvailable}
								dataHeader={[
									{
										id: 1,
										name: `${customCaptions?.asset ?? "Asset"}`,
									},
								]}
								showHeader
								columns={[{ id: 1, name: "name" }]}
								columnsMinWidths={[140, 140, 140, 140, 140]}
								placeholder={`Select ${customCaptions?.asset}`}
								width="100%"
								onChange={(item) =>
									onDropdownChange("modelAssetAvailable", item)
								}
								selectdValueToshow="name"
								selectedValue={selectedModelAssetAvailable}
								label={`Filter by ${customCaptions?.asset}`}
								isServerSide={false}
								icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
								required={false}
								showBorderColor
							/>
						</Grid>
					)}
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={modelVersionRoles}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.role ?? "Role"}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select ${customCaptions?.role}`}
							width="100%"
							onChange={(item) => onDropdownChange("modelVersionRoles", item)}
							selectdValueToshow="name"
							selectedValue={selectedModelVersionRoles}
							label={`Filter by ${customCaptions?.role}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={modelVersionIntervals}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.interval ?? "Interval"}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select ${customCaptions?.interval}`}
							width="100%"
							onChange={(item) =>
								onDropdownChange("modelVersionIntervals", item)
							}
							selectdValueToshow="name"
							selectedValue={selectedModelVersionIntervals}
							label={`Filter by ${customCaptions?.interval}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={conditionMonitoringQuestions}
							dropDownActiveWidth="auto"
							dataHeader={serviceMonitorQuestionHeader(customCaptions, "A")}
							showHeader
							columns={[
								{ id: 1, name: "stageName" },
								{ id: 2, name: "zoneName" },
								{ id: 3, name: "taskName" },
								{ id: 4, name: "questionName" },
							]}
							placeholder={`Select ${customCaptions?.question}`}
							width="100%"
							onChange={(item) =>
								onDropdownChange("conditionMonitoringQuestions", item)
							}
							selectdValueToshow="questionName"
							selectedValue={selectedConditionMonitoringQuestions}
							label={`Filter by ${customCaptions?.question}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
			</div>
			{selectedConditionMonitoringQuestions?.id ? (
				<>
					<GraphAnalyticsTitle
						datas={crumbs}
						title={`Condition Monitoring`}
						subTitle={subTitle}
						conditionMonitorData={conditionMonitorData}
						isConditionMonitor
					/>
					{isLoading ? (
						<div className={classes.centerItem}>
							<CircularProgress size="70px" />
						</div>
					) : chartData?.length > 0 ? (
						<LineGraph
							chartData={chartData}
							crumbs={crumbs}
							line
							isLast={last}
							hasAsset={hasAsset}
							customCaptions={customCaptions}
						/>
					) : (
						<h1 className={classes.centerItem}>No data found</h1>
					)}
				</>
			) : (
				<h1 className={classes.centerItem}>
					Please select {customCaptions?.question} to load the chart.
				</h1>
			)}
		</div>
	);
};

export default ConditionMonitoringPage;
