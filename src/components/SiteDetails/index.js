import {
	Grid,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmChangeDialog from "components/ConfirmChangeDialog";
import Dropdown from "components/Dropdown";
import { siteOptions } from "helpers/constants";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import { fetchSiteDetail } from "redux/siteDetail/actions";
import { getClientDetails } from "services/clients/clientDetailScreen";
import {
	getListOfRegions,
	updateSiteDetails,
} from "services/clients/sites/siteDetails";
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

const SiteDetails = ({
	siteId,
	setError,
	siteDetails,
	handlefetchSiteDetail,
}) => {
	const classes = useStyles();
	const { clientId } = useParams();
	const [newSiteDetails, setNewSiteDetails] = useState({});
	const [listOfRegions, setListOfRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState({});
	const [clientLicenseType, setClientLicenseType] = useState(0);
	const [selectedLicenseType, setSelectedLicenseType] = useState({});
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [newInput, setNewInput] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const openConfirmChangeDialog = (e) => {
		if (newInput.value === siteDetails[newInput.label]) {
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
		setNewSiteDetails({
			...newSiteDetails,
			[e.target.name]: e.target.value,
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
			const { regionName } = siteDetails;
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

		const response = await updateSiteDetails(siteId, newInput);

		if (!response.status) {
			setError(response.data.detail);
		}
		setIsUpdating(false);
		setOpenConfirmDialog(false);
	};

	const fetchSiteDetails = async () => {
		const result = await handlefetchSiteDetail(siteId);

		if (cancelFetch.current) {
			return;
		}

		if (result.status) {
			setNewSiteDetails(result.data);
			setNewInput(result.data);
			fetchListOfRegions(result.data.regionName);
			fetchClient(result.data.licenseType);
		} else {
			setError(result.data.detail);
		}
	};

	const fetchListOfRegions = async (regionName) => {
		const result = await getListOfRegions(clientId);

		if (result.status) {
			const indexOfSelectedRegion = result.data.findIndex(
				(region) => region.name === regionName
			);
			setListOfRegions(result.data);
			setSelectedRegion({ label: regionName, value: indexOfSelectedRegion });
		}
	};

	const fetchClient = async (licenseType) => {
		const result = await getClientDetails(clientId);

		if (result.status) {
			setClientLicenseType(result.data.licenseType);

			if (result.data.licenseType === 3) {
				const licenseName = siteOptions.find(
					(option) => option.value === licenseType
				);
				setSelectedLicenseType({
					label: licenseName.label,
					value: licenseName.value,
				});
			}
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchSiteDetails();

		return () => {
			cancelFetch.current = true;
		};
	}, []);

	if (isLoading) {
		return <CircularProgress />;
	}

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
								value={newSiteDetails?.name || ""}
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
								value={newSiteDetails?.company || ""}
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
								value={newSiteDetails?.address || ""}
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
								value={newSiteDetails?.businessNumber || ""}
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
								value={newSiteDetails?.licenses || ""}
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
								value={newSiteDetails?.name || ""}
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
								value={newSiteDetails?.company || ""}
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
								value={newSiteDetails?.address || ""}
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
								value={newSiteDetails?.businessNumber || ""}
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
								value={newSiteDetails?.licenses || ""}
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

const mapStateToProps = ({
	commonData: { error },
	siteDetailData: { siteDetails },
}) => ({
	error,
	siteDetails,
});

const mapDispatchToProps = (dispatch) => ({
	setError: (message) => dispatch(showError(message)),
	handlefetchSiteDetail: (siteId) => dispatch(fetchSiteDetail(siteId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetails);
