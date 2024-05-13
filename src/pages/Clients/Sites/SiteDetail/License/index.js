import { CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import Dropdown from "components/Elements/Dropdown";
import AccordionBox from "components/Layouts/AccordionBox";
import { RESELLER_ID } from "constants/UserConstants/indes";
import {
	clientOptions,
	siteOptions,
	siteSettingShareModelsOptions,
} from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Facebook } from "react-spinners-css";
import { showError } from "redux/common/actions";
import { updateSiteDetails } from "services/clients/sites/siteDetails";
import roles from "helpers/roles";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: "25px !important",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	inputText: {
		fontSize: 14,
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
	licensecount_input: {
		color: "rgba(0, 0, 0, 0.87) !important",
	},
}));

function License({ siteId, isLoading = false, licenseData, isClientAdmin }) {
	const { classes, cx } = useStyles();
	const [license, setLicense] = useState({});
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
	const [isUpdating, setUpdating] = useState(false);
	const [currentLicense, setCurrentLicense] = useState({});
	const dispatch = useDispatch();
	const { role, adminType } = getLocalStorageData("me");

	const { siteLicenseType: selectedLicenseType, licenses: licenseCount } =
		licenseData;

	const handleInputChange = (e) => {
		setLicense({ ...license, licenseCount: e.target.value });
	};

	const onEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			handleUpdateLicenseFields({
				label: "licenses",
				value: license.licenseCount,
			});
		}
	};

	// handle licenses input field change
	const handleLicenseInputChange = (value) => {
		setLicense({
			...license,
			licenseType: value,
		});

		setOpenConfirmationDialog(true);
	};

	const handleUpdateLicenseFields = async (payload) => {
		if (payload.label !== "licenseType") setUpdating({ licenseCount: true });

		const response = await updateSiteDetails(siteId, payload);

		if (!response.status) {
			dispatch(
				showError(response.data?.detail || response?.data || "Could not update")
			);
		}

		setUpdating(false);
	};

	const onCloseConfirmationDialog = () => {
		setLicense({ ...license, licenseType: currentLicense });
		setOpenConfirmationDialog(false);
	};

	const handleConfirmDropdown = async () => {
		setUpdating(true);
		await handleUpdateLicenseFields({
			label: "licenseType",
			value: license.licenseType.value,
		});
		setCurrentLicense(license.licenseType);
		setOpenConfirmationDialog(false);
	};

	useEffect(() => {
		setLicense({
			licenseType: { value: selectedLicenseType },
			licenseCount,
		});
		setCurrentLicense(
			siteOptions.find((option) => option.value === selectedLicenseType)
		);
	}, [selectedLicenseType, licenseCount]);

	// getting the name of the client license type.
	const clientLicenseType = clientOptions.find(
		(option) => option.value === licenseData?.clientLicenseType
	)?.label;
	//share models value
	const shareModels = licenseData.shareModels;
	//Share model information
	const shareModelContent = siteSettingShareModelsOptions.find(
		(option) => option.value === shareModels
	)?.label;

	return (
		<>
			<ConfirmChangeDialog
				open={openConfirmationDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseConfirmationDialog}
				handleChangeConfirm={handleConfirmDropdown}
			/>
			<AccordionBox title="Licenses" accordionClass={classes.detailContainer}>
				{isLoading && <CircularProgress />}
				{licenseData.clientLicenseType !== 4 && !isLoading && (
					<section className={classes.license_container}>
						<p className={classes.license_para}>
							This Site is using a Client License.
						</p>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<label>
									<b>License Type :</b>
								</label>
								<span className={classes.span}>{clientLicenseType}</span>
							</Grid>
							{licenseData.clientLicenseType !== 3 && (
								<Grid item xs={12}>
									<label>
										<b>License Count :</b>
									</label>
									<span className={classes.span}>
										{licenseData?.clientLicenses}
									</span>
								</Grid>
							)}
							{shareModels !== 0 && (
								<Grid item xs={12}>
									<label>
										<b>
											{shareModels === 1
												? "Client Model Sharing :"
												: "Model Sharing :"}
										</b>
									</label>
									<span className={classes.span}>{shareModelContent}</span>
								</Grid>
							)}
						</Grid>
					</section>
				)}

				{licenseData.clientLicenseType === 4 && !isLoading && (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography className={classes.labelText}>
								License Type<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<Dropdown
								options={siteOptions}
								selectedValue={siteOptions.find(
									(item) => item.value === license.licenseType.value
								)}
								onChange={handleLicenseInputChange}
								label=""
								required={true}
								width="100%"
								isReadOnly={
									role !== roles.superAdmin ||
									adminType === RESELLER_ID ||
									isClientAdmin
								}
							/>
						</Grid>
						<Grid item xs={6}>
							<div className={classes.siteContainer}>
								<Typography className={classes.labelText}>
									Total License Count
									<span style={{ color: "#E31212" }}>*</span>
								</Typography>
								<TextField
									sx={{
										"& .MuiInputBase-input.Mui-disabled": {
											WebkitTextFillColor: "#000000",
										},
									}}
									name="licenses"
									className={classes.licensecount_input}
									InputProps={{
										endAdornment: isUpdating.licenseCount ? (
											<Facebook size={20} color="#A79EB4" />
										) : null,
									}}
									disabled={
										role !== roles.superAdmin ||
										isUpdating ||
										adminType === RESELLER_ID ||
										isClientAdmin
									}
									fullWidth
									type="number"
									variant="outlined"
									value={license.licenseCount || ""}
									onChange={handleInputChange}
									onBlur={() =>
										handleUpdateLicenseFields({
											label: "licenses",
											value: license.licenseCount,
										})
									}
									onKeyDown={onEnterKeyPress}
								/>
							</div>
						</Grid>
					</Grid>
				)}
			</AccordionBox>
		</>
	);
}

export default License;
