import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import { getSiteAppKeyContacts } from "services/clients/sites/siteDetails";
import SiteDetails from "./SiteDetails";
import License from "./License";
import { siteOptions } from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";
import roles from "helpers/roles";

const Details = () => {
	const { id } = useParams();
	const [contactsList, setContactsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const cancelFetch = useRef(false);
	const [isApplicationsLoading, setApplicationsLoading] = useState(true);
	const [licenseData, setLicenseData] = useState({});

	const { position, siteAppID, role } = getLocalStorageData("me");

	const isClientAdmin = role === roles.clientAdmin;

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
				}))
			);

			if (result.data.length === 0) {
				setApplicationsLoading(false);
			}
		}
	};

	const fetchClient = async (
		licenseType,
		licenseCount,
		siteLicenseType,
		licenses,
		shareModels
	) => {
		setLicenseData({
			clientLicenseType: licenseType,
			clientLicenses: licenseCount,
			siteLicenseType,
			licenses,
			shareModels,
		});

		// site license type "Application-Based Licencing"
		if (licenseType === 5) {
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
							<SiteDetails
								siteId={id}
								fetchClient={fetchClient}
								position={position}
								siteAppID={siteAppID}
							/>
						</Grid>
						<Grid item xs={12}>
							<License
								siteId={id}
								licenseData={licenseData}
								isLoading={isLoading}
								isClientAdmin={isClientAdmin}
							/>
						</Grid>
						<Grid item xs={12}>
							<KeyContacts contactsList={contactsList} isLoading={isLoading} />
						</Grid>
						<Grid item xs={12}>
							<Applications
								siteId={id}
								position={position}
								siteAppID={siteAppID}
								fetchKeyContactsList={fetchKeyContactsList}
								isLoading={isApplicationsLoading}
								setIsLoading={setApplicationsLoading}
								role={role}
								isClientAdmin={isClientAdmin}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Details;
