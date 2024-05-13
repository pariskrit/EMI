import { Grid, LinearProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
	Label,
	ResponsiveContainer,
} from "recharts";
import { makeStyles } from "tss-react/mui";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import {
	handleSort,
	isoDateWithoutTimeZone,
	sortFromDate,
} from "helpers/utils";
import { showError } from "redux/common/actions";
import {
	getConditionMonitorGraphDetail,
	getConditionMonitorQuestion,
} from "services/services/serviceConditionMonitor";
import ColourConstants from "helpers/colourConstants";
import {
	serviceMonitorQuestionCols,
	serviceMonitorQuestionHeader,
} from "constants/serviceDetails";
import GraphTitle from "components/Modules/GraphTitle";
import { changeDate } from "helpers/date";
import CustomGraphDot from "components/Elements/ConditionalMonitoring/CustomGraphDot";
import CustomGraphActiveDot from "components/Elements/ConditionalMonitoring/CustomGraphActiveDot";

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},

	customDotHoverModal: {
		border: "1px solid #bdbdbd",
		backgroundColor: "#ffffff",
		borderRadius: "1px",
		padding: "12px 14px",
	},
	customDotHoverModalInnerDiv: {
		display: "flex",
		justifyContent: "start",
		alignItems: "start",
		gap: "4px",
		color: ColourConstants.orange,
		fontSize: "15px",
		padding: "0 2px",
	},

	muiIconStyle: {
		"&.MuiSvgIcon-root ": {},
	},
}));

