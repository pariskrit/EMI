import React from "react";
import Typography from "@material-ui/core/Typography";
import LaunchItem from "./LaunchItem";
import Grid from "@material-ui/core/Grid";

// MOCK DATA IMPORTS
import zm from "assets/zm.png";
import rm from "assets/rm.png";
import es from "assets/es.png";

// MOCK DATA
const MOCK_DATA = [
	{
		name: "ZoneMaintanance",
		logo: zm,
		regions: {
			Australia: ["Tanami", "Boddington"],
			Africa: ["Ahafo - Ghana"],
		},
	},
	{
		name: "RouteMaintanance",
		logo: rm,
		regions: {
			Australia: ["Broken Hill", "Tanami", "Boddington"],
		},
	},
	{
		name: "EquipmentStatus",
		logo: es,
		regions: {
			Australia: ["Broken Hill", "Sydney", "Melbourne"],
			Africa: ["Mozambique", "Zambia"],
		},
	},
	{
		name: "ZoneMaintanance2",
		logo: zm,
		regions: {
			Australia: ["Tanami2", "Boddington2"],
			Africa: ["Ahafo - Ghana2"],
		},
	},
];

const Launch = () => {
	const LaunchContent = () => {
		return (
			<div>
				<Typography variant="h6" component="h1" gutterBottom>
					<strong>Application Portal</strong>
				</Typography>

				<Grid container spacing={3}>
					{MOCK_DATA.map((application) => (
						<LaunchItem data={application} />
					))}
				</Grid>
			</div>
		);
	};

	return (
		<div>
			<LaunchContent />
		</div>
	);
};

export default Launch;
