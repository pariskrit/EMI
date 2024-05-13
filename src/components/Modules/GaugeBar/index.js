import { makeStyles } from "tss-react/mui";

import React, { useEffect } from "react";
import { ResponsiveContainer, Cell, PieChart, Pie, Label } from "recharts";

const useStyles = makeStyles()((theme) => ({
	gaugeContainer: {
		width: 350,
		height: 175,
		border: "2px solid black",
	},
	summarySpan: { textAlign: "center", fontSize: "18px" },
	warningSpan: { color: "#F8140A" },
}));

const GaugeBar = ({ totalCount, totalUsed, loggedInCount }) => {
	const { classes, cx } = useStyles();
	const RADIAN = Math.PI / 180;

	const width = 400;
	const percentage = totalUsed / totalCount;
	let licenseRatio;
	if (percentage === 1) {
		licenseRatio = 90;
	}
	if (percentage <= 0.9) {
		licenseRatio = (percentage / 0.9) * 50;
	} else if (percentage > 0.9 && percentage < 1) {
		//for 90 to 100 part
		const afterDecimals = percentage?.toString()?.split(".")?.[1]; // converting 0.91789 to 91789
		const requiredNumber = +afterDecimals
			?.split("")
			?.filter((item, index) => index !== 0)
			?.map((item, index) => (index === 0 ? `${item}.` : item))
			?.join(""); // converting to 1.789

		licenseRatio = requiredNumber * 4 + 50;
	}
	const usedLicenseRatio = totalUsed / totalCount;
	const slices = [
		{
			value: 50,
			color: "#3DEC3F",
		},
		{
			value: 40,
			color: "#E7EC3D",
		},
		{
			value: 50,
			color: "#F8140A",
		},
	];

	const sumValues = slices.map((cur) => cur.value).reduce((a, b) => a + b);

	const arrowData = [
		{ value: licenseRatio },
		{ value: 0 },
		{ value: sumValues - licenseRatio },
	];

	const pieProps = {
		startAngle: 180,
		endAngle: 0,
		cx: width / 2,
		cy: width / 2,
		isAnimationActive: false,
	};

	const Arrow = ({ cx, cy, midAngle, outerRadius }) => {
		//eslint-disable-line react/no-multi-comp
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const mx = cx + (outerRadius + width * 0.03) * cos;
		const my = cy + (outerRadius + width * 0.03) * sin;
		return (
			<g>
				<path
					d={`M${cx},${cy}L${mx},${my}`}
					strokeWidth="5"
					stroke="black"
					fill="none"
					strokeLinecap="round"
				/>
			</g>
		);
	};
	//To center pie chart
	useEffect(() => {
		setTimeout(() => {
			const svgEl = document.getElementsByClassName("recharts-surface");
			if (svgEl) {
				svgEl[0].setAttribute("viewBox", "30 80 346 171");
				svgEl[0].style.pointerEvents = "none";
			}
		}, 100);
	}, []);

	return (
		<div className="pie-row">
			<div className={`${classes.gaugeContainer} pie-wrap`}>
				<div className={classes.summarySpan}>
					{`${totalUsed} / ${totalCount}`}
				</div>
				<ResponsiveContainer>
					<PieChart width={350} height={230}>
						<Pie
							stroke="none"
							data={slices}
							innerRadius={(width / 2) * 0.5}
							outerRadius={(width / 2) * 0.6}
							{...pieProps}
							// label
						>
							{slices.map((each, i) => (
								<Cell key={`cell-${i}`} fill={slices[i].color} stroke="none" />
							))}
						</Pie>
						<Pie
							stroke="none"
							fill="none"
							activeIndex={1}
							activeShape={Arrow}
							data={arrowData}
							innerRadius={(width / 2) * 0.5}
							outerRadius={(width / 2) * 0.5}
							{...pieProps}
						></Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			{usedLicenseRatio > 0.9 && (
				<div>
					<span className={classes.warningSpan}>Licenses Low</span>
				</div>
			)}
		</div>
	);
};

export default GaugeBar;
