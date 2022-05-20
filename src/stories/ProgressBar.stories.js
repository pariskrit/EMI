import ProgressBars from "components/Elements/ProgressBar";
import React from "react";

export default {
	title: "Components/ProgressBar",
	component: ProgressBars,
};

const Template = (args) => <ProgressBars {...args} />;

export const ProgessBar = Template.bind({});

ProgessBar.args = {
	value: 70,
	bgColour: "red",
	labelAlignment: "center",
	height: "30px",
	width: "100%",
	labelColor: "white",
	borderRadius: "20px",
	isLabelVisible: true,
};
