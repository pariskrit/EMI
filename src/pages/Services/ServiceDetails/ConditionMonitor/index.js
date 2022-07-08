import { Grid, LinearProgress } from "@material-ui/core";
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
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
});

function ConditionMonitor({ customCaptions, serviceId, state }) {
	//init hooks
	const dispatch = useDispatch();
	const classes = useStyles();

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
								response.data?.detail || "Failed to fetch Graph Details"
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
		return changeDate(new Date(new Date(date) + "Z"));
	};

	console.log(tooltipPosition);

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
										date: +new Date(x.date).getTime(),
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
											isoDateWithoutTimeZone(new Date(new Date(val) + "Z"))
										}
										wrapperStyle={{
											opacity: tooltipPosition?.active ? 1 : 0,
										}}
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
										dot={{ strokeWidth: 2, r: 7, fill: ColourConstants.orange }}
										isAnimationActive={false}
										key={`data-${selectedQuestion.id}-line`}
										activeDot={{
											onMouseOver: (e, val) => {
												settooltipPosition((prev) => ({
													active: true,
												}));
											},
											onMouseLeave: (e) => {
												settooltipPosition((prev) => ({
													active: false,
												}));
											},

											strokeWidth: 40,
											stroke: "transparent",
											r: 7,
										}}
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
