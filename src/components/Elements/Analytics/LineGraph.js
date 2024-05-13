import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Line,
	LineChart,
	Legend,
} from "recharts";
import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { changeDate } from "helpers/date";
import { groupBy } from "helpers/utils";
import CustomGraphActiveDot from "../ConditionalMonitoring/CustomGraphActiveDot";
import CustomGraphDot from "../ConditionalMonitoring/CustomGraphDot";
const COLORS = [
	"#3b679b",
	"#963835",
	"#76923C",
	"#139650",
	"#FAB15A",
	"#F0565E",
	"#7FA4D0",
	"#56CEF0",
	"#E3DC5D",
	"#E3A05D",
	"#AA56F0",
	"#11D631",
	"#789331",
	"#2DA193",
	"#CEA007",
	"#5EC240",
];
const useStyles = makeStyles()((theme) => ({
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
	label: {
		margin: 0,
	},
}));
const LineGraph = ({ chartData, hasAsset, customCaptions }) => {
	const { classes } = useStyles();
	const [tooltipPosition, settooltipPosition] = useState({
		active: false,
	});
	const dateFormatter = (date) => {
		return changeDate(new Date(new Date(date)));
	};
	const data = chartData.map((x) => ({
		...x,
		date: +new Date(x.date + "Z").getTime(),
		value: x.valueNumeric,
	}));
	const CustomToolTip = (val) => {
		const { active, payload, label } = val;
		if (active && payload && payload.length) {
			return (
				<>
					<div className={classes.customTooltip}>
						<b className={classes.label}>{dateFormatter(label)}</b>
						{payload.map((item) => (
							<>
								<div className={classes.toolTipLabel}>
									<p
										className={classes.colorBox}
										style={{ background: item?.stroke }}
									/>
									<label>
										<p>
											Response &nbsp;: &nbsp;
											<span className="label"> {item?.value}</span>
										</p>
									</label>
								</div>
								<div className={classes.toolTipLabel}>
									<p className={classes.colorBox} />
									{hasAsset && item?.payload?.siteAssetName ? (
										<p>
											{customCaptions?.asset ? customCaptions?.asset : "Asset"}{" "}
											&nbsp; : &nbsp;
											<span className="label">
												{item?.payload?.siteAssetName}
											</span>
										</p>
									) : (
										""
									)}
								</div>
								{item?.payload.defects[0]?.number && (
									<div className={classes.toolTipLabel}>
										<p className={classes.colorBox} />
										<label>
											<p>
												{customCaptions?.defect ?? "Defect"}&nbsp;
												{customCaptions?.number ?? "Number"} &nbsp; : &nbsp;
												<span className="label">
													{item?.payload.defects[0]?.number}
												</span>
											</p>
										</label>
									</div>
								)}{" "}
								{item?.payload.defects[0]?.defectStatusName && (
									<div className={classes.toolTipLabel}>
										<p className={classes.colorBox} />
										<label>
											<p>
												{customCaptions?.defectStatus ?? " Defect Status"}{" "}
												&nbsp;:&nbsp;
												<span className="label">
													{item?.payload.defects[0]?.defectStatusName}
												</span>
											</p>
										</label>
									</div>
								)}
								{item?.payload.defects[0]?.defectTypeName && (
									<div className={classes.toolTipLabel}>
										<p className={classes.colorBox} />
										<label>
											<p>
												{customCaptions?.defectType ?? " Defect Type"} &nbsp; :
												&nbsp;
												<span className="label">
													{item?.payload.defects[0]?.defectTypeName}
												</span>
											</p>
										</label>
									</div>
								)}
								{item?.payload.defects[0]?.defectRiskRatingName && (
									<div className={classes.toolTipLabel}>
										<p className={classes.colorBox} />
										<label>
											<p>
												{customCaptions?.defect ?? "Defect"}&nbsp;
												{customCaptions?.riskRating ?? " Risk Rating"} &nbsp; :
												&nbsp;
												<span className="label">
													{item?.payload.defects[0]?.defectRiskRatingName}
												</span>
											</p>
										</label>
									</div>
								)}
								{item?.payload.defects[0]?.defectDetail && (
									<div className={classes.toolTipLabel}>
										<p className={classes.colorBox} />
										<label>
											<p>
												{customCaptions?.defect ?? "Defect"}&nbsp;
												{customCaptions?.detail ?? "Detail"} &nbsp; : &nbsp;
												<span className="label">
													{item?.payload.defects[0]?.defectDetail}
												</span>
											</p>
										</label>
									</div>
								)}
							</>
						))}
					</div>
				</>
			);
		}
	};

	return (
		<div style={{ height: "65vh", width: "90vw" }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					margin={{
						top: 10,
						right: 30,
						left: 40,
						bottom: 50,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis
						dataKey="date"
						scale="time"
						type="number"
						domain={["dataMin", "dataMax"]}
						width={200}
						tickFormatter={dateFormatter}
						allowDuplicatedCategory={false}
						padding={{ left: 30, right: 30 }}
					/>
					<YAxis
						label={{ value: "Response", angle: -90, dx: -30 }}
						dataKey="valueNumeric"
						type="number"
						padding={{ top: 30, bottom: 30 }}
					/>
					<Tooltip
						content={<CustomToolTip />}
						formatter={(value) => [value, "average"]}
						wrapperStyle={{
							opacity: tooltipPosition?.active ? 1 : 0,
						}}
					/>
					{hasAsset && chartData && (
						<Legend
							align="right"
							verticalAlign="top"
							payload={Object.keys(groupBy(data, "siteAssetName")).map(
								(item, index) => ({
									id: index,
									type: "square",
									value: item,
									color: COLORS[index % COLORS.length],
								})
							)}
							layout="vertical"
							wrapperStyle={{ right: "6px" }}
						/>
					)}
					{chartData &&
						Object.values(groupBy(data, "siteAssetName"))?.map((d, index) => (
							<Line
								type="linear"
								dataKey="valueNumeric"
								data={d}
								stroke={COLORS[index % COLORS.length]}
								isAnimationActive={false}
								dot={<CustomGraphDot fill={COLORS[index % COLORS.length]} />}
								activeDot={
									<CustomGraphActiveDot
										settooltipPosition={settooltipPosition}
									/>
								}
							/>
						))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default LineGraph;
