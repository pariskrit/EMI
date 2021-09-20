import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import Application from "./Application";
import License from "./License";
import ServiceOptions from "./ServiceOptions";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/customCaptions";
import { SiteContext } from "contexts/SiteApplicationContext";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";

function SiteApplicationDetails({ appId }) {
	const [showLicenseTile, setShowLicenseTile] = useState(false);
	const [{ details, openConfirmationModal }, dispatch] = useContext(
		SiteContext
	);
	const [isUpdating, setIsUpdating] = useState(false);

	const closeConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: false });

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(appId);

			dispatch({
				type: "SET_SITE_APP_DETAIL",
				payload: {
					name: result.data.application.name,
					purpose: result.data.application.purpose,
					logo: {
						name: result.data.application.logoFilename,
						url: result.data.application.logoURL,
					},
					licenses: result.data.licenses,
					licenseType: result.data.licenseType,
					isActive: result.data.isActive,
				},
			});

			const siteResult = await getSiteDetails(result.data.siteID);

			if (siteResult.data.licenseType === 3) {
				setShowLicenseTile(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const changeStatus = async () => {
		setIsUpdating(true);
		const result = await patchApplicationDetail(appId, [
			{ op: "replace", path: "isActive", value: !details.isActive },
		]);

		if (!result.status) {
			console.log("error");
		}
		await fetchSiteApplicationDetails();
		setIsUpdating(false);
		closeConfirmationModal();
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<ConfirmChangeDialog
				open={openConfirmationModal}
				closeHandler={closeConfirmationModal}
				handleChangeConfirm={changeStatus}
				isUpdating={isUpdating}
			/>
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
		</>
	);
}

export default SiteApplicationDetails;
