import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField } from "@mui/material";
import AccordionBox from "components/Layouts/AccordionBox";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Dropdown from "components/Elements/Dropdown";
import {
	clientOptions,
	siteApplicationOptions,
	siteOptions,
} from "helpers/constants";
import { useParams } from "react-router-dom";
import { Facebook } from "react-spinners-css";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getLocalStorageData } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { RESELLER_ID } from "constants/UserConstants/indes";
import roles from "helpers/roles";

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
	},
	span: {
		marginLeft: 5,
	},
}));

function License({ details, adminType, isClientAdmin }) {
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

	// setting licensetype value to site licenseType value if client license type is equal to 'site-based' and site license type is equal to 'application-based'
	//  else set client license type value
	const licenseType =
		details?.clientLicenseType === 4 && details?.siteLicenseType !== 5
			? siteOptions.find((option) => option?.value === details?.siteLicenseType)
			: clientOptions.find(
					(option) => option?.value === details?.clientLicenseType
			  );

	// same as licenseType Value
	const licenseCount =
		details?.clientLicenseType === 4 && details?.siteLicenseType !== 5
			? details?.siteLicenses
			: details?.clientLicenses;
	return (
		<AccordionBox title="License">
			{((details?.clientLicenseType === 4 && details?.siteLicenseType !== 5) ||
				details?.clientLicenseType !== 4) && (
				<section className={classes.license_container}>
					<p className={classes.license_para}>
						This Application is using a{" "}
						{details?.clientLicenseType === 4 && details?.siteLicenseType !== 5
							? "Site"
							: "Client"}{" "}
						License.
					</p>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<label>
								<b>License Type:</b>
							</label>
							<span className={classes.span}>{licenseType?.label}</span>
						</Grid>
						{licenseType?.value !== 3 && (
							<Grid item xs={12}>
								<label>
									<b>License Count:</b>
								</label>
								<span className={classes.span}>{licenseCount}</span>
							</Grid>
						)}
					</Grid>
				</section>
			)}
			{details?.clientLicenseType === 4 && details?.siteLicenseType === 5 && (
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">Licence Type</Typography>
							<Dropdown
								options={siteApplicationOptions}
								label=""
								width="auto"
								selectedValue={siteApplicationOptions.find(
									(item) => input?.licenseType === item.value
								)}
								onChange={onDropDownInputChange}
								isReadOnly={
									role !== roles.superAdmin ||
									adminType === RESELLER_ID ||
									isClientAdmin
								}
							/>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">Total Licence Count</Typography>
							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								name="licenses"
								value={input?.licenses ?? 0}
								InputProps={{
									endAdornment: isUpdating ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
								fullWidth
								type="number"
								variant="outlined"
								onChange={onInputChange}
								onBlur={updateInput}
								onKeyDown={onEnterKeyPress}
								disabled={
									role !== roles.superAdmin ||
									adminType === RESELLER_ID ||
									isClientAdmin
								}
							/>
						</div>
					</Grid>
				</Grid>
			)}
		</AccordionBox>
	);
}

export default License;
