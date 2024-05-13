import {
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
	Legend,
	BarChart,
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
const MultiBarVertical = ({ chartData, handleBarClick, isLast, depthName }) => {
	const { classes, cx } = useStyles();
	const [toolTipPosition, setToolTipPosition] = useState({});
	const [showToolTip, setShowTooltip] = useState(false);

	function handleMouseEnter(data, i, e) {
		setShowTooltip(true);
		setToolTipPosition({
			x: e.clientX - 100,
			y: e.clientY + window.scrollY - 400,
		});
		if (isLast) {
			return;
		}
	}
	function handleMouseLeave() {
		setShowTooltip(false);
		setToolTipPosition({});
	}
	const CustomTooltip = ({ active, payload, label, showToolTip }) => {
		if (active && payload && payload.length && showToolTip) {
			return (
				<div className={classes.customTooltip}>
					<b className={classes.label}>{label}</b>
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
	return (
		<div
			style={{
				height:
					chartData?.data?.length < 5 ? 600 : chartData?.data?.length * 150,
				width: "90vw",
			}}
		>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={1300}
					height={
						chartData?.data?.length < 5 ? 600 : chartData?.data?.length * 150
					}
					data={chartData?.data}
					margin={{
						top: 10,
						right: 30,
						left: 40,
						bottom: 50,
					}}
					barSize={20}
					barGap={0}
					layout={"vertical"}
					barCategoryGap={10}
				>
					<YAxis
						label={{
							value: depthName,
							angle: -90,
							dx: -90,
						}}
						dataKey="name"
						type="category"
						padding={{ top: 80, bottom: 80 }}
						width={150}
					/>
					<XAxis label={{ value: "Total Minutes", dy: 30 }} type="number" />

					<Tooltip
						content={<CustomTooltip showToolTip={showToolTip} />}
						position={toolTipPosition}
						cursor={{ fill: "transparent" }}
					/>
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
						wrapperStyle={{ right: 0 }}
					/>
					<CartesianGrid horizontal={false} />
					<Bar
						dataKey="actualMinutes"
						fill="#e27352"
						onClick={handleBarClick}
						barSize={45}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<LabelList dataKey="actualMinutes" position="right" />
					</Bar>
					<Bar
						dataKey="estimatedMinutes"
						fill="#b9995a"
						onClick={handleBarClick}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						barSize={45}
					>
						<LabelList dataKey="estimatedMinutes" position="right" />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MultiBarVertical;
