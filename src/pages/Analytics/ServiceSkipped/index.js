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
import { makeStyles } from "tss-react/mui";

import NavDetails from "components/Elements/NavDetails";
import { analyticsPath, appPath } from "helpers/routePaths";
import {
	getModelsPublished,
	getSkippedTasksByReason,
	getSiteDepartments,
} from "services/analytics";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import GraphAnalyticsTitle from "components/Elements/Analytics/GraphAnalyticsTitle";
import BarGraphVertical from "components/Elements/Analytics/BarGraphVertical";

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
}));

const ServiceSkippedPage = () => {
	const { classes, cx } = useStyles();
	const {
		siteAppID,
		customCaptions,
		site: { siteDepartmentID, siteDepartmentName },
	} = JSON.parse(localStorage.getItem("me")) ||
	JSON.parse(sessionStorage.getItem("me"));
	const initialCrumb = [{ id: 1, name: customCaptions.skipReasonPlural }];
	const [chartData, setChartData] = useState([]);
	const [barSkipReason, setBarSkipReason] = useState({});
	const dispatch = useDispatch();
	const [crumbs, setCrumbs] = useState(initialCrumb);
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
			const response = await getSiteDepartments(siteAppID);
			if (response?.status) {
				setDepartments([{ id: "", name: "Show All" }, ...response?.data]);
			} else {
				dispatch(showError(response?.data || "Could not fetch data"));
			}
		};
		fetchData();
	}, [dispatch, siteAppID]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await getModelsPublished({
				siteDepartmentId: selectedDepartment.id,
			});

			if (response?.status) {
				setModels(
					modifyModelData([{ id: "", name: "Show All" }, ...response?.data])
				);
			} else {
				dispatch(showError(response?.data?.detail || "Could not fetch data"));
			}
		};
		fetchData();
	}, [dispatch, selectedDepartment]);

	const onDropdownChange = async (type, selectedItem) => {
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			setSelectedDepartment(selectedItem);
			setCrumbs(initialCrumb);
			setLast(false);
			setSelectedModel({ id: "", name: "Show All" });
			await fetchPlannedWorkCompliance({
				siteDepartmentId: selectedItem?.id,
				modelId: "",
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "model" && selectedItem.id !== selectedModel.id) {
			setSelectedModel(selectedItem);
			setCrumbs(initialCrumb);
			setLast(false);
			await fetchPlannedWorkCompliance({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedItem.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
		}
		if (type === "timeframe") {
			setCrumbs(initialCrumb);
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

	const fetchPlannedWorkCompliance = useCallback(
		async ({
			siteDepartmentId = "",
			modelId = "",
			startDate = "",
			endDate = "",
			roleId = "",
		}) => {
			setIsloading(true);

			const response = await getSkippedTasksByReason({
				startDate,
				endDate,
				siteDepartmentId,
				modelId,
				roleId,
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
		fetchPlannedWorkCompliance({ siteDepartmentId: siteDepartmentID });
	}, [fetchPlannedWorkCompliance, siteDepartmentID]);

	const handleBarClick = async (data, index, e) => {
		if (chartData.depth === "A") return;
		let response = null;
		setIsloading(true);

		if (chartData.depth === "R") {
			response = await getSkippedTasksByReason({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				skipReasonId: data?.id,
			});
			if (response?.status) {
				setBarSkipReason(data);
				setChartData(response?.data);
				setCrumbs([
					{ id: 1, name: data.name, depth: "R" },
					{
						id: 2,
						name:
							response?.data.depth === "M"
								? customCaptions?.model
								: customCaptions?.asset,
					},
				]);
				if (response?.data.depth === "A") setLast(true);
			}
		}

		if (chartData.depth === "M") {
			response = await getSkippedTasksByReason({
				siteDepartmentId: selectedDepartment?.id,
				modelId: data.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				skipReasonId: barSkipReason.id,
			});
			if (response?.status) {
				setChartData(response?.data);
				setLast(true);

				setCrumbs([
					{ id: 2, name: barSkipReason.name, depth: "R" },
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
		let response = null;
		let revertCrumbs = null;
		if (data.depth === "M") {
			response = await getSkippedTasksByReason({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
				skipReasonId: barSkipReason?.id,
			});
			revertCrumbs = [
				{ id: 1, name: barSkipReason.name, depth: "R" },

				{ id: 2, name: customCaptions.model },
			];
		}

		if (data.depth === "R") {
			response = await getSkippedTasksByReason({
				siteDepartmentId: selectedDepartment?.id,
				modelId: selectedModel.id,
				startDate: selectedTimeframe.fromDate,
				endDate: selectedTimeframe.toDate,
			});
			revertCrumbs = initialCrumb;
		}
		if (response?.status) {
			setChartData(response?.data);
			setCrumbs(revertCrumbs);
			setLast(false);
		} else {
			dispatch(
				showError(
					response?.data?.details || response?.data || "Could not fetch data"
				)
			);
		}
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
	return (
		<div className={"container"}>
			<NavDetails
				history={false}
				status={false}
				staticCrumbs={[
					{ id: 1, name: "Analytics", url: appPath + analyticsPath },
					{
						id: 2,
						name: `${customCaptions.service} Skipped ${customCaptions.task} Reasons`,
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
				title={`${customCaptions.service} Skipped ${customCaptions.task} Reasons`}
				subTitle={subTitle}
				afterClick={handleRevertChart}
			/>
			{isLoading ? (
				<div className={classes.titleCenter}>
					<CircularProgress size="70px" />
				</div>
			) : chartData?.data?.length > 0 ? (
				<BarGraphVertical
					chartData={chartData.data}
					crumbs={crumbs}
					handleBarClick={handleBarClick}
					isLast={last}
				/>
			) : (
				<h1 className={classes.titleCenter}>No data found</h1>
			)}
		</div>
	);
};

export default ServiceSkippedPage;
