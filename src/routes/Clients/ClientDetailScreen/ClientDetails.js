import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ClientApplication from "./Applications/ClientApplication";
import ClientDetail from "./ClientDetail";
import KeyContacts from "./KeyContacts/ClientKeyContacts";
import ClientNotes from "./Notes/ClientNotes";
import CompanyLogo from "./CompanyLogo";
import ClientDocuments from "./ClientDocuments";
import RegionAndSites from "./RegionAndSites";
import { useParams } from "react-router-dom";
import Navcrumbs from "components/Navcrumbs";
import RestoreIcon from "@material-ui/icons/Restore";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
	icon: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		margin: "5px 5px 0px 5px",
	},
}));

const ClientDetails = () => {
	const classes = useStyles();
	const { id } = useParams();
	const [clientName, setClientName] = useState("");

	const getClientDetail = (detail) => {
		setClientName(detail.name);
	};

	return (
		<div className="client-details">
			<div className="flex justify-between">
				<div>
					<Navcrumbs crumbs={["Client", clientName]} />
					<div>
						<div className="left-section flex">
							<div style={{ display: "flex" }}>
								<b>Status:</b>{" "}
								<div
									className={classes.icon}
									style={{
										backgroundColor: "#24BA78",
									}}
								></div>
								Active
							</div>
							<div>
								<b>Last saved:</b> 21.10.20/1137 AEST
							</div>
						</div>
					</div>
				</div>
				<div className="right-section">
					<div className="restore">
						<RestoreIcon />
					</div>
				</div>
			</div>
			<div className={classes.detailContainer}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<ClientDetail clientId={+id} getClientDetail={getClientDetail} />
					</Grid>
					<Grid item xs={6}>
						<CompanyLogo />
						<RegionAndSites />
						<ClientDocuments />
					</Grid>
					<Grid item xs={6}>
						<ClientApplication clientId={+id} />
						<ClientNotes clientId={+id} />
						<KeyContacts clientId={+id} />
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default ClientDetails;
