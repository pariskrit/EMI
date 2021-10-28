import { Grid, Typography } from "@material-ui/core";
import React from "react";

// MOCK DATA IMPORTS
import zm from "assets/zm.png";
import rm from "assets/rm.png";
import es from "assets/es.png";
import SingleApplication from "./SingleApplication";

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

function Portal() {
	return (
		<div>
			<Typography variant="h6" component="h1" gutterBottom>
				<strong>Application Portal</strong>
			</Typography>
			<Grid container spacing={3}>
				{MOCK_DATA.map((application) => (
					<SingleApplication data={application} key={application.name} />
				))}
			</Grid>
		</div>
	);
}

export default Portal;
