import ModelTaskTable from "components/Modules/ModelTaskTable";
import SettingsIcon from "@material-ui/icons/Settings";
import WarningIcon from "@material-ui/icons/Warning";
import React from "react";

function Task() {
	return (
		<div>
			<h2>Tasks(266)</h2>
			<p>Task assigned to this assest model.</p>
			<ModelTaskTable
				headers={[
					{ id: 1, name: <SettingsIcon />, sort: false },
					{
						id: 13,
						name: <WarningIcon style={{ color: "red" }} />,
						sort: false,
					},
					{ id: 2, name: "Action", sort: true },
					{ id: 3, name: "Name", sort: true },
					{ id: 4, name: "Operating Mode", sort: true },
					{ id: 5, name: "System", sort: true },
					{ id: 6, name: "Role", sort: true },
					{ id: 7, name: "Ext Mins", sort: true },
					{ id: 8, name: "Notes", sort: true },
					{ id: 9, name: "Order Added", sort: true },
					{ id: 10, name: "Intervals", sort: true },
					{ id: 11, name: "Stages", sort: true },
					{ id: 12, name: "Zones", sort: true },
				]}
				columns={[
					"settingIcon",
					"warningIcon",
					"Action",
					"Name",
					"Operating Mode",
					"System",
					"Role",
					"Ext Mins",
					"Notes",
					"Order Added",
					"Intervals",
					"Stages",
					"Zones",
				]}
				data={[
					{
						id: 1,
						settingIcon: <SettingsIcon />,
						warningIcon: <WarningIcon style={{ color: "red" }} />,
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Ext Mins": 12,
						Notes: "check if any orderd in not working",
						"Order Added": 2,
						Intervals: "300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Ext Mins": 12,
						Notes: "check if any orderd in not working",
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
				]}
			/>
		</div>
	);
}

export default Task;
