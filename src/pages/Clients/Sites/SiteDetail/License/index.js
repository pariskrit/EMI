import {
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import Dropdown from "components/Elements/Dropdown";
import AccordionBox from "components/Layouts/AccordionBox";
import { clientOptions, siteOptions } from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Facebook } from "react-spinners-css";
import { showError } from "redux/common/actions";
import { updateSiteDetails } from "services/clients/sites/siteDetails";

const useStyles = makeStyles((theme) => ({
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

function License({ siteId, isLoading = false, licenseData }) {
	const classes = useStyles();
	const [license, setLicense] = useState({});
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
	const [isUpdating, setUpdating] = useState(false);
	const dispatch = useDispatch();
	const { role } = getLocalStorageData("me");

	const { selectedLicenseType, licenseCount } = licenseData;

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
				showError(response.data?.detail || response.data || "Could not update")
			);
		}

		setUpdating(false);
	};

	const onCloseConfirmationDialog = () => setOpenConfirmationDialog(false);

	const handleConfirmDropdown = async () => {
		setUpdating(true);
		await handleUpdateLicenseFields({
			label: "licenseType",
			value: license.licenseType.value,
		});
		setOpenConfirmationDialog(false);
	};

	useEffect(() => {
		setLicense({
			licenseType: selectedLicenseType,
			licenseCount,
		});
	}, [selectedLicenseType, licenseCount]);

	// getting the name of the client license type.
	const clientLicenseType = clientOptions.find(
		(option) => option.value === licenseData?.clientLicenseType
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
				{licenseData.clientLicenseType !== 3 && !isLoading && (
					<section className={classes.license_container}>
						<p className={classes.license_para}>
							This Site is using a Client License.
						</p>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<label>
									<b>License Type:</b>
								</label>
								<span className={classes.span}>{clientLicenseType}</span>
							</Grid>
							{licenseData.clientLicenseType !== 2 && (
								<Grid item xs={12}>
									<label>
										<b>License Count:</b>
									</label>
									<span className={classes.span}>
										{licenseData?.clientLicenses}
									</span>
								</Grid>
							)}
						</Grid>
					</section>
				)}

				{licenseData.clientLicenseType === 3 && !isLoading && (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography className={classes.labelText}>
								License Type<span style={{ color: "#E31212" }}>*</span>
							</Typography>
							<Dropdown
								options={siteOptions}
								selectedValue={license.licenseType}
								onChange={handleLicenseInputChange}
								label=""
								required={true}
								width="100%"
								isReadOnly={role !== "SuperAdmin"}
							/>
						</Grid>
						<Grid item xs={6}>
							<div className={classes.siteContainer}>
								<Typography className={classes.labelText}>
									Total License Count
									<span style={{ color: "#E31212" }}>*</span>
								</Typography>
								<TextField
									name="licenses"
									className={classes.licensecount_input}
									InputProps={{
										endAdornment: isUpdating.licenseCount ? (
											<Facebook size={20} color="#A79EB4" />
										) : null,
									}}
									disabled={role !== "SuperAdmin" || isUpdating}
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
