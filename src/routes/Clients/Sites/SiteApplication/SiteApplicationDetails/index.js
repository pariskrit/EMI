import { Grid } from "@material-ui/core";
import React from "react";
import Application from "./Application";
import License from "./License";
import ServiceOptions from "./ServiceOptions";

function SiteApplicationDetails() {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Application />
			</Grid>
			<Grid item xs={12}>
				<ServiceOptions />
			</Grid>
			<Grid item xs={12}>
				<License />
			</Grid>
		</Grid>
	);
}

export default SiteApplicationDetails;
