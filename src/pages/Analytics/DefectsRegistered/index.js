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
import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getSiteDepartments,
	getDefectRiskRatings,
	getDefectsRegistered,
	getDefectTypes,
} from "services/analytics";
import { useDispatch } from "react-redux";
import BarGraphVertical from "components/Elements/Analytics/BarGraphVertical";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import { defectStatusTypes } from "helpers/constants";
import { makeStyles } from "tss-react/mui";
import GeneralButton from "components/Elements/GeneralButton";
import { useNavigate } from "react-router-dom";
import { setAnalyticsShowData, showError } from "redux/common/actions";
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

const DefectsRegisteredPage = () => {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const initialCrumb = [
		{
			id: 1,
			name: `${customCaptions.asset}`,
		},
	];
	const [chartData, setChartData] = useState([]);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);
	const [riskRatings, setRiskRatings] = useState([]);
	const [crumbs, setCrumbs] = useState(initialCrumb);
	const [isLoading, setIsloading] = useState(true);
	const [customDate, setCustomDate] = useState(defaultCustomDate);
	const [defectTypes, setDefectTypes] = useState([]);
	const defectStatusType = [
		{ id: "", name: "Show All" },
		{ id: defectStatusTypes[0]?.value, name: defectStatusTypes[0]?.label },
		{ id: defectStatusTypes[1]?.value, name: defectStatusTypes[1]?.label },
	];
	const notificationRaised = [
		{ id: "", name: "Show All" },
		{ id: true, name: "Assigned" },
		{ id: false, name: "Unassigned" },
	];
	const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
	const [selectedModel, setSelectedModel] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedDepartment, setSelectedDepartment] = useState({
		id: siteDepartmentID,
		name: siteDepartmentName,
	});
	const [selectedDefect, setSelectedDefect] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedDefectStatusType, setSelectedDefectStatusType] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedNotificationRaised, setSelectedNotificationRaised] = useState({
		id: "",
		name: "Show All",
	});
	const [selectedRating, setSelectedRating] = useState({
		id: "",
		name: "Show All",
	});

	//state from analytics page
	const defaultValue = {
		id: "",
		name: "Show All",
	};
	const [showData, setShowData] = useState({
		department: {
			id: siteDepartmentID,
			name: siteDepartmentName,
		},
		timeframe: defaultValue,
		model: defaultValue,
		riskRatings: defaultValue,
		defectType: defaultValue,
		defectStatus: defaultValue,
		defectWorkOrder: defaultValue,
		defectSystem: defaultValue,
	});
	//navigate
	const navigate = useNavigate();
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
			const [
				siteDepartmentsResponse,
				defectRiskRatingsResponse,
				defectTypesResponse,
			] = await Promise.all([
				getSiteDepartments(siteAppID),
				getDefectRiskRatings(),
				getDefectTypes(),
			]);

			if (
				siteDepartmentsResponse?.status &&
				defectRiskRatingsResponse?.status &&
				defectTypesResponse?.status
			) {
				setDepartments([
					{ id: "", name: "Show All" },
					...siteDepartmentsResponse?.data,
				]);
				setRiskRatings([
					{ id: "", name: "Show All" },
					...defectRiskRatingsResponse?.data,
				]);
				setDefectTypes([
					{ id: "", name: "Show All" },
					...defectTypesResponse?.data,
				]);
			} else {
				dispatch(
					showError(
						siteDepartmentsResponse?.data?.detail ||
							defectRiskRatingsResponse?.data?.detail ||
							defectTypesResponse?.data?.detail ||
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
			setCrumbs(initialCrumb);
			setSelectedDepartment(selectedItem);
			setSelectedModel({ id: "", name: "Show All" });
			setShowData({
				...showData,
				department: selectedItem,
				model: null,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedDefect?.id,
				siteDepartmentID: selectedItem?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: "",
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedNotificationRaised.id,
			});
		}
		if (type === "model" && selectedItem.id !== selectedModel.id) {
			setCrumbs(initialCrumb);
			setSelectedModel(selectedItem);
			setShowData({
				...showData,
				model: selectedItem,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedDefect?.id,
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedItem.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedNotificationRaised.id,
			});
		}
		if (type === "riskRatings" && selectedItem.id !== selectedRating.id) {
			setCrumbs(initialCrumb);
			setSelectedRating(selectedItem);
			setShowData({
				...showData,
				riskRatings: selectedItem,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedDefect?.id,
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedItem.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedNotificationRaised.id,
			});
		}
		if (type === "defectTypes" && selectedItem.id !== selectedDefect.id) {
			setCrumbs(initialCrumb);
			setSelectedDefect(selectedItem);
			setShowData({
				...showData,
				defectType: selectedItem,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedNotificationRaised.id,
			});
		}
		if (
			type === "defectStatusType" &&
			selectedItem.id !== selectedDefectStatusType.id
		) {
			setCrumbs(initialCrumb);
			setSelectedDefectStatusType(selectedItem);
			setShowData({
				...showData,
				defectStatus: selectedItem,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedDefect?.id,
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedItem.id,
				notificationRaised: selectedNotificationRaised.id,
			});
		}
		if (
			type === "notificationRaised" &&
			selectedItem.id !== selectedNotificationRaised.id
		) {
			setCrumbs(initialCrumb);
			setSelectedNotificationRaised(selectedItem);
			setShowData({
				...showData,
				defectWorkOrder: selectedItem?.name ? selectedItem : null,
			});
			await fetchDefectsRegistered({
				defectTypeId: selectedDefect?.id,
				siteDepartmentID: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedItem.id,
			});
		}
		if (type === "timeframe") {
			setCrumbs(initialCrumb);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);
				setShowData({
					...showData,
					timeframe: selectedItem,
				});
				await fetchDefectsRegistered({
					defectTypeId: selectedDefect?.id,
					siteDepartmentID: selectedDepartment?.id,
					defectRiskRatingId: selectedRating.id,
					modelId: selectedModel.id,
					startDate: selectedItem.fromDate,
					endDate: selectedItem.toDate,
					defectStatusType: selectedDefectStatusType.id,
					notificationRaised: selectedNotificationRaised.id,
				});
			}
		}
	};

	const fetchDefectsRegistered = useCallback(
		async ({
			defectTypeId = "",
			siteDepartmentID = "",
			modelId = "",
			startDate = "",
			endDate = "",
			defectRiskRatingId = "",
			defectStatusType = "",
			notificationRaised = "",
		}) => {
			setIsloading(true);
			const response = await getDefectsRegistered({
				defectTypeId,
				startDate,
				endDate,
				defectRiskRatingId,
				siteDepartmentId: siteDepartmentID,
				modelId,
				defectStatusType,
				notificationRaised,
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
		fetchDefectsRegistered({ siteDepartmentID });
		if (siteDepartmentID) {
			setShowData({
				...showData,
				department: selectedDepartment,
			});
		}
	}, [fetchDefectsRegistered, siteDepartmentID]);

	const handleBarClick = async (data) => {
		if (chartData.depth === "A") {
			return;
		}
		setIsloading(true);

		let response = null;

		if (chartData.depth === "S") {
			response = await getDefectsRegistered({
				siteDepartmentId: selectedDepartment?.id,
				defectRiskRatingId: selectedRating.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				defectSystemId: data.id,
				defectStatusType: selectedDefectStatusType.id,
				notificationRaised: selectedNotificationRaised.id,
			});
			if (response?.data) {
				setChartData(response?.data);

				setCrumbs([
					{
						id: 1,
						name: "Registered",
						depth: "S",
					},
					{
						id: 2,
						name: data.name,
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
		const response = await getDefectsRegistered({
			defectTypeId: selectedDefect?.id,
			siteDepartmentId: selectedDepartment?.id,
			defectRiskRatingId: selectedRating.id,
			modelId: selectedModel.id,
			startDate: selectedTimeframe.fromDate,
			endDate: selectedTimeframe.toDate,
			defectStatusType: selectedDefectStatusType.id,
			notificationRaised: selectedNotificationRaised.id,
		});
		if (response?.data) {
			setChartData(response?.data);
			setCrumbs([{ id: 1, name: "Registered" }]);
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
		setShowData({
			...showData,
			timeframe: {
				...selectedTimeframe,
				...formattedCustomDate,
				name: "Customized Date",
				id: 7,
			},
		});
		await fetchDefectsRegistered({
			defectTypeId: selectedDefect?.id,
			siteDepartmentID: selectedDepartment?.id,
			defectRiskRatingId: selectedRating.id,
			modelId: selectedModel?.id,
			startDate: formattedCustomDate.fromDate,
			endDate: formattedCustomDate.toDate,
			defectStatusType: selectedDefectStatusType.id,
			notificationRaised: selectedNotificationRaised.id,
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
	} ${selectedModel.id ? selectedModel.name : "All " + customCaptions.model} ${
		selectedRating.id
			? selectedRating.name
			: "All " + customCaptions.riskRatingPlural
	} ${
		selectedDefect.id
			? selectedDefect.name
			: "All " + customCaptions.defectTypePlural
	} ${
		selectedDefectStatusType.id
			? selectedDefectStatusType.name
			: "All " + customCaptions.defectStatus + " Type"
	} ${
		selectedNotificationRaised.id
			? selectedNotificationRaised.name
			: "All " + customCaptions.defectWorkOrder
	}`;

	const handleShowButton = () => {
		window.open("/app/defects");
		localStorage.setItem(
			"analyticaData",
			JSON.stringify({ data: showData, isRedirected: true })
		);
		setTimeout(() => {
			window.location.reload();
		}, 0);
		// dispatch(setAnalyticsShowData({ data: showData, state: true }));
	};
	return (
		<div className={"container"}>
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					history={false}
					status={false}
					staticCrumbs={[
						{ id: 1, name: "Analytics", url: appPath + analyticsPath },
						{
							id: 2,
							name: `${
								customCaptions.defectPlural
									? customCaptions.defectPlural
									: "Defects"
							}  Registered`,
						},
					]}
				/>
				<GeneralButton
					style={{ background: "#ED8738", width: "200px" }}
					onClick={handleShowButton}
					disabled={!Object.keys(showData).length}
				>
					Show Data
				</GeneralButton>
			</div>

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
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={defectTypes}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.defect} ${
										customCaptions?.type ? customCaptions?.type : "Type"
									}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select Defect Type`}
							width="100%"
							onChange={(item) => onDropdownChange("defectTypes", item)}
							selectdValueToshow="name"
							selectedValue={selectedDefect}
							label={`Filter by ${customCaptions?.defect} ${
								customCaptions?.type ? customCaptions?.type : "Type"
							}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={defectStatusType}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.defectStatus} ${
										customCaptions?.type ? customCaptions?.type : "Type"
									}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select Defect Status Type`}
							width="100%"
							onChange={(item) => onDropdownChange("defectStatusType", item)}
							selectdValueToshow="name"
							selectedValue={selectedDefectStatusType}
							label={`Filter by ${customCaptions?.defectStatus} ${
								customCaptions?.type ? customCaptions?.type : "Type"
							}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={notificationRaised}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.defectWorkOrder}`,
								},
							]}
							showHeader
							columns={[{ id: 1, name: "name" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							placeholder={`Select Defect Work Order`}
							width="100%"
							onChange={(item) => onDropdownChange("notificationRaised", item)}
							selectdValueToshow="name"
							selectedValue={selectedNotificationRaised}
							label={`Filter by ${customCaptions?.defectWorkOrder}`}
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
				title={`${
					customCaptions.defectPlural ? customCaptions.defectPlural : "Defects"
				} Registered`}
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
					isLast={true}
				/>
			) : (
				<h1 className={classes.centerItem}>No data found</h1>
			)}
		</div>
	);
};

export default DefectsRegisteredPage;
