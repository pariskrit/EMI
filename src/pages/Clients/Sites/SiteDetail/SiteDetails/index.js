import {
	Grid,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "components/Elements/Dropdown";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import { fetchSiteDetail, setNavCrumbs } from "redux/siteDetail/actions";
import {
	getListOfRegions,
	updateSiteDetails,
} from "services/clients/sites/siteDetails";
import "./siteDetails.scss";
import { Facebook } from "react-spinners-css";
import AccordionBox from "components/Layouts/AccordionBox";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";

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
	setCrumbs,
	fetchClient,
}) => {
	const classes = useStyles();
	const { clientId } = useParams();
	const [newSiteDetails, setNewSiteDetails] = useState({});
	const [listOfRegions, setListOfRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState({});
	const [newInput, setNewInput] = useState({});
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
	const [isUpdating, setUpdating] = useState(false);

	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

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
			onUpdateInput();
		}
	};

	const onCloseConfirmationDialog = () => setOpenConfirmationDialog(false);

	const onRegionInputChange = (value) => {
		const { regionName } = siteDetails;

		if (value.label === regionName) {
			setSelectedRegion({ value });
			return;
		}

		const region = listOfRegions.find((region) => region.name === value.label);

		setSelectedRegion({
			value,
			newInput: { label: "regionID", value: region.id },
		});

		setOpenConfirmationDialog(true);
	};

	const handleConfirmDropdown = async () => {
		setUpdating(true);

		const response = await updateSiteDetails(siteId, selectedRegion?.newInput);

		if (!response.status) {
			setError(response.data.detail);
		} else {
			await fetchSiteDetails();
		}

		setOpenConfirmationDialog(false);
		setUpdating(false);
	};

	const onUpdateInput = async () => {
		if (newInput.value === siteDetails[newInput.label]) {
			return;
		}

		setUpdating({ [newInput.label]: { isUpdating: true } });

		const response = await updateSiteDetails(siteId, newInput);
		await fetchSiteDetails();
		if (!response.status) {
			setError(response.data.detail);
		}
		setUpdating(false);
	};

	const fetchSiteDetails = async () => {
		const result = await handlefetchSiteDetail(siteId, clientId);

		if (cancelFetch.current) {
			return;
		}

		try {
			if (result.status) {
				localStorage.setItem(
					"crumbs",
					JSON.stringify({
						clientName: result.data.clientName,
						siteName: result.data.name,
					})
				);

				setNewSiteDetails(result.data);
				setNewInput(result.data);
				fetchListOfRegions(result.data.regionName);
				fetchClient(result.data.licenseType, result.data.licenses);
			} else {
				setError(result.data.detail);
			}
		} catch (error) {
			setError(error.message || "Somethin went wrong");
		}

		setIsLoading(false);
	};

	const fetchListOfRegions = async (regionName) => {
		const result = await getListOfRegions(clientId);

		if (result.status) {
			const indexOfSelectedRegion = result.data.findIndex(
				(region) => region.name === regionName
			);
			setListOfRegions(result.data);
			setSelectedRegion({
				value: { label: regionName, value: indexOfSelectedRegion },
			});
		}
	};

	useEffect(() => {
		fetchSiteDetails();

		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<ConfirmChangeDialog
				open={openConfirmationDialog}
				isUpdating={isUpdating}
				closeHandler={onCloseConfirmationDialog}
				handleChangeConfirm={handleConfirmDropdown}
			/>
			<AccordionBox title="Site Details">
				{/* Desktop View */}
				{isLoading ? (
					<CircularProgress />
				) : (
					<>
						<div className="siteDetailsContainerDesktop">
							<Grid container spacing={2}>
								<Grid item sm={6}>
									<div className={classes.siteContainer}>
										<Typography variant="subtitle2">
											Site name<span className={classes.required}>*</span>
										</Typography>
										<TextField
											name="name"
											InputProps={{
												endAdornment: isUpdating["name"]?.isUpdating ? (
													<Facebook size={20} color="#A79EB4" />
												) : null,
											}}
											disabled={isUpdating["name"]?.isUpdating}
											fullWidth
											variant="outlined"
											value={newSiteDetails?.name || ""}
											onChange={onInputChange}
											onBlur={onUpdateInput}
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
											selectedValue={selectedRegion.value}
											label=""
											required={true}
											onChange={(value) => onRegionInputChange(value)}
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
											InputProps={{
												endAdornment: isUpdating["company"]?.isUpdating ? (
													<Facebook size={20} color="#A79EB4" />
												) : null,
											}}
											disabled={isUpdating["company"]?.isUpdating}
											fullWidth
											variant="outlined"
											value={newSiteDetails?.company || ""}
											onChange={onInputChange}
											onBlur={onUpdateInput}
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
											InputProps={{
												endAdornment: isUpdating["address"]?.isUpdating ? (
													<Facebook size={20} color="#A79EB4" />
												) : null,
											}}
											disabled={isUpdating["address"]?.isUpdating}
											fullWidth
											variant="outlined"
											value={newSiteDetails?.address || ""}
											onChange={onInputChange}
											onBlur={onUpdateInput}
											onFocus={setSelectedInputValue}
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
											InputProps={{
												endAdornment: isUpdating["businessNumber"]
													?.isUpdating ? (
													<Facebook size={20} color="#A79EB4" />
												) : null,
											}}
											disabled={isUpdating["businessNumber"]?.isUpdating}
											fullWidth
											variant="outlined"
											value={newSiteDetails?.businessNumber || ""}
											onChange={onInputChange}
											onBlur={onUpdateInput}
											onFocus={setSelectedInputValue}
											onKeyDown={onEnterKeyPress}
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
											onBlur={onUpdateInput}
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
											onChange={(value) => onRegionInputChange(value)}
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
											onBlur={onUpdateInput}
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
											onBlur={onUpdateInput}
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
											onBlur={onUpdateInput}
											onFocus={setSelectedInputValue}
											onKeyDown={onEnterKeyPress}
										/>
									</div>
								</Grid>
							</Grid>
						</div>
					</>
				)}
			</AccordionBox>
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
	handlefetchSiteDetail: (siteId, clientId) =>
		dispatch(fetchSiteDetail(siteId, clientId)),
	setCrumbs: (crumbs) => dispatch(setNavCrumbs(crumbs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteDetails);
