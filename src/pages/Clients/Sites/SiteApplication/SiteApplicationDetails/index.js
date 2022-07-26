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
import TabTitle from "components/Elements/TabTitle";

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
				clientLicenseType: details.data.clientLicenseType,
				clientLicenses: details.data.clientLicenses,
				siteLicenseType: details.data.siteLicenseType,
				siteLicenses: details.data.siteLicenses,
			});
			setIsLoading(false);
			fetchSiteDetails();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [details]);
	return (
		<>
			<TabTitle title={`${details.data.application.name}`} />
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
					<License details={siteAppDetails} />
				</Grid>
				<Grid item xs={12}>
					<ServiceOptions details={siteAppDetails} loading={isLoading} />
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