function ConditionMonitor({ customCaptions, serviceId, state }) {
	//init hooks
	const dispatch = useDispatch();
	const { classes } = useStyles();

	// init state
	const [selectedQuestion, setSelectedQuestion] = useState({});
	const [grapghDetail, setGraphDetail] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [tooltipPosition, settooltipPosition] = useState({
		active: false,
	});

	// side effect fetching chart details when question from dropdown is selected
	useEffect(() => {
		if (selectedQuestion.id) {
			const fetchGraphDetails = async () => {
				setLoading(true);
				try {
					const response = await getConditionMonitorGraphDetail(
						serviceId,
						selectedQuestion.id
					);
					if (response.status) {
						setGraphDetail(sortFromDate(response.data, "date"));
					} else {
						dispatch(
							showError(
								response?.data?.detail || "Failed to fetch Graph Details"
							)
						);
					}
				} catch (error) {
					dispatch(
						showError(error?.data?.detail || "Failed to fetch Graph Details")
					);
				} finally {
					setLoading(false);
				}
			};
			fetchGraphDetails();
		}
	}, [selectedQuestion, serviceId, dispatch]);

	const dateFormatter = (date) => {
		return changeDate(new Date(new Date(date)));
	};

	const CustomToolTIp = (val) => {
		const { active, payload } = val;
		if (active && payload && payload.length) {
			return (
				<>
					<div className={classes.customDotHoverModal}>
						{payload.map((item) => (
							<>
								<div>
									{isoDateWithoutTimeZone(
										new Date(new Date(item?.payload.date))
									)}
								</div>
								{!item?.payload.defects[0] && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>Value</span> :
										<span>{item?.payload.valueNumeric}</span>
									</div>
								)}
								{item?.payload.defects[0]?.number && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>
											{customCaptions?.defect ?? "Defect"}&nbsp;
											{customCaptions?.number ?? "Number"}
										</span>
										:<span>{item?.payload.defects[0]?.number}</span>
									</div>
								)}
								{item?.payload.defects[0]?.defectStatusName && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>
											{customCaptions?.defectStatus ?? " Defect Status"}
										</span>
										:<span>{item?.payload.defects[0]?.defectStatusName}</span>
									</div>
								)}
								{item?.payload.defects[0]?.defectTypeName && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>{customCaptions?.defectType ?? " Defect Type"}</span>:
										<span>{item?.payload.defects[0]?.defectTypeName}</span>
									</div>
								)}
								{item?.payload.defects[0]?.defectRiskRatingName && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>
											{customCaptions?.defect ?? "Defect"}&nbsp;
											{customCaptions?.riskRating ?? " Risk Rating"}
										</span>
										:
										<span>
											{item?.payload.defects[0]?.defectRiskRatingName}
										</span>
									</div>
								)}
								{item?.payload.defects[0]?.defectDetail && (
									<div className={classes.customDotHoverModalInnerDiv}>
										<span>
											{customCaptions?.defect ?? "Defect"}&nbsp;
											{customCaptions?.detail ?? "Detail"}
										</span>
										:<span>{item?.payload.defects[0]?.defectDetail}</span>
									</div>
								)}
							</>
						))}
					</div>
				</>
			);
		}
	};

	// console.log(customCaptions);
	return (
		<div style={{ marginTop: "25px" }}>
			{isLoading && <LinearProgress className={classes.loading} />}
			<Grid container spacing={2}>
				<Grid item md={6} xs={12} lg={3}>
					<DyanamicDropdown
						isServerSide={false}
						dropDownActiveWidth="auto"
						width="100%"
						placeholder="Select Question"
						dataHeader={serviceMonitorQuestionHeader(
							customCaptions,
							state.serviceDetail?.modelTemplateType
						)}
						columns={serviceMonitorQuestionCols(
							state.serviceDetail?.modelTemplateType
						)}
						showHeader
						selectedValue={selectedQuestion}
						handleSort={handleSort}
						onChange={(val) => {
							setSelectedQuestion(val);
						}}
						selectdValueToshow={"question"}
						label={"Question"}
						fetchData={() => getConditionMonitorQuestion(serviceId)}
					/>
				</Grid>
			</Grid>
			{selectedQuestion.id && (
				<Grid container spacing={0}>
					<Grid item lg={12} md={12} xs={12}>
						<div style={{ height: "60vh", width: "94vw" }}>
							<GraphTitle
								modelName={
									state?.serviceDetail?.model
										? state?.serviceDetail?.modelName +
										  " " +
										  state?.serviceDetail?.model
										: state?.serviceDetail?.modelName
								}
								questionName={selectedQuestion?.question}
								stageName={selectedQuestion?.stageName}
								zoneName={selectedQuestion?.zoneName}
								taskName={selectedQuestion?.taskName}
								asset={
									state?.serviceDetail?.modelTemplateType === "F"
										? selectedQuestion?.siteAssetName
										: state?.serviceDetail?.siteAssetName
								}
							/>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									width={500}
									height={500}
									data={grapghDetail.map((x) => ({
										...x,
										date: +new Date(x.date + "Z").getTime(),
										value: x.valueNumeric,
									}))}
									margin={{
										top: 20,
										right: 20,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis
										dataKey="date"
										hasTick
										scale="time"
										type="number"
										domain={["dataMin", "dataMax"]}
										tickFormatter={dateFormatter}
										padding={{ left: 30, right: 30 }}
									/>
									<YAxis hasTick padding={{ top: 30, bottom: 30 }} />
									<Tooltip
										formatter={(value) => [value, "value"]}
										labelFormatter={(val) =>
											isoDateWithoutTimeZone(new Date(new Date(val)))
										}
										wrapperStyle={{
											opacity: tooltipPosition?.active ? 1 : 0,
										}}
										content={CustomToolTIp}
									/>
									<ReferenceLine
										y={selectedQuestion?.maxValue}
										stroke={ColourConstants.activeLink}
									>
										<Label value="Maximum" position="top" />
									</ReferenceLine>
									<ReferenceLine
										y={selectedQuestion?.minValue}
										stroke={ColourConstants.activeLink}
										isFront
									>
										<Label value="Minimum" position="top" />
									</ReferenceLine>
									<Line
										type="linear"
										dataKey="value"
										stroke={ColourConstants.orange}
										isAnimationActive={false}
										dot={<CustomGraphDot fill="#ffa200" />}
										key={`data-${selectedQuestion.id}-line`}
										activeDot={
											<CustomGraphActiveDot
												settooltipPosition={settooltipPosition}
											/>
										}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</Grid>
				</Grid>
			)}
		</div>
	);
}

export default ConditionMonitor;
