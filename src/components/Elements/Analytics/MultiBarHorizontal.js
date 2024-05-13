import {
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
	Legend,
	BarChart,
} from "recharts";
import useWindowSize from "hooks/useDynamicScreenSize";
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
const MultiBarHorizontal = ({
	chartData,
	handleBarClick,
	isLast,
	depthName,
}) => {
	const { classes, cx } = useStyles();
	const [toolTipPosition, setToolTipPosition] = useState({});
	const [showToolTip, setShowTooltip] = useState(false);
	const [isMouseHover, setIsMouseHover] = useState(null);
	const windowSize = useWindowSize();

	function handleMouseEnter(data, i, e) {
		setShowTooltip(true);
		setToolTipPosition({ x: e?.clientX - 100, y: e?.clientY - 250 });
		if (isLast) {
			return;
		}
		setIsMouseHover(i);
	}
	function handleMouseLeave() {
		setShowTooltip(false);
		setIsMouseHover(null);
		setToolTipPosition({});
	}
	let padding = { left: 100, right: 100 };
	if (chartData?.data.length <= 2 && windowSize.width > 1600) {
		padding = { left: 450, right: 450 };
	} else if (chartData?.data.length <= 2 && windowSize.width > 1400) {
		padding = { left: 350, right: 350 };
	} else if (chartData?.data.length <= 2 && windowSize.width > 1200) {
		padding = { left: 300, right: 300 };
	} else if (chartData?.data.length <= 2 && windowSize.width > 900) {
		padding = { left: 200, right: 200 };
	} else if (chartData?.data.length <= 2 && windowSize.width > 768) {
		padding = { left: 100, right: 100 };
	} else if (chartData?.data.length <= 2 && windowSize.width < 600) {
		padding = { left: 80, right: 80 };
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
		<div style={{ height: "65vh", width: "90vw" }}>
			<ResponsiveContainer height="100%" width="100%">
				<BarChart
					width={500}
					height={500}
					data={chartData?.data}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 30,
					}}
					barSize={60}
					barGap={0}
				>
					<XAxis
						label={{ value: depthName, dy: 30 }}
						dataKey="name"
						scale="point"
						type="category"
						padding={padding}
						// padding={{ left: 100, right: 100 }}
						width={10}
					/>
					<YAxis
						label={{ value: "Total Minutes", angle: -90, dx: -30 }}
						type="number"
						domain={[0, "dataMax + 10"]}
					/>

					<Tooltip
						position={toolTipPosition}
						content={<CustomTooltip showToolTip={showToolTip} />}
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
					<CartesianGrid vertical={false} />

					<Bar
						dataKey="actualMinutes"
						onClick={handleBarClick}
						// barSize={60}
						cursor="pointer"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<LabelList dataKey="actualMinutes" position="top" fill="#000000" />

						{chartData.data?.map((entry, index) => (
							<Cell
								stroke={"#3f51b5"}
								strokeWidth={isMouseHover === index ? 1 : 0}
								cursor="pointer"
								key={`cell-${index}`}
								fill={isMouseHover === index ? "#afbbff33" : "#e27352"}
							/>
						))}
					</Bar>
					<Bar
						dataKey="estimatedMinutes"
						onClick={handleBarClick}
						cursor="pointer"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						// barSize={60}
					>
						<LabelList
							dataKey="estimatedMinutes"
							position="top"
							fill="#000000"
						/>
						{chartData.data?.map((entry, index) => (
							<Cell
								stroke={"#3f51b5"}
								strokeWidth={isMouseHover === index ? 1 : 0}
								cursor="pointer"
								key={`cell-${index}`}
								fill={isMouseHover === index ? "#afbbff33" : "#b9995a"}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MultiBarHorizontal;
