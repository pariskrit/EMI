import { makeStyles } from "tss-react/mui";

import useWindowSize from "hooks/useDynamicScreenSize";
import React, { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";

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
const RADIAN = Math.PI / 180;

const useStyles = makeStyles()((theme) => ({
	pieStyles: {
		height: "65vh",
		width: "90vw",
	},
}));

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
	data,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill={COLORS[index % COLORS.length]}
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${data[index].name}-${data[index].count}`}
		</text>
	);
};

const handleLabelLine = (e) => {
	const { points, index } = e;
	return (
		<line
			x1={points[0].x}
			y1={points[0].y}
			x2={points[1].x}
			y2={points[1].y}
			fill={COLORS[index % COLORS.length]}
			style={{ stroke: COLORS[index % COLORS.length], strokeWidth: 1 }}
		/>
	);
};

const PieChartPage = ({ data, handleClick, isLast }) => {
	const { classes, cx } = useStyles();
	const windowSize = useWindowSize();

	const [mouseOver, setMouseOver] = useState(false);
	function handleMouseEnter(data, i, e) {
		if (isLast) {
			return;
		}
		setMouseOver(i);
	}

	let screenWidth = null;
	if (windowSize.width >= 1200) {
		screenWidth = 180;
	} else if (windowSize.width >= 775 && windowSize.width < 1200) {
		screenWidth = 150;
	} else if (windowSize.width >= 600 && windowSize.width < 775) {
		screenWidth = 115;
	} else {
		screenWidth = 100;
	}

	return (
		<div className={classes.pieStyles}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart width={400} height={400}>
					<Pie
						data={data}
						dataKey="count"
						// startAngle={360}
						// endAngle={0}
						cx="50%"
						cy="50%"
						outerRadius={screenWidth}
						fill="#8884d8"
						label={(props) => renderCustomizedLabel({ ...props, data })}
						onClick={handleClick}
						cursor={isLast ? null : "pointer"}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={() => setMouseOver(null)}
						labelLine={handleLabelLine}
						isAnimationActive={false}
					>
						{data?.map((entry, index) => (
							<Cell
								stroke={"#3f51b5"}
								key={`cell-${index}`}
								strokeWidth={index === mouseOver ? 1 : 0}
								fill={
									index === mouseOver
										? "#afbbff33"
										: COLORS[index % COLORS.length]
								}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default PieChartPage;
