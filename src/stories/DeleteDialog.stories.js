import DeleteDialog from "components/Elements/DeleteDialog";
import React from "react";

export default {
	title: "Components/Deletedialog",
	component: DeleteDialog,
};

const Template = (args) => <DeleteDialog {...args} />;

export const Dialog = Template.bind({});

Dialog.args = {
	entityName: "Application",
	open: true,
};
