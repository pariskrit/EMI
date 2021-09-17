<<<<<<< HEAD
import DeleteDialog from "components/Elements/DeleteDialog";
=======
import DeleteDialog from "components/Modules/DeleteDialog";
>>>>>>> 9723779a7819bbd48175380b1dd65c7ae47277d9
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
