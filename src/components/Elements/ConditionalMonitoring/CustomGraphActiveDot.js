import { appPath } from "helpers/routePaths";
import React from "react";
const CustomGraphActiveDot = ({ payload, cx, cy, settooltipPosition }) => {
	const hasDefects = payload.defects && payload.defects.length > 0;
	return (
		<circle
			cx={cx}
			cy={cy}
			r="7"
			stroke={"transparent"}
			fill={"transparent"}
			width={20}
			height={20}
			strokeWidth={40}
			onMouseOver={(e, val) => {
				settooltipPosition((prev) => ({
					active: true,
				}));
			}}
			onMouseLeave={(e) => {
				settooltipPosition((prev) => ({
					active: false,
				}));
			}}
			onClick={(e) => {
				if (hasDefects) {
					window.open(`${appPath}defects/${payload.defects[0].id}`);
				}
			}}
		/>
	);
};

export default CustomGraphActiveDot;
