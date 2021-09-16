import ErrorDialog from "components/Elements/ErrorDialog";
import React from "react";

export default {
	title: "Components/ErrorDialog",
	component: ErrorDialog,
};

const Template = (args) => <ErrorDialog {...args} />;

export const Dialog = Template.bind({});

Dialog.args = {
	error: { status: true, message: "Something went wrong!" },
};
