import React from "react";
import DragAndDrop from "components/Modules/DragAndDrop";

export default {
	title: "Components/DragAndDrop",
	component: DragAndDrop,
};

const Template = (args) => <DragAndDrop {...args} />;

export const DragDrop = Template.bind({});

DragDrop.args = {
	data: [
		{
			id: 1,
			firstName: "Rujal",
			lastName: "Sapkota",
			email: "rr@gmail.com",
			phone: "345",
		},
		{
			id: 2,
			firstName: "TTtasd",
			lastName: "Sapkota",
			email: "ssr@gmail.com",
			phone: "345sdf",
		},
	],
	handleDragEnd: (e) => console.log(e),
	header: () => (
		<thead>
			<tr>
				<th>Fname</th>
				<th>Lname</th>
				<th>Email</th>
				<th>Phone</th>
			</tr>
		</thead>
	),
	tableColumns: (row, index, handleDrag, ref) => (
		<>
			<td>
				<span ref={ref} {...handleDrag}>
					Icon
				</span>
				{row.firstName}
			</td>
			<td>{row.lastName}</td>
			<td>{row.email}</td>
			<td>{row.phone}</td>
		</>
	),
};
