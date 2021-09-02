import { Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import Dropdown from "components/Dropdown";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import { siteOptions } from "helpers/constants";
import "./siteDetails.scss";

const useStyles = makeStyles((theme) => ({
	required: {
		color: "red",
	},
	siteContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
}));

const SiteDetails = ({ siteId, setError }) => {
	const classes = useStyles();
	const { clientId } = useParams();
	const [siteDetails, setSiteDetails] = useState({ oldData: {}, newData: {} });
	const [listOfRegions, setListOfRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState({});
	const [clientLicenseType, setClientLicenseType] = useState(0);
	const [selectedLicenseType, setSelectedLicenseType] = useState({});
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [newInput, setNewInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);

	const openConfirmChangeDialog = (e) => {
		if (newInput.value === siteDetails.oldData[newInput.label]) {
			return;
		}

		setOpenConfirmDialog(true);
	};

	const closeConfirmChangeDialog = () => {
		setNewInput({});
		setOpenConfirmDialog(false);
	};

	const onInputChange = (e) => {
		setNewInput({ label: e.target.name, value: e.target.value });
		setSiteDetails({
			...siteDetails,
			newData: { ...siteDetails.newData, [e.target.name]: e.target.value },
		});
	};

	const setSelectedInputValue = (e) => {
		setNewInput({ label: e.target.name, value: e.target.value || null });
	};

	const onEnterKeyPress = (e) => {
		if (e.key === "Enter") {
			e.target.blur();
			openConfirmChangeDialog();
		}
	};

	const onDropDownInputChange = (value, inputName) => {
		if (inputName === "region") {
			const { regionName } = siteDetails.oldData;
			if (value.label === regionName) {
				setSelectedRegion(value);
				return;
			}

			setSelectedRegion(value);
			const region = listOfRegions.find(
				(region) => region.name === value.label
			);

			setNewInput({ label: "regionID", value: region.id });
		} else {
			setSelectedLicenseType(value);
			setNewInput({ label: "licenseType", value: value.value });
		}

		setOpenConfirmDialog(true);
	};

	const onConfirmChange = async () => {
		setIsUpdating(true);

		try {
			const response = await API.patch(`${BASE_API_PATH}sites/${siteId}`, [
				{ op: "replace", path: newInput.label, value: newInput.value },
			]);
			setIsUpdating(false);
			setOpenConfirmDialog(false);

			if (response.status === 404 || response.status === 400) {
				throw new Error(response);
			}
		} catch (error) {
			if (Object.keys(error.response.data.errors).length !== 0) {
				setError(error.response.data.errors.name);
			} else if (error.response.data.detail !== undefined) {
				setError(error.response.data.detail);
			} else {
				setError("Something went wrong!");
			}

			setIsUpdating(false);
			setOpenConfirmDialog(false);
		}
	};

	const fetchSiteDetails = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}sites/${siteId}`);

			setSiteDetails({ oldData: result.data, newData: result.data });
			setNewInput(result.data);
			fetchListOfRegions(result.data.regionName);
			fetchClient(result.data.licenseType);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchListOfRegions = async (regionName) => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}Regions/?clientId=${clientId}`
			);

			const indexOfSelectedRegion = result.data.findIndex(
				(region) => region.name === regionName
			);
			setListOfRegions(result.data);
			setSelectedRegion({ label: regionName, value: indexOfSelectedRegion });
		} catch (error) {
			console.log(error);
		}
	};

	const fetchClient = async (licenseType) => {
		try {
			const response = await API.get(`${BASE_API_PATH}clients/${clientId}`);

			setClientLicenseType(response.data.licenseType);

			if (response.data.licenseType === 3) {
				const licenseName = siteOptions.find(
					(option) => option.value === licenseType
				);
				setSelectedLicenseType({
					label: licenseName.label,
					value: licenseName.value,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSiteDetails();
	}, []);

	const { newData } = siteDetails;

	return (
		<>
			<ConfirmChangeDialog
				open={openConfirmDialog}
				isUpdating={isUpdating}
				closeHandler={closeConfirmChangeDialog}
				handleChangeConfirm={onConfirmChange}
			/>

			{/* Desktop View */}
			<div className="siteDetailsContainerDesktop">
				<Grid container spacing={2}>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Site name<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="name"
								fullWidth
								variant="outlined"
								value={newData?.name || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Region<span className={classes.required}>*</span>
							</Typography>
							<Dropdown
								options={listOfRegions.map((region, index) => ({
									label: region.name,
									value: index,
								}))}
								selectedValue={selectedRegion}
								label=""
								required={true}
								onChange={(value) => onDropDownInputChange(value, "region")}
								width="auto"
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Company Name<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="company"
								fullWidth
								variant="outlined"
								value={newData?.company || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Address<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="address"
								fullWidth
								variant="outlined"
								value={newData?.address || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
								multiline
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Business Number<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="businessNumber"
								fullWidth
								variant="outlined"
								value={newData?.businessNumber || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Licence Type<span className={classes.required}>*</span>
							</Typography>
							<Dropdown
								options={siteOptions}
								selectedValue={selectedLicenseType}
								label=""
								required={true}
								width="auto"
								onChange={(value) => onDropDownInputChange(value, "license")}
								disabled={clientLicenseType !== 3}
							/>
						</div>
					</Grid>
					<Grid item sm={6}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Total Licence Count<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="licenses"
								fullWidth
								type="number"
								variant="outlined"
								value={newData?.licenses || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
								disabled={clientLicenseType === 3}
							/>
						</div>
					</Grid>
				</Grid>
			</div>

			{/* Mobile View */}
			<div className="siteDetailsContainerMobile">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Site name<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="name"
								fullWidth
								variant="outlined"
								value={newData?.name || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Region<span className={classes.required}>*</span>
							</Typography>
							<Dropdown
								options={listOfRegions.map((region, index) => ({
									label: region.name,
									value: index,
								}))}
								selectedValue={selectedRegion}
								label=""
								required={true}
								onChange={(value) => onDropDownInputChange(value, "region")}
								width="auto"
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Company Name<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="company"
								fullWidth
								variant="outlined"
								value={newData?.company || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Address<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="address"
								fullWidth
								variant="outlined"
								value={newData?.address || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
								multiline
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Business Number<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="businessNumber"
								fullWidth
								variant="outlined"
								value={newData?.businessNumber || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Licence Type<span className={classes.required}>*</span>
							</Typography>
							<Dropdown
								options={siteOptions}
								selectedValue={selectedLicenseType}
								label=""
								required={true}
								width="auto"
								onChange={(value) => onDropDownInputChange(value, "license")}
								disabled={clientLicenseType !== 3}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.siteContainer}>
							<Typography variant="subtitle2">
								Total Licence Count<span className={classes.required}>*</span>
							</Typography>
							<TextField
								name="licenses"
								fullWidth
								type="number"
								variant="outlined"
								value={newData?.licenses || ""}
								onChange={onInputChange}
								onBlur={openConfirmChangeDialog}
								onFocus={setSelectedInputValue}
								onKeyDown={onEnterKeyPress}
								disabled={clientLicenseType === 3}
							/>
						</div>
					</Grid>
				</Grid>
			</div>
		</>
	);
};

const mapStateToProps = ({ commonData: { error } }) => ({
	error,
});

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetails);
