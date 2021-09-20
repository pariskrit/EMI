import { Grid } from "@material-ui/core";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "helpers/api";
import Application from "./Application";
import License from "./License";
import ServiceOptions from "./ServiceOptions";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/customCaptions";

function SiteApplicationDetails() {
	const { appId } = useParams();
	const [details, setDetails] = useState({});
	const [showLicenseTile, setShowLicenseTile] = useState(false);

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(appId);
			const siteResult = await getSiteDetails(result.data.siteID);

			if (siteResult.data.licenseType === 3) {
				setShowLicenseTile(true);
			}
			setDetails({
				name: result.data.application.name,
				purpose: result.data.application.purpose,
				logo: {
					name: result.data.application.logoFilename,
					url: result.data.application.logoURL,
				},
				licenses: result.data.licenses,
				licenseType: result.data.licenseType,
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Application details={details} />
			</Grid>
			<Grid item xs={12}>
				<ServiceOptions />
			</Grid>
			<Grid item xs={12}>
				{showLicenseTile ? <License licenseDetails={details} /> : null}
			</Grid>
		</Grid>
	);
}

export default SiteApplicationDetails;
