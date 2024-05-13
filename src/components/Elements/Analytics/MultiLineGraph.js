import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Line,
	LineChart,
} from "recharts";

import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";

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
const MultiLineGraph = ({ chartData, handleLineClick }) => {
	const { classes, cx } = useStyles();
	const [showToolTip] = useState(false);
	const [tooltipPosition, settooltipPosition] = useState({
		active: false,
	});

	const CustomTooltip = ({ active, payload, label, showToolTip }) => {
		if (active && payload && payload.length && showToolTip) {
			return (
				<div className={classes.customTooltip}>
					<b className={classes.label}>
						Month: {label.toString().split("/")[0]}
					</b>
					<div className={classes.toolTipLabel}>
						<p
							className={classes.colorBox}
							style={{ background: payload[0]?.stroke }}
						></p>
						<label>
							Completed {payload[0]?.dataKey}:
							<span className="label"> {payload[0]?.value}</span>
						</label>
					</div>
					<div className={classes.toolTipLabel}>
						<p
							className={classes.colorBox}
							style={{ background: payload[1]?.stroke }}
						></p>
						<label>
							Outstanding {payload[1]?.dataKey}:
							<span className="label"> {payload[1]?.value}</span>
						</label>
					</div>
				</div>
			);
		}

		return null;
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
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="yearMonth"
						xAxisId={"benchmark"}
						padding={{ top: 80, bottom: 80 }}
						margin={{ top: 10 }}
						dy={6}
					/>
					<XAxis hide={true} xAxisId={"value"} />
					<YAxis
						orientation="left"
						label={{ value: "Count", angle: -90, dx: -30 }}
						dx={-5}
						type="number"
						domain={[0, (dataMax) => Math.round(dataMax) + 2]}
					/>
					{tooltipPosition?.active ? (
						<Tooltip
							content={<CustomTooltip showToolTip={tooltipPosition} />}
							formatter={(value) => [value, "average"]}
							wrapperStyle={{
								opacity: tooltipPosition?.active ? 1 : 0,
							}}
						/>
					) : (
						<Tooltip
							content={<CustomTooltip showToolTip={showToolTip} />}
							position={tooltipPosition}
							cursor={{ fill: "transparent" }}
						/>
					)}
					<Line
						xAxisId={"value"}
						type="linear"
						dot={{ strokeWidth: 2, r: 8, fill: "#FAA077" }}
						data={chartData?.completed?.map((d) => ({
							...d,
							yearMonth: `${d.month}/${d.year}`,
						}))}
						dataKey="count"
						stroke="#FAA077"
						isAnimationActive={false}
						activeDot={{
							onMouseOver: (e, i) => {
								settooltipPosition((prev) => ({
									active: true,
								}));
							},
							onMouseLeave: (e) => {
								settooltipPosition((prev) => ({
									active: false,
								}));
							},
							onClick: (e, i) => handleLineClick(i),
							strokeWidth: 40,
							stroke: "transparent",
							cursor: "pointer",
							r: 8,
						}}
					/>
					<Line
						xAxisId={"benchmark"}
						type="linear"
						data={chartData?.outstanding.map((d) => ({
							...d,
							yearMonth: `${d.month}/${d.year}`,
						}))}
						dot={{ strokeWidth: 2, r: 8, fill: "#0115FA" }}
						dataKey="count"
						stroke="#0115FA"
						isAnimationActive={false}
						activeDot={{
							onMouseOver: (e, i) => {
								settooltipPosition((prev) => ({
									active: true,
								}));
							},
							onMouseLeave: (e) => {
								settooltipPosition((prev) => ({
									active: false,
								}));
							},
							onClick: (e, i) => handleLineClick(i),
							cursor: "pointer",
							strokeWidth: 40,
							stroke: "transparent",
							r: 8,
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MultiLineGraph;
