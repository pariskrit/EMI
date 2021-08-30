import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import React from "react";

export default {
	title: "Components/ConfirmChangeDialog",
	component: ConfirmChangeDialog,
};

const Template = (args) => <ConfirmChangeDialog {...args} />;

export const Dialog = Template.bind({});

Dialog.args = {
	open: true,
};
