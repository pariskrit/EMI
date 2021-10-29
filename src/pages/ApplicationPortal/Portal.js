import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

// MOCK DATA IMPORTS
import zm from "assets/zm.png";
import rm from "assets/rm.png";
import es from "assets/es.png";
import SingleApplication from "./SingleApplication";
import Dropdown from "components/Elements/Dropdown";
import {
	getApplicationsAndSites,
	getClientList,
} from "services/applicationportal";

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

const useStyles = makeStyles((theme) => ({
	header: {
		marginBottom: " 5px",
	},
}));

function Portal() {
	const styles = useStyles();
	const [listOfClients, setListOfClients] = useState([]);
	const [selectedClient, setSelectedClient] = useState({});

	const onInputChange = (client) => {
		setSelectedClient(client);
		fetchApplicationsAndSites(client.id);
	};

	const fetchListOfClients = async () => {
		const res = await getClientList(26);

		if (res.status) {
			setListOfClients([
				...res.data.map((client, index) => ({
					id: client.id,
					label: client.name,
					value: index,
				})),
			]);
		}
	};

	const fetchApplicationsAndSites = async (clientId) => {
		const res = await getApplicationsAndSites(clientId);
		console.log(res);
	};

	useEffect(() => {
		fetchListOfClients();
	}, []);

	return (
		<div>
			<Grid container spacing={2} className={styles.header} alignItems="center">
				<Grid item xs={3}>
					<Typography variant="h6" component="h1" gutterBottom>
						<strong>Application Portal</strong>
					</Typography>
				</Grid>

				<Grid item xs={9}>
					<Grid container alignItems="center">
						<Grid item xs={1}>
							<Typography variant="h6" component="h3" gutterBottom>
								<strong>Client</strong>
							</Typography>
						</Grid>

						<Grid item xs={11}>
							<Dropdown
								options={listOfClients}
								placeholder="Select Client"
								onChange={onInputChange}
								selectedValue={selectedClient}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				{MOCK_DATA.map((application) => (
					<SingleApplication data={application} key={application.name} />
				))}
			</Grid>
		</div>
	);
}

export default Portal;
