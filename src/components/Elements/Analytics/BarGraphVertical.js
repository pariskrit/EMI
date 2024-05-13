import {
	ComposedChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	LabelList,
	ResponsiveContainer,
} from "recharts";

import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";

const COLORS = [
	"#3b679b",
	"#963835",
	"#76923C",
	"#139650",
	"#FAB15A",
	"#5A4573",
	"#F0565E",
	"#7FA4D0",
	"#096B19",
	"#56CEF0",
	"#E3DC5D",
	"#E3A05D",
	"#AA56F0",
	"#11D631",
	"#4A1B2A",
	"#26063B",
	"#789331",
	"#2DA193",
	"#CEA007",
	"#24130B",
	"#A11205",
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
const BarGraphVertical = ({ chartData, handleBarClick, isLast }) => {
	const { classes, cx } = useStyles();
	const [toolTipPosition, setToolTipPosition] = useState({});
	const [showToolTip, setShowTooltip] = useState(false);
	const [isMouseHover, setIsMouseHover] = useState(null);
	const [index, setIndex] = useState(undefined);

	function handleMouseEnter(data, i, e) {
		setIndex(i);
		setShowTooltip(true);
		setToolTipPosition({
			x: e.clientX - 100,
			y: e.clientY + window.scrollY - 350,
		});
		if (isLast) {
			return;
		}
		setIsMouseHover(i);
	}
	function handleMouseLeave() {
		setIndex(undefined);
		setShowTooltip(false);
		setIsMouseHover(null);
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
							style={{ background: COLORS[index % COLORS.length] }}
						></p>
						<label>
							{payload[0]?.dataKey}:
							<span className="label"> {payload[0]?.value}</span>
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
				height: chartData?.length < 5 ? 500 : chartData?.length * 150,
				width: "90vw",
			}}
		>
			<ResponsiveContainer width="100%" height="100%">
				<ComposedChart
					width={1300}
					height={chartData?.length < 5 ? 500 : chartData?.length * 150}
					data={chartData}
					margin={{
						top: 10,
						right: 30,
						left: 40,
						bottom: 50,
					}}
					layout={"vertical"}
				>
					<CartesianGrid horizontal={false} />
					<YAxis
						label={{
							angle: -90,
							dx: -80,
							// position: "insideLeft",
						}}
						dataKey="name"
						type="category"
						padding={{ top: 80, bottom: 80 }}
						width={150}
					/>
					<XAxis
						label={{ value: "Count", dy: 30 }}
						type="number"
						domain={[0, "dataMax + 2"]}
					/>
					<Tooltip
						content={<CustomTooltip showToolTip={showToolTip} />}
						position={toolTipPosition}
						cursor={{ fill: "transparent" }}
					/>

					<Bar
						dataKey="count"
						fill="#8884d8"
						barSize={45}
						onClick={handleBarClick}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						cursor={isLast ? null : "pointer"}
					>
						<LabelList dataKey="count" position="right" fill="#000000" />
						{chartData?.map((entry, index) => (
							<Cell
								stroke={"#3f51b5"}
								strokeWidth={isMouseHover === index ? 1 : 0}
								cursor={isLast ? null : "pointer"}
								key={`cell-${index}`}
								fill={
									isMouseHover === index
										? "#afbbff33"
										: COLORS[index % COLORS.length]
								}
							/>
						))}
					</Bar>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default BarGraphVertical;
