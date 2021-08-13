import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ClientApplication from "./Applications/ClientApplication";
import ClientDetail from "./ClientDetail";
import KeyContacts from "./KeyContacts/ClientKeyContacts";
import ClientNotes from "./Notes/ClientNotes";
import CompanyLogo from "./CompanyLogo";
import ClientDocuments from "./ClientDocuments";
import RegionAndSites from "./RegionAndSites";

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
		<div className={classes.detailContainer + " client-details"}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<ClientDetail />
				</Grid>
				<Grid item xs={6}>
					<CompanyLogo />
					<RegionAndSites />
					<ClientDocuments />
				</Grid>
				<Grid item xs={6}>
					<ClientApplication />
					<ClientNotes />
					<KeyContacts />
				</Grid>
			</Grid>
		</div>
	);
};

export default ClientDetails;
