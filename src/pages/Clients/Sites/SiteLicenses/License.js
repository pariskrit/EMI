import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import AccordionBox from "components/Layouts/AccordionBox";
import { makeStyles } from "tss-react/mui";
import { clientOptions, LicenceType, siteOptions } from "helpers/constants";
import { useParams } from "react-router-dom";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getLocalStorageData } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import GaugeBar from "components/Modules/GaugeBar";

const useStyles = makeStyles()((theme) => ({
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	license_para: {
		margin: 0,
	},
	license_container: {
		display: "flex",
		flexDirection: "column",
		gap: "25px",
		fontSize: "0.875rem",
	},
	span: {
		marginLeft: 5,
	},
	licenseContainer: {
		display: "flex",
		width: "100%",
		justifyContent: "space-between",
	},
}));

function License({ details, loggedInUsersCount }) {
	const { classes, cx } = useStyles();
	const [input, setInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const { appId } = useParams();
	const { role } = getLocalStorageData("me");
	const dispatch = useDispatch();
	const onInputChange = (e) =>
		setInput({ ...input, [e.target.name]: e.target.value });

	const onDropDownInputChange = async (value) => {
		setInput({ ...input, licenseType: value?.value });
		try {
			await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenseType",
					value: value.value,
				},
			]);
		} catch (error) {
			dispatch(showError(`Failed to update license type.`));
		}
	};

	const updateInput = async () => {
		if (details?.licenses === input?.licenses) {
			return;
		}
		setIsUpdating(true);
		try {
			await patchApplicationDetail(appId, [
				{
					op: "replace",
					path: "licenses",
					value: input.licenses,
				},
			]);
		} catch (error) {
			dispatch(showError(`Failed to update license.`));
		} finally {
			setIsUpdating(false);
		}
	};

	const onEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			updateInput();
		}
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			setInput(details);
		}
	}, [details]);
	console.log("details ", details, LicenceType(details?.licenseLevel));
	// setting licensetype value to site licenseType value if client license type is equal to 'site-based' and site license type is equal to 'application-based'
	//  else set client license type value
	const licenseType =
		details?.licenseType === 5
			? siteOptions.find((option) => option?.value === details?.licenseType)
			: clientOptions.find((option) => option?.value === details?.licenseType);

	// same as licenseType Value
	const licenseCount = details?.licenseCount;
	const licensesUsed = details?.licensesUsed;

	const showExtraDetails = licenseType?.value === 1 || licenseType?.value === 2;
	return (
		<AccordionBox title="License">
			<div className={classes.licenseContainer}>
				<div>
					<section className={classes.license_container}>
						<p className={classes.license_para}>
							This Application is using a {LicenceType(details?.licenseLevel)}.
						</p>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<label>
									<b>License Type:</b>
								</label>
								<span className={classes.span}>{licenseType?.label}</span>
							</Grid>
							{showExtraDetails && (
								<Grid item xs={12}>
									<label>
										<b>License Count:</b>
									</label>
									<span className={classes.span}>{licenseCount}</span>
								</Grid>
							)}
						</Grid>
					</section>
				</div>

				{showExtraDetails && (
					<GaugeBar
						totalCount={licenseCount}
						totalUsed={licensesUsed}
						loggedInCount={loggedInUsersCount}
					/>
				)}
			</div>
		</AccordionBox>
	);
}

export default License;
