import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

export default function ProgressBars({
	value,
	bgColour = "#23BB79",
	height = "15px",
	baseBgColor,
	borderRadius,
	padding,
	margin,
	labelAlignment,
	labelColor,
	width,
	isLabelVisible = true,
}) {
	return (
		<ProgressBar
			completed={value}
			bgColor={bgColour}
			height={height}
			baseBgColor={baseBgColor}
			borderRadius={borderRadius}
			padding={padding}
			margin={margin}
			labelAlignment={labelAlignment}
			labelColor={labelColor}
			width={width}
			isLabelVisible={isLabelVisible}
		/>
	);
}
