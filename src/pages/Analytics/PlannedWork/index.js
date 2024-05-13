import PieChartPage from "components/Elements/Analytics/PieChartPage";
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
	getPlannedWorkCompliance,
	getSiteDepartments,
} from "services/analytics";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import { statusOptions } from "helpers/constants";

const defaultCustomDate = { from: "", to: "" };
const initialCrumbs = [{ id: 1, name: "Service Status" }];
const useStyles = makeStyles()((theme) => ({
	titleCenter: {
		display: "flex",
		justifyContent: "center",
		marginTop: "150px",
	},
	header: {
		marginTop: "35px",
	},
	pieCenter: {
		display: "flex",
		justifyContent: "center",
	},
}));

const PlannedWorkPage = () => {
	const { classes, cx } = useStyles();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const [pieData, setPieData] = useState([]);
	const [pieStatus, setPieStatus] = useState({});
	const [pieRole, setPieRole] = useState({});
	const dispatch = useDispatch();
	const [crumbs, setCrumbs] = useState(initialCrumbs);
	const [last, setLast] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [models, setModels] = useState([]);
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

	const getStatusName = (d) => {
		const statusName = statusOptions.find((data) => data.id === d);
		return statusName.name;
	};

	const modifyModelData = (datas) => {
		const data = datas.map((d) => {
			return {
				...d,
				name: d?.name + " " + coalesc(d?.modelName),
			};
		});
		return data;
	};

	const modifyResponseData = (datas) => {
		return {
			...datas,
			data: datas.data.map((d) => ({
				name: getStatusName(d.status),
				...d,
			})),
		};
	};

	const fetchModelData = useCallback(
		async ({ siteDepartmentId = "" }) => {
			const response = await getModelsPublished({
				siteDepartmentId,
			});

			if (response?.status) {
				setModels(
					modifyModelData([{ id: "", name: "Show All" }, ...response?.data])
				);
			} else {
				dispatch(showError(response?.data?.detail || "Could not fetch data"));
			}
		},
		[dispatch]
	);

	useEffect(() => {
		const fetchDepartmentData = async () => {
			const response = await getSiteDepartments(siteAppID);
			if (response?.status) {
				setDepartments([{ id: "", name: "Show All" }, ...response?.data]);
			} else {
				dispatch(showError(response?.data || "Could not fetch data"));
			}
		};
		fetchDepartmentData();
		fetchModelData({ siteDepartmentId: siteDepartmentID });
	}, [dispatch, fetchModelData, siteAppID, siteDepartmentID]);

	const onDropdownChange = async (type, selectedItem) => {
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			setCrumbs(initialCrumbs);
			setLast(false);
			setSelectedDepartment(selectedItem);
			setSelectedModel({ id: "", name: "Show All" });
			await fetchModelData({ siteDepartmentId: selectedItem.id });
			await fetchPlannedWorkCompliance({
				siteDepartmentId: selectedItem?.id,
				modelId: "",
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "model" && selectedItem.id !== selectedModel.id) {
			setSelectedModel(selectedItem);
			setLast(false);
			setCrumbs(initialCrumbs);
			await fetchPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedItem.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "timeframe") {
			setCrumbs(initialCrumbs);
			setLast(false);
			if (selectedItem.id === 5) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);

				await fetchPlannedWorkCompliance({
					siteDepartmentId: selectedDepartment?.id,
					modelId: selectedModel.id,
					startDate: selectedItem.fromDate,
					endDate: selectedItem.toDate,
				});
			}
		}
	};

	const fetchPlannedWorkCompliance = useCallback(
		async ({
			siteDepartmentId = "",
			modelId = "",
			startDate = "",
			endDate = "",
			roleId = "",
		}) => {
			setIsloading(true);
			const response = await getPlannedWorkCompliance({
				startDate,
				endDate,
				siteDepartmentId,
				modelId,
				roleId,
			});
			if (response?.status) {
				setPieData(modifyResponseData(response?.data));
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
		fetchPlannedWorkCompliance({ siteDepartmentId: siteDepartmentID });
	}, [fetchPlannedWorkCompliance, siteDepartmentID]);

	const handlePieClick = async (data, index, e) => {
		if (pieData.depth === "A") return;
		let response = null;
		setIsloading(true);

		if (pieData.depth === "S") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				status: data?.status,
			});
			if (response?.status) {
				setPieStatus(data);
				setPieData(response?.data);
				setCrumbs([
					{ id: 1, name: data.name, depth: "S" },
					{
						id: 2,
						name:
							response?.data?.depth === "R"
								? customCaptions.role
								: response?.data.depth === "M"
								? customCaptions.model
								: customCaptions.asset,
					},
				]);
				if (response?.data?.depth === "A") setLast(true);
			}
		}

		if (pieData.depth === "R") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				roleId: data?.id,
				status: pieStatus.name,
			});
			if (response?.status) {
				setPieRole(data);
				setPieData(response?.data);
				setCrumbs([
					{ id: 1, name: pieStatus.name, depth: "S" },
					{ id: 2, name: data.name, depth: "R" },
					{
						id: 3,
						name:
							response?.data?.depth === "M"
								? customCaptions.model
								: customCaptions.asset,
					},
				]);
				if (response?.data?.depth === "A") setLast(true);
			}
		}
		if (pieData.depth === "M") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: data.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				roleId: pieRole.id,
				status: pieStatus.name,
			});
			if (response?.status) {
				setPieData(response?.data);
				setLast(true);
				setCrumbs([
					{ id: 1, name: pieStatus.name, depth: "S" },
					{ id: 2, name: pieRole.name, depth: "R" },
					{ id: 3, name: data.name, depth: "M" },
					{ id: 4, name: customCaptions.asset },
				]);
			}
		}
		if (!response?.status) {
			dispatch(
				showError(
					response?.data?.details || response?.data || "Could not fetch data"
				)
			);
		}

		setIsloading(false);
	};

	const handleRevertChart = async (data) => {
		setIsloading(true);
		let response = null;
		if (data.depth === "M") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				roleId: pieRole?.id,
				status: pieStatus.name,
			});
			if (response?.status) {
				setLast(false);
				setPieData(response?.data);
				setCrumbs([
					{ id: 1, name: pieStatus.name, depth: "S" },
					{ id: 2, name: pieRole.name, depth: "R" },
					{ id: 3, name: customCaptions.model },
				]);
			}
		}

		if (data.depth === "R") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				status: pieStatus?.status,
			});
			if (response?.status) {
				setLast(false);
				setPieData(response?.data);
				setCrumbs([
					{ id: 1, name: pieStatus.name, depth: "S" },
					{ id: 2, name: customCaptions.role },
				]);
			}
		}
		if (data.depth === "S") {
			response = await getPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
			if (response?.status) {
				setLast(false);
				setPieData(modifyResponseData(response?.data));
				setCrumbs(initialCrumbs);
			}
		}
		if (!response?.status) {
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

		await fetchPlannedWorkCompliance({
			siteDepartmentId: selectedDepartment?.id,
			modelId: selectedModel.id,
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
	}   ${
		selectedDepartment?.id
			? selectedDepartment?.name
			: ` All ` + customCaptions?.departmentPlural
	}   ${
		selectedModel?.id
			? selectedModel?.name
			: ` All ` + customCaptions?.modelPlural
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
						name: `Planned Work Compliance`,
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
				title={`Planned Work Compliance`}
				subTitle={subTitle}
				afterClick={handleRevertChart}
			/>
			{isLoading ? (
				<div className={classes.titleCenter}>
					<CircularProgress size="70px" />
				</div>
			) : pieData?.data?.length > 0 ? (
				<div className={classes.pieCenter}>
					<PieChartPage
						data={pieData.data}
						handleClick={handlePieClick}
						isLast={last}
					/>
				</div>
			) : (
				<h1 className={classes.titleCenter}>No data found</h1>
			)}
		</div>
	);
};

export default PlannedWorkPage;
