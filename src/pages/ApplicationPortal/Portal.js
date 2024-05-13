import { Grid, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import React, { useEffect, useState } from "react";
import {
	ClientAdminLogin,
	getApplicationsAndSites,
	getClientList,
} from "services/applicationportal";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SingleApplication from "./SingleApplication";
import Dropdown from "components/Elements/Dropdown";
import GeneralButton from "components/Elements/GeneralButton";
import roles from "helpers/roles";
import { setMeStorage } from "helpers/storage";
import { connect } from "react-redux";
import { authSlice } from "redux/auth/reducers";
import TabTitle from "components/Elements/TabTitle";
import { encryptToken } from "helpers/authenticationCrypto";
import { getLocalStorageData } from "helpers/utils";

const useStyles = makeStyles()((theme) => ({
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

function Portal({ setUserDetail }) {
	const { classes } = useStyles();
	const navigate = useNavigate();
	const [listOfClients, setListOfClients] = useState([]);
	const [selectedClient, setSelectedClient] = useState({});
	const [isLoading, setLoading] = useState({
		initial: true,
		showText: true,
		application: false,
	});
	const [applicationList, setApplicationList] = useState([]);
	const [clientId, setClientId] = useState(null);

	const onInputChange = async (client) => {
		setSelectedClient(client);
		await fetchApplicationsAndSites(client?.id);
		sessionStorage.setItem("isAdmin", client?.isAdmin);
		sessionStorage.setItem("clientUserId", client?.isAdmin ? client?.id : null);
	};

	const fetchListOfClients = async () => {
		const res = await getClientList();

		if (res.status) {
			let clientData = res.data.map((client, index) => ({
				id: client.id,
				label: client.name,
				value: index,
				isAdmin: client.isAdmin,
			}));

			setListOfClients(clientData);

			if (clientData.length === 1) {
				await onInputChange(clientData?.[0]);
				setLoading((prev) => ({ ...prev, initial: false }));
				return;
			}
		}
		setLoading((prev) => ({ ...prev, initial: false }));
	};

	const fetchApplicationsAndSites = async (clientId) => {
		setLoading((prev) => ({ ...prev, applications: true, showText: false }));
		const res = await getApplicationsAndSites(clientId);
		setApplicationList(res.data);
		setClientId(clientId);
		setLoading((prev) => ({ ...prev, applications: false, showText: false }));
	};

	useEffect(() => {
		fetchListOfClients();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setClientAdminMode = async () => {
		async function setClientStorage() {
			return new Promise(async (res) => {
				const clientAdmin = await ClientAdminLogin(selectedClient?.id);

				sessionStorage.setItem(
					"clientAdminMode",
					JSON.stringify(selectedClient)
				);
				localStorage.setItem("clientAdminMode", JSON.stringify(selectedClient));

				//setting role property to clientAdmin
				const localStorageData = getLocalStorageData("me");
				const modifiedRoleData = {
					...localStorageData,
					role: roles.clientAdmin,
				};
				sessionStorage.setItem("me", JSON.stringify(modifiedRoleData));
				localStorage.setItem("me", JSON.stringify(modifiedRoleData));

				// Reset to client admin mode
				const data = {
					...clientAdmin?.data,
					role: roles.clientAdmin,
					isSiteUser: false,
				};
				sessionStorage.setItem(
					"token",
					encryptToken(clientAdmin?.data?.jwtToken)
				);
				localStorage.setItem(
					"token",
					encryptToken(clientAdmin?.data?.jwtToken)
				);
				await setMeStorage(data);
				setUserDetail(data);
				res(true);
			});
		}
		await setClientStorage();
		navigate(`/app/client/${selectedClient.id}`);
	};

	if (isLoading.initial) {
		return (
			<div className="container">
				<CircularProgress />
			</div>
		);
	}
	return (
		<div>
			<TabTitle title="Application Portal" />
			<Grid
				container
				spacing={2}
				className={classes.header}
				alignItems="center"
			>
				<Grid item xs={12}>
					<Typography variant="h6" component="h1" gutterBottom>
						<strong>Application Portal</strong>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">Clients</Typography>
						<div style={{ width: "100%", display: "flex", gap: 12 }}>
							<Dropdown
								options={listOfClients}
								placeholder="Select Client"
								onChange={onInputChange}
								selectedValue={selectedClient}
							/>
							{selectedClient.isAdmin ? (
								<GeneralButton
									style={{
										padding: "6px 22px",
										fontSize: "14.5px",
										//height: 40,
										width: "180px",
									}}
									onClick={setClientAdminMode}
								>
									CLIENT ADMIN MODE
								</GeneralButton>
							) : null}
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
							className={classes.para}
						>
							Select a client to view the applications
						</Typography>
					</Grid>
				) : null}

				{isLoading.applications ? (
					<Grid item xs={9} className={classes.para}>
						<CircularProgress />
					</Grid>
				) : (
					applicationList?.map((application) => (
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
const mapDispatchToProps = (dispatch) => ({
	setUserDetail: (data) => dispatch(authSlice.actions.dataSuccess({ data })),
});

export default connect(null, mapDispatchToProps)(Portal);
