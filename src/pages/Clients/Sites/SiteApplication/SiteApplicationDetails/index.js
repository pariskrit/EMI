import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Application from "./Application";
import License from "./License";
import ServiceOptions from "./ServiceOptions";
import { getSiteDetails } from "services/clients/sites/siteDetails";
import {
	getSiteAppKeyContacts,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import { connect } from "react-redux";
import { setNavCrumbs } from "redux/siteDetail/actions";
import { clientsPath, siteDetailPath } from "helpers/routePaths";
import RiskRatingImage from "./RiskRatingImage";
import KeyContacts from "./KeyContacts";

function SiteApplicationDetails({
	appId,
	state: {
		details,
		openConfirmationModal,
		isActive,
		defaultCustomCaptionsData,
	},
	dispatch,
	setCrumbs,
	clientId,
}) {
	console.log(details);
	const [showLicenseTile, setShowLicenseTile] = useState(false);
	const [siteAppDetails, setSiteAppDetails] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [keyContacts, setKeyContacts] = useState([]);

	const closeConfirmationModal = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_MODAL", payload: false });

	const fetchSiteDetails = async () => {
		const [siteResult, keyContactResult] = await Promise.all([
			getSiteDetails(details.data.siteID),
			getSiteAppKeyContacts(details.data?.id),
		]);
		setKeyContacts(keyContactResult.data);

		localStorage.setItem(
			"crumbs",
			JSON.stringify({
				clientName: siteResult.data?.clientName,
				siteName: siteResult.data?.name,
				applicationName: details.data?.application?.name,
			})
		);
		setCrumbs([
			{
				id: 1,
				name: siteResult.data.clientName,
				url: clientsPath + `/${clientId}`,
			},
			{
				id: 2,
				name: siteResult.data.name,
				url: `${clientsPath}/${clientId}/sites/${details.data.siteID}${siteDetailPath}`,
			},
			{
				id: 3,
				name: details.data.application.name,
			},
		]);
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
		const isDetailsPresent = Object.keys(details).length > 0;
		if (isDetailsPresent) {
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
					<Application
						details={siteAppDetails}
						loading={isLoading}
						customCaptions={defaultCustomCaptionsData}
					/>
				</Grid>
				<Grid item xs={12}>
					<ServiceOptions details={siteAppDetails} loading={isLoading} />
				</Grid>
				<Grid item xs={12}>
					{showLicenseTile ? <License details={siteAppDetails} /> : null}
				</Grid>
				<Grid item xs={12}>
					<KeyContacts
						details={details}
						data={keyContacts}
						loading={isLoading}
					/>
				</Grid>
				<Grid item xs={12}>
					<RiskRatingImage details={details} loading={isLoading} />
				</Grid>
			</Grid>
		</>
	);
}

const mapDispatchToProps = (dispatch) => ({
	setCrumbs: (crumbs) => dispatch(setNavCrumbs(crumbs)),
});

export default connect(null, mapDispatchToProps)(SiteApplicationDetails);
// export default SiteApplicationDetails;
