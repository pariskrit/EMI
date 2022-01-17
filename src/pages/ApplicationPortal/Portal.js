import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SingleApplication from "./SingleApplication";
import Dropdown from "components/Elements/Dropdown";
import {
	getApplicationsAndSites,
	getClientList,
} from "services/applicationportal";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";

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
	const history = useHistory();
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
		// localStorage.setItem("isAdmin", client.isAdmin);
		sessionStorage.setItem("isAdmin", client.isAdmin);
	};

	const fetchListOfClients = async () => {
		const res = await getClientList();

		if (res.status) {
			setListOfClients([
				...res.data.map((client, index) => ({
					id: client.id,
					label: client.name,
					value: index,
					isAdmin: client.isAdmin,
				})),
			]);
		}
		setLoading({ ...isLoading, initial: false });
	};

	const fetchApplicationsAndSites = async (clientId) => {
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
		return (
			<div className="container">
				<CircularProgress />
			</div>
		);
	}
	const { position, multiSiteUser } = JSON.parse(localStorage.getItem("me"));
	if (position === null || multiSiteUser === true) {
		return (
			<div>
				<Grid
					container
					spacing={2}
					className={styles.header}
					alignItems="center"
				>
					<Grid item xs={12}>
						<Typography variant="h6" component="h1" gutterBottom>
							<strong>Application Portal</strong>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<div className={styles.siteContainer}>
							<Typography variant="subtitle2">Clients</Typography>
							<div style={{ width: "100px" }}>
								<Dropdown
									options={listOfClients}
									placeholder="Select Client"
									onChange={onInputChange}
									selectedValue={selectedClient}
								/>
							</div>
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
	} else {
		history.length > 1 ? history.goBack() : history.push("/app/me");
	}
}

export default Portal;
