import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { defaultTimeframe } from "constants/serviceDetails";
import { filterByDateOptions } from "constants/Analytics";
import {
	coalesc,
	convertDateToUTC,
	customFromattedDate,
	toRoundoff,
} from "helpers/utils";
import CustomDateRange from "pages/Services/ServiceLists/CustomDateRange";
import FilterListIcon from "@mui/icons-material/FilterList";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { changeDate } from "helpers/date";
import { CircularProgress, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getSiteDepartments,
	getModelAssetsAvailable,
	getModelVersionRoles,
	getModelVersionIntervals,
	getAverageTimes,
} from "services/analytics";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import MultiBarVertical from "components/Elements/Analytics/MultiBarVertical";
import MultiBarHorizontal from "components/Elements/Analytics/MultiBarHorizontal";

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

const ServiceAverageTimesPage = () => {
	const { classes, cx } = useStyles();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));

	const depthNames = {
		S: customCaptions?.stagePlural,
		Z: customCaptions?.zonePlural,
		T: customCaptions?.taskPlural,
	};

	const initialCrumb = [{ id: 1, name: `${customCaptions?.stagePlural}` }];
	const [chartData, setChartData] = useState([]);
	const dispatch = useDispatch();
	const [crumbs, setCrumbs] = useState(initialCrumb);
	const [last, setLast] = useState(false);
	const [isTask, setIsTask] = useState(false);
	const [stage, setStage] = useState(null);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);

	const [modelAssetAvailable, setModelAssetAvailable] = useState([]);
	const [modelVersionRoles, setModelVersionRoles] = useState([]);
	const [modelVersionIntervals, setModelVersionIntervals] = useState([]);

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
		if (selectedModel?.modelTemplateType === "A") {
			const fetchData = async () => {
				const modelAssetsAvailableResponse = await getModelAssetsAvailable({
					modelId: selectedModel?.id,
				});
				if (modelAssetsAvailableResponse?.status) {
					setModelAssetAvailable(
						modelAssetsAvailableResponse?.data.map((d) => ({
							...d,
							id: d?.siteAssetID,
						}))
					);
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
	}, [dispatch, selectedModel]);

	useEffect(() => {
		if (selectedModel?.id) {
			const fetchData = async () => {
				const modelVersionRolesResponse = await getModelVersionRoles({
					modelVersionId: selectedModel?.activeModelVersionID,
				});
				if (modelVersionRolesResponse?.status) {
					setModelVersionRoles([...modelVersionRolesResponse?.data]);
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
					setModelVersionIntervals(modelVersionIntervalsResponse?.data);
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

	const onDropdownChange = async (type, selectedItem) => {
		if (type === "department" && selectedItem?.id !== selectedDepartment?.id) {
			setSelectedDepartment(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setIsTask(false);
			setSelectedModel({});
			setSelectedModelAssetAvailable({});
			setSelectedModelVersionRoles({});
			setSelectedModelVersionIntervals({});
		}
		if (type === "model" && selectedItem?.id !== selectedModel?.id) {
			setSelectedModel(selectedItem);
			setLast(false);
			setCrumbs(initialCrumb);
			setIsTask(false);
			setSelectedModelAssetAvailable({});
			setSelectedModelVersionRoles({});
			setSelectedModelVersionIntervals({});
			// await fetchServiceAverageTimes({
			// 	modelVersionId: selectedItem?.activeModelVersionID,
			// 	startDate: selectedTimeframe?.fromDate,
			// 	endDate: selectedTimeframe?.toDate,
			// });
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
			setIsTask(false);
			setCrumbs(initialCrumb);
			if (selectedModel?.id && selectedModelVersionRoles?.id) {
				await fetchServiceAverageTimes({
					modelVersionId: selectedModel?.activeModelVersionID,
					siteAssetId: selectedItem?.id,
					modelVersionRoleId: selectedModelVersionRoles?.id,
					modelVersionIntervalId: selectedModelVersionIntervals?.id,
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
			setIsTask(false);
			setCrumbs(initialCrumb);
			await fetchServiceAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id,
				modelVersionRoleId: selectedItem?.id,
				modelVersionIntervalId: selectedModelVersionIntervals?.id,
				startDate: selectedTimeframe?.fromDate,
				endDate: selectedTimeframe?.toDate,
			});
		}
		if (
			type === "modelVersionIntervals" &&
			selectedItem?.id !== selectedModelVersionIntervals?.id
		) {
			setSelectedModelVersionIntervals(selectedItem);
			setLast(false);
			setIsTask(false);
			setCrumbs(initialCrumb);
			if (selectedModel?.id && selectedModelVersionRoles?.id) {
				await fetchServiceAverageTimes({
					modelVersionId: selectedModel?.activeModelVersionID,
					siteAssetId: selectedModelAssetAvailable?.id,
					modelVersionRoleId: selectedModelVersionRoles?.id,
					modelVersionIntervalId: selectedItem?.id,
					startDate: selectedTimeframe?.fromDate,
					endDate: selectedTimeframe?.toDate,
				});
			}
		}
		if (type === "timeframe") {
			setCrumbs(initialCrumb);
			setLast(false);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
				setIsloading(false);
			} else {
				setIsTask(false);
				setSelectedTimeframe(selectedItem);
				if (selectedModel?.id && selectedModelVersionRoles?.id) {
					await fetchServiceAverageTimes({
						modelVersionId: selectedModel?.activeModelVersionID,
						siteAssetId: selectedModelAssetAvailable?.id,
						modelVersionRoleId: selectedModelVersionRoles?.id,
						modelVersionIntervalId: selectedModelVersionIntervals?.id,
						startDate: selectedItem.fromDate,
						endDate: selectedItem.toDate,
					});
				}
			}
		}
	};

	const modifyChartData = (chartData) => {
		return {
			...chartData,
			data: chartData?.data.map((d) => {
				return {
					...d,
					actualMinutes: toRoundoff(d.actualMinutes),
					estimatedMinutes: toRoundoff(d.estimatedMinutes),
				};
			}),
		};
	};

	const fetchServiceAverageTimes = useCallback(
		async ({
			modelVersionId = "",
			siteAssetId = "",
			modelVersionRoleId = "",
			modelVersionIntervalId = "",
			modelVersionStageId = "",
			modelVersionZoneId = "",
			startDate = "",
			endDate = "",
		}) => {
			setIsloading(true);
			const response = await getAverageTimes({
				siteAssetId,
				modelVersionStageId,
				modelVersionZoneId,
				modelVersionRoleId,
				modelVersionId,
				modelVersionIntervalId,
				startDate,
				endDate,
			});
			if (response?.status) {
				setChartData(modifyChartData(response?.data));
			} else {
				dispatch(
					showError(
						response?.data?.details ||
							response?.data?.title ||
							response?.data ||
							"Could not fetch data"
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

		if (selectedModel?.id && selectedModelVersionRoles?.id) {
			setIsTask(false);
			await fetchServiceAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id,
				modelVersionRoleId: selectedModelVersionRoles?.id,
				modelVersionIntervalId: selectedModelVersionIntervals?.id,
				startDate: formattedCustomDate?.fromDate,
				endDate: formattedCustomDate?.toDate,
			});
		}
		handleCloseCustomDate();
	};

	const handleBarClick = async (data, index, e) => {
		if (chartData.depth === "T") return;

		let response = null;

		if (chartData.depth === "S") {
			response = await getAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id
					? selectedModelAssetAvailable?.id
					: "",
				modelVersionRoleId: selectedModelVersionRoles?.id,
				modelVersionIntervalId: selectedModelVersionIntervals?.id
					? selectedModelVersionIntervals?.id
					: "",
				startDate: selectedTimeframe?.fromDate
					? selectedTimeframe?.fromDate
					: "",
				endDate: selectedTimeframe?.toDate ? selectedTimeframe?.toDate : "",
				modelVersionStageId: data?.payload?.id ? data?.payload?.id : "",
			});
			if (response?.status) {
				setStage(data);
				setCrumbs([
					{ id: 1, name: data?.payload?.name, depth: "S" },
					{
						id: 2,
						name:
							response?.data?.depth === "T"
								? customCaptions?.taskPlural
								: customCaptions?.zonePlural,
					},
				]);
			}
		}
		if (chartData.depth === "Z") {
			response = await getAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id
					? selectedModelAssetAvailable?.id
					: "",
				modelVersionRoleId: selectedModelVersionRoles?.id
					? selectedModelVersionRoles?.id
					: "",
				modelVersionIntervalId: selectedModelVersionIntervals?.id
					? selectedModelVersionIntervals?.id
					: "",
				startDate: selectedTimeframe?.fromDate
					? selectedTimeframe?.fromDate
					: "",
				endDate: selectedTimeframe?.toDate ? selectedTimeframe?.toDate : "",
				modelVersionStageId: stage?.id ? stage?.id : "",
				modelVersionZoneId: data?.payload?.id ?? "",
			});
			if (response.status) {
				setCrumbs([
					{ id: 1, name: stage?.name, depth: "S" },
					{ id: 2, name: data?.payload?.name, depth: "Z" },
					{ id: 3, name: customCaptions?.taskPlural },
				]);
			}
		}
		if (response?.status) {
			if (response?.data?.depth === "T") setIsTask(true);
			setChartData(modifyChartData(response?.data));
		} else {
			dispatch(
				showError(
					response?.data?.details ||
						response?.data?.title ||
						"Could not fetch data"
				)
			);
		}
	};

	const handleRevertChart = async (data) => {
		let response = null;
		if (data.depth === "S") {
			response = await getAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id
					? selectedModelAssetAvailable?.id
					: "",
				modelVersionRoleId: selectedModelVersionRoles?.id
					? selectedModelVersionRoles?.id
					: "",
				modelVersionIntervalId: selectedModelVersionIntervals?.id
					? selectedModelVersionIntervals?.id
					: "",
				startDate: selectedTimeframe?.fromDate
					? selectedTimeframe?.fromDate
					: "",
				endDate: selectedTimeframe?.toDate ? selectedTimeframe?.toDate : "",
			});
			setCrumbs([{ id: 1, name: customCaptions.stagePlural, depth: "S" }]);
		}
		if (data.depth === "Z") {
			response = await getAverageTimes({
				modelVersionId: selectedModel?.activeModelVersionID,
				siteAssetId: selectedModelAssetAvailable?.id
					? selectedModelAssetAvailable?.id
					: "",
				modelVersionRoleId: selectedModelVersionRoles?.id
					? selectedModelVersionRoles?.id
					: "",
				modelVersionIntervalId: selectedModelVersionIntervals?.id
					? selectedModelVersionIntervals?.id
					: "",
				startDate: selectedTimeframe?.fromDate
					? selectedTimeframe?.fromDate
					: "",
				endDate: selectedTimeframe?.toDate ? selectedTimeframe?.toDate : "",
				modelVersionStageId: stage?.id ? stage?.id : "",
			});
			setCrumbs([
				{ id: 1, name: stage?.name, depth: "S" },
				{ id: 2, name: customCaptions.zonePlural, depth: "Z" },
			]);
		}
		if (response?.status) {
			setChartData(modifyChartData(response?.data));
			setIsTask(false);
		} else {
			dispatch(
				showError(
					response?.data?.details ||
						response?.data?.title ||
						"Could not fetch data"
				)
			);
		}
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
		selectedModelVersionRoles?.id
			? selectedModelVersionRoles?.name
			: selectedModelVersionRoles?.id === ""
			? "All " + customCaptions?.role
			: ""
	}
	${
		selectedModel?.modelTemplateType === "A"
			? selectedModelAssetAvailable?.id
				? selectedModelAssetAvailable?.name
				: ""
			: ""
	} 
    ${
			selectedModelVersionIntervals.id
				? selectedModelVersionIntervals?.name
				: ""
		}
    `;

	return (
		<div className={"container"}>
			<NavDetails
				history={false}
				status={false}
				staticCrumbs={[
					{ id: 1, name: "Analytics", url: appPath + analyticsPath },
					{
						id: 2,
						name: `${customCaptions.service} Average Times`,
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
							required={true}
							showBorderColor
						/>
					</Grid>

					<Grid item xl={3} lg={3} md={6} xs={12}>
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
							required={true}
							showBorderColor
						/>
					</Grid>
					{selectedModel?.modelTemplateType === "A" && (
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
				</Grid>
			</div>
			{selectedModel?.id && selectedModelVersionRoles?.id ? (
				<>
					<GraphAnalyticsTitle
						datas={crumbs}
						title={`${customCaptions.service} Average Times`}
						subTitle={subTitle}
						afterClick={handleRevertChart}
					/>
					{isLoading ? (
						<div className={classes.centerItem}>
							<CircularProgress size="70px" />
						</div>
					) : chartData?.data?.length > 0 ? (
						isTask ? (
							<MultiBarVertical
								chartData={chartData}
								crumbs={crumbs}
								depthName={depthNames[chartData?.depth]}
								isLast={last}
								customCaptions={customCaptions}
								handleBarClick={handleBarClick}
							/>
						) : (
							<MultiBarHorizontal
								chartData={chartData}
								crumbs={crumbs}
								depthName={depthNames[chartData?.depth]}
								isLast={last}
								customCaptions={customCaptions}
								handleBarClick={handleBarClick}
							/>
						)
					) : (
						<h1 className={classes.centerItem}>No data found</h1>
					)}
				</>
			) : (
				<h1 className={classes.centerItem}>
					Please select {customCaptions?.model} and {customCaptions?.role} to
					load the chart.
				</h1>
			)}
		</div>
	);
};

export default ServiceAverageTimesPage;
