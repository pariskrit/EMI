import { makeStyles } from "@material-ui/core";
import GraphTitle from "components/Modules/GraphTitle";
import { getLocalStorageData } from "helpers/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	LabelList,
} from "recharts";
import { showError } from "redux/common/actions";
import { getServiceTimes } from "services/services/serviceTimes";

const useStyles = makeStyles({
	customTooltip: {
		background: "#e9e9e9",
		padding: "6px 12px",
		border: " 1px solid",
		borderRadius: "3px",
	},
	toolTipLabel: {
		display: "flex",
		alignItems: "center",
		gap: "4px",

		"& p": {
			margin: "0px !important",
		},
	},
	colorBox: {
		width: "14px",
		height: "14px",
	},
});

function Times() {
	const classes = useStyles();
	const { customCaptions } = getLocalStorageData("me");
	const [chartData, setChartData] = useState({});
	const [stage, setStage] = useState(null);
	const [isTask, setIsTask] = useState(false);
	const [crumbs, setCrumbs] = useState([
		{ id: 1, name: customCaptions.stagePlural },
	]);
	const { id } = useParams();
	const dispatch = useDispatch();
	const depthNames = {
		S: customCaptions?.stagePlural,
		Z: customCaptions?.zonePlural,
		T: customCaptions?.taskPlural,
	};

	const handleBarClick = async (data, index, e) => {
		if (chartData.depth === "T") return;

		let response = null;

		if (chartData.depth === "S") {
			response = await getServiceTimes(id, data.id);
			setStage(data);
			setCrumbs([
				{ id: 1, name: data.name, depth: "S" },
				{
					id: 2,
					name:
						response.data.depth === "T"
							? customCaptions?.taskPlural
							: customCaptions?.zonePlural,
				},
			]);
		}
		if (chartData.depth === "Z") {
			response = await getServiceTimes(id, stage?.id, data.id);
			setCrumbs([
				{ id: 1, name: stage?.name, depth: "S" },
				{ id: 2, name: data?.name, depth: "Z" },
				{ id: 3, name: customCaptions?.taskPlural },
			]);
		}
		if (response.status) {
			if (response.data.depth === "T") setIsTask(true);
			setChartData(response.data);
		} else {
			dispatch(
				showError(
					response.data?.details || response.data || "Could not fetch data"
				)
			);
		}
	};

	const handleRevertChart = async (data) => {
		let response = null;
		if (data.depth === "S") {
			response = await getServiceTimes(id);
			setCrumbs([{ id: 1, name: customCaptions.stagePlural, depth: "S" }]);
		}
		if (data.depth === "Z") {
			response = await getServiceTimes(id, stage.id);
			setCrumbs([
				{ id: 1, name: stage?.name, depth: "S" },
				{ id: 1, name: customCaptions.zonePlural, depth: "Z" },
			]);
		}
		setChartData(response.data);
		setIsTask(false);
	};

	const fetchServiceTimes = useCallback(async () => {
		const response = await getServiceTimes(id);

		if (response.status) {
			setChartData(response.data);
		} else {
			dispatch(
				showError(
					response.data?.details || response.data || "Could not fetch data"
				)
			);
		}
	}, [id, dispatch]);

	useEffect(() => {
		fetchServiceTimes();
	}, [fetchServiceTimes]);

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={classes.customTooltip}>
					<div className={classes.toolTipLabel}>
						<p
							className={classes.colorBox}
							style={{ background: "#b9995a" }}
						></p>
						<label>
							Estimated:
							<span className="label"> {payload[1].value}</span>
						</label>
					</div>
					<div className={classes.toolTipLabel}>
						<p
							className={classes.colorBox}
							style={{ background: "#e27352" }}
						></p>
						<label>
							Actual:
							<span className="label"> {payload[0].value}</span>
						</label>
					</div>
				</div>
			);
		}

		return null;
	};
	console.log(chartData);
	return (
		<div style={{ height: "100vh" }}>
			<div style={{ marginBottom: 20 }}>
				<GraphTitle
					hasBreadCrumb
					serviceName={customCaptions.service}
					datas={crumbs}
					afterClick={handleRevertChart}
				/>
			</div>

			{isTask ? (
				<BarChart
					width={1575}
					height={
						chartData?.data?.length < 5 ? 600 : chartData?.data?.length * 150
					}
					data={chartData.data}
					margin={{
						top: 10,
						right: 30,
						left: 40,
						bottom: 50,
					}}
					barSize={20}
					barGap={0}
					layout={"vertical"}
				>
					<YAxis
						label={{
							value: depthNames[chartData.depth],
							angle: -90,
							dx: -60,
						}}
						dataKey="name"
						scale="point"
						type="category"
						padding={{ top: 80, bottom: 80 }}
					/>
					<XAxis label={{ value: "Total Minutes", dy: 30 }} type="number" />

					<Tooltip content={<CustomTooltip />} />
					<Legend
						layout="vertical"
						align="right"
						verticalAlign="top"
						payload={[
							{
								id: "1",
								value: "Actual",
								type: "square",
								color: "#e27352",
							},
							{
								id: "2",
								value: "Estimated",
								type: "square",
								color: "#b9995a",
							},
						]}
					/>
					<CartesianGrid horizontal={false} />
					<Bar
						dataKey="actualMinutes"
						fill="#e27352"
						onClick={handleBarClick}
						barSize={60}
					>
						<LabelList dataKey="actualMinutes" position="right" />
					</Bar>
					<Bar
						dataKey="estimatedMinutes"
						fill="#b9995a"
						onClick={handleBarClick}
						barSize={60}
					>
						<LabelList dataKey="estimatedMinutes" position="right" />
					</Bar>
				</BarChart>
			) : (
				<BarChart
					width={1575}
					height={800}
					data={chartData.data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 30,
					}}
					barSize={20}
					barGap={0}
				>
					<XAxis
						label={{ value: depthNames[chartData.depth], dy: 30 }}
						dataKey="name"
						scale="point"
						type="category"
						padding={{ left: 80, right: 80 }}
						width={10}
					/>
					<YAxis
						label={{ value: "Total Minutes", angle: -90, dx: -30 }}
						type="number"
					/>

					<Tooltip content={<CustomTooltip />} />

					<Legend
						layout="vertical"
						align="right"
						verticalAlign="top"
						payload={[
							{
								id: "1",
								value: "Actual",
								type: "square",
								color: "#e27352",
							},
							{
								id: "2",
								value: "Estimated",
								type: "square",
								color: "#b9995a",
							},
						]}
					/>
					<CartesianGrid vertical={false} />
					<Bar
						dataKey="actualMinutes"
						fill="#e27352"
						onClick={handleBarClick}
						barSize={60}
					>
						<LabelList dataKey="actualMinutes" position="top" />
					</Bar>
					<Bar
						dataKey="estimatedMinutes"
						fill="#b9995a"
						onClick={handleBarClick}
						barSize={60}
					>
						<LabelList dataKey="estimatedMinutes" position="top" />
					</Bar>
				</BarChart>
			)}
		</div>
	);
}

export default Times;
