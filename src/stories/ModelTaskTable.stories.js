import React from "react";
import ModelTaskTable from "components/Modules/ModelTaskTable";
import { storiesOf } from "@storybook/react";

storiesOf("components/ModelTaskTable", module).add("controlled", () => {
	function Parent({ children }) {
		const [data, setData] = React.useState([
			{
				id: 1,
				action: "Fill",
				name: "Rujal",
				operating_mode: "Filled",
				system: "Hydraulic",
				role: "Super Admin",
				est_min: "33",
				notes: "Visit if its all right",
				order_added: "11",
				intervals: "200hr",
				stages: "Check run",
				zones: "Zone 2",
			},
			{
				id: 2,
				action: "Done",
				name: "Uchi",
				operating_mode: "Isolated",
				system: "Hydraulic",
				role: "Admin",
				est_min: "12",
				notes: "Check if its all right",
				order_added: "1",
				intervals: "2000hr",
				stages: "Test run",
				zones: "Zone 1",
			},
		]);
		return <div>{children(data, setData)}</div>;
	}
	return (
		<Parent>
			{(data, setData) => (
				<ModelTaskTable
					data={data}
					setData={setData}
					headers={[
						"Action",
						"Name",
						"Operating Mode",
						"System",
						"Role",
						"Est Mins",
						"Notes",
						"Order Added",
						"Intervals",
						"Stages",
						"Zones",
					]}
					columns={[
						"action",
						"name",
						"operating_mode",
						"system",
						"role",
						"est_min",
						"notes",
						"order_added",
						"intervals",
						"stages",
						"zones",
					]}
					handleDelete={(e) => console.log(e)}
					handleEdit={(e) => console.log(e)}
				/>
			)}
		</Parent>
	);
});
