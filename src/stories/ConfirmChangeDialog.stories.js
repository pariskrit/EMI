import React from "react";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";

export default {
	title: "Components/ConfirmChangeDialog",
	component: ConfirmChangeDialog,
};

const Template = (args) => <ConfirmChangeDialog {...args} />;

export const Dialog = Template.bind({});

Dialog.args = {
	open: true,
};
