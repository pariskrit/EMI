import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import CompanyDetails from "./CompanyDetails";
import ClientApplication from "./Applications/ClientApplication";
import ClientNotes from "./Notes/ClientNotes";
import KeyContacts from "./KeyContacts/ClientKeyContacts";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
}));

const ClientDetails = () => {
	const classes = useStyles();
	return (
		<div className={classes.detailContainer}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<CompanyDetails />
				</Grid>
				<Grid item xs={6}>
					<ClientApplication />
				</Grid>
				<Grid item xs={6}>
					<ClientNotes />
				</Grid>
				<Grid item xs={6}>
					<KeyContacts />
				</Grid>
			</Grid>
		</div>
	);
};

export default ClientDetails;
