import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SingleApplication from "./SingleApplication";
import Dropdown from "components/Elements/Dropdown";
import {
	getApplicationsAndSites,
	getClientList,
} from "services/applicationportal";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	header: {
		marginBottom: " 5px",
	},
	para: {
		marginTop: "25px",
	},
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

function Portal() {
	const styles = useStyles();
	const [listOfClients, setListOfClients] = useState([]);
	const [selectedClient, setSelectedClient] = useState({});
	const [isLoading, setLoading] = useState({
		initial: true,
		showText: true,
		application: false,
	});
	const [applicationList, setApplicationList] = useState([]);
	const [clientId, setClientId] = useState(null);

	const onInputChange = (client) => {
		setSelectedClient(client);
		fetchApplicationsAndSites(client.id);
	};

	const fetchListOfClients = async () => {
		const res = await getClientList(24);

		if (res.status) {
			setListOfClients([
				...res.data.map((client, index) => ({
					id: client.id,
					label: client.name,
					value: index,
				})),
			]);
		}
		setLoading({ ...isLoading, initial: false });
	};

	const fetchApplicationsAndSites = async (clientId) => {
		const selectedClient = listOfClients.find(
			(client) => client.id === clientId
		);
		setLoading({ ...isLoading, applications: true, showText: false });
		const res = await getApplicationsAndSites(clientId);
		setApplicationList(res.data);
		setClientId(clientId);

		setLoading({ ...isLoading, applications: false, showText: false });
	};

	useEffect(() => {
		fetchListOfClients();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLoading.initial) {
		return <CircularProgress />;
	}

	return (
		<div>
			<Grid container spacing={2} className={styles.header} alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h6" component="h1" gutterBottom>
						<strong>Application Portal</strong>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<div className={styles.siteContainer}>
						<Typography variant="subtitle2">Clients</Typography>
						<Dropdown
							options={listOfClients}
							placeholder="Select Client"
							onChange={onInputChange}
							selectedValue={selectedClient}
						/>
					</div>
				</Grid>
			</Grid>

			<Grid container spacing={5}>
				{isLoading.showText ? (
					<Grid item xs={9}>
						<Typography
							variant="subtitle1"
							gutterBottom
							component="div"
							className={styles.para}
						>
							Select a client to view the applications
						</Typography>
					</Grid>
				) : null}

				{isLoading.applications ? (
					<Grid item xs={9} className={styles.para}>
						<CircularProgress />
					</Grid>
				) : (
					applicationList.map((application) => (
						<SingleApplication
							data={application}
							key={application.id}
							clientId={clientId}
						/>
					))
				)}
			</Grid>
		</div>
	);
}

export default Portal;
