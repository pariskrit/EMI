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
import Navcrumbs from "../../../components/Navcrumbs";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";
import RestoreIcon from "@material-ui/icons/Restore";

const options = [
	{ label: "Total Users", value: 0 },
	{ label: "Concurrent Users", value: 1 },
	{ label: "Per Job", value: 2 },
	{ label: "Site-Based Licencing", value: 3 },
];

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
const detail = {
	name: "",
	licenseType: { label: "", value: "" },
	licenses: 0,
	registeredBy: "",
	registeredDate: "11/11/2019",
	logoFilename: "",
	logoURL: "",
	logoKey: "",
};

const ClientDetails = () => {
	const classes = useStyles();
	const { id } = useParams();
	const [clientDetail, setClientDetail] = useState(detail);

	React.useEffect(() => {
		const fetchClient = async () => {
			try {
				const result = await API.get(`${BASE_API_PATH}Clients/${id}`);
				if (result.status === 200) {
					const licenseType = options.find(
						(x) => x.value === result.data.licenseType
					);
					setClientDetail({ ...result.data, licenseType });
				} else {
					throw new Error(result);
				}
			} catch (err) {
				console.log(err);
				return err;
			}
		};
		fetchClient();
	}, [id]);

	return (
		<div className="client-details">
			<div className="flex justify-between">
				<div>
					<Navcrumbs crumbs={["Client", clientDetail.name]} />
					<div>
						<div className="left-section flex" style={{ gap: "12px" }}>
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
						<ClientDetail
							clientId={+id}
							options={options}
							clientData={clientDetail}
						/>
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
