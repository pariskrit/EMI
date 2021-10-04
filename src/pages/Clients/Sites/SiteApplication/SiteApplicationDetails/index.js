import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Application from "./Application";
import License from "./License";
import ServiceOptions from "./ServiceOptions";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";

function SiteApplicationDetails({
	appId,
	state: { details, openConfirmationModal, isActive },
	dispatch,
}) {
	const [showLicenseTile, setShowLicenseTile] = useState(false);
	const [siteAppDetails, setSiteAppDetails] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const closeConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: false });

	const fetchSiteDetails = async () => {
		const siteResult = await getSiteDetails(details.data.siteID);

		if (siteResult?.data?.licenseType === 3) {
			setShowLicenseTile(true);
		}
	};

	const changeStatus = async () => {
		setIsUpdating(true);
		const result = await patchApplicationDetail(appId, [
			{ op: "replace", path: "isActive", value: !isActive },
		]);

		if (result.status) {
			dispatch({ type: "TOGGLE_ISACTIVE", payload: !isActive });
		} else {
			console.log("error");
		}

		setIsUpdating(false);
		closeConfirmationModal();
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			setSiteAppDetails({
				name: details.data.application.name,
				purpose: details.data.application.purpose,
				logo: {
					name: details.data.application.logoFilename,
					url: details.data.application.logoURL,
				},
				licenses: details.data.licenses,
				licenseType: details.data.licenseType,
				isActive: details.data.isActive,
				showServiceUserConfirmation: details.data.showServiceUserConfirmation,
				userConfirmationMessage: details.data.userConfirmationMessage,
				raisingDefectCopiesTaskName: details.data.raisingDefectCopiesTaskName,
			});
			setIsLoading(false);
			fetchSiteDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [details]);
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
					<Application details={siteAppDetails} loading={isLoading} />
				</Grid>
				<Grid item xs={12}>
					<ServiceOptions details={siteAppDetails} loading={isLoading} />
				</Grid>
				<Grid item xs={12}>
					{showLicenseTile ? <License details={siteAppDetails} /> : null}
				</Grid>
			</Grid>
		</>
	);
}

export default SiteApplicationDetails;
