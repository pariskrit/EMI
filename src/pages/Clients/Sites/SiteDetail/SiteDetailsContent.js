import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import { getSiteAppKeyContacts } from "services/clients/sites/siteDetails";
import SiteDetails from "./SiteDetails";
import License from "./License";
import { getClientDetails } from "services/clients/clientDetailScreen";
import { siteOptions } from "helpers/constants";

const Details = () => {
	const { id, clientId } = useParams();
	const [contactsList, setContactsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const cancelFetch = useRef(false);
	const [isApplicationsLoading, setApplicationsLoading] = useState(true);
	const [licenseData, setLicenseData] = useState({});

	const fetchKeyContactsList = async () => {
		const result = await getSiteAppKeyContacts(id);

		if (cancelFetch.current) {
			return;
		}

		if (result.status) {
			setContactsList(
				result.data.map((data) => ({
					id: data.siteAppID,
					name: data.displayName,
					product: data.name,
					email: data.email,
					phone: data.phone,
				}))
			);

			if (result.data.length === 0) {
				setApplicationsLoading(false);
			}
		}
	};

	const fetchClient = async (licenseType, licenseCount) => {
		const result = await getClientDetails(clientId);

		if (result.status) {
			setLicenseData({
				clientLicenseType: result.data.licenseType,
				clientLicenses: result.data.licenses,
			});

			if (result.data.licenseType === 3) {
				const licenseName = siteOptions.find(
					(option) => option.value === licenseType
				);
				setLicenseData((prev) => ({
					...prev,
					selectedLicenseType: {
						label: licenseName.label,
						value: licenseName.value,
					},
					licenseCount,
				}));
			}
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchKeyContactsList();

		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div style={{ marginTop: 22 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<SiteDetails siteId={id} fetchClient={fetchClient} />
						</Grid>
						<Grid item xs={12}>
							<License
								siteId={id}
								licenseData={licenseData}
								isLoading={isLoading}
							/>
						</Grid>
						<Grid item xs={12}>
							<KeyContacts contactsList={contactsList} isLoading={isLoading} />
						</Grid>
						<Grid item xs={12}>
							<Applications
								siteId={id}
								fetchKeyContactsList={fetchKeyContactsList}
								isLoading={isApplicationsLoading}
								setIsLoading={setApplicationsLoading}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Details;
