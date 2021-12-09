import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";

export default {
	title: "Components/DragAndDropTable",
	component: DragAndDropTable,
};

const Template = (args) => <DragAndDropTable {...args} />;

export const DragDrop = Template.bind({});

DragDrop.args = {
	data: [
		{
			id: 1,
			firstName: "Rujal",
			lastName: "Sapkota",
			email: "rr@gmail.com",
			phone: "34885",
		},
		{
			id: 2,
			firstName: "TTtasd",
			lastName: "Sapkota",
			email: "ssr@gmail.com",
			phone: "646546",
		},
	],
	headers: ["First Name", "Last Name", "Email", "Phone"],
	columns: ["firstName", "lastName", "email", "phone"],
	handleDragEnd: (e) => console.log(e),
	handleDelete: (e) => console.log(e),
	handleEdit: (e) => console.log(e),
};
