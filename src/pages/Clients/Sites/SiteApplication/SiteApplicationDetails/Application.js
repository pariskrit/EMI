import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ColourConstants from "helpers/colourConstants";
import AccordionBox from "components/Layouts/AccordionBox";
import Divider from "@mui/material/Divider";
import { CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import EMICheckbox from "components/Elements/EMICheckbox";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import roles from "helpers/roles";

const useStyles = makeStyles()((theme) => ({
	detailsContainer: {
		marginTop: 15,
		display: "flex",
		justifyContent: "center",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	detailsAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99.5%",
	},
	textInputContainer: {
		marginBottom: 17,
		width: "100%",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	inputText: {
		fontSize: 14,
		//cursor: "none",
		color: "#000000de",
	},
	checkboxText: {
		fontSize: 14,
	},

	assetParentContainer: {
		display: "flex",
		flexWrap: "wrap",
		width: "100%",
	},

	dividerStyle: {
		width: "100%",
		backgroundColor: ColourConstants.divider,
	},
	imageAssetContainer: {
		width: 141,
		height: 61,
		marginTop: 10,
		marginBottom: 10,
		display: "flex",
		alignItems: "center",
	},
	linkContainer: {
		display: "flex",
		alignItems: "center",
		paddingLeft: 10,
		gap: "30px",
	},
	assetImage: {
		minWidth: "100%",
		maxWidth: "100%",
		minHeight: "100%",
		maxHeight: "100%",
		objectFit: "contain",
		display: "flex",
		marginRight: 20,
		borderColor: ColourConstants.commonBorder,
		borderWidth: 1,
		borderStyle: "solid",
	},
	tickInput: {
		marginTop: "40px",
	},
	serviceTick: {
		marginTop: "5px",
	},
	tickbox_label: {
		marginLeft: "0 !important",
	},
}));

const Application = ({
	details,
	loading,
	customCaptions,
	stateDispatch,
	isReadOnly,
}) => {
	// Init hooks
	const { role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const { classes } = useStyles();
	const [checkLists, setCheckLists] = useState({});
	const { appId } = useParams();
	const dispatch = useDispatch();
	const [serviceLoading, setServiceLoading] = useState({
		raisingDefectCopiesTaskName: false,
		showServiceClientName: false,
	});

	const onraisingDefectCopiesTaskNameChange = async (path, value) => {
		setServiceLoading((prev) => ({
			...prev,
			[path]: true,
		}));

		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: path,
				value: value,
			},
		]);

		if (result.status) {
			setCheckLists({
				...checkLists,
				[path]: value,
			});
			const result = await getSiteApplicationDetail(appId);

			if (result.status) {
				stateDispatch({
					type: "SET_SITE_APP_DETAIL",
					payload: result,
				});

				stateDispatch({
					type: "TOGGLE_ISACTIVE",
					payload: result?.data?.isActive,
				});
			}
		}

		if (!result.status) {
			dispatch(showError(result?.data?.title));
		}

		setServiceLoading((prev) => ({
			...prev,
			[path]: false,
		}));
	};

	useEffect(() => {
		if (Object.keys(details).length > 0) {
			const {
				raisingDefectCopiesTaskName,
				userConfirmationMessage,
				showServiceUserConfirmation,
				showServiceClientName,
			} = details;

			setCheckLists({
				raisingDefectCopiesTaskName,
				userConfirmationMessage,
				showServiceUserConfirmation,
				showServiceClientName,
			});
		}
	}, [details]);

	if (loading) {
		return (
			<AccordionBox title="Details">
				<CircularProgress />
			</AccordionBox>
		);
	}

	return (
		<div className={classes.detailsContainer}>
			<AccordionBox title="Details">
				{/* --- Desktop View --- */}
				<Grid container className="desktopViewGrid" spacing={2}>
					<Grid item xs={6}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								variant="outlined"
								fullWidth
								disabled
								value={details?.name ?? ""}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
								}}
							/>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Purpose
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								variant="outlined"
								fullWidth
								disabled
								value={details?.purpose ?? ""}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
								}}
							/>
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.assetParentContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Logo
							</Typography>
							<Divider className={classes.dividerStyle} />

							<div className={classes.linkContainer}>
								<div className={classes.imageAssetContainer}>
									<img
										src={details?.logo?.url}
										alt="name"
										className={classes.assetImage}
									/>
								</div>

								<Typography>{details?.name}</Typography>
							</div>

							<Divider className={classes.dividerStyle} />
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.tickInput}>
							<FormGroup className={classes.tickboxSpacing}>
								<FormControlLabel
									control={
										<EMICheckbox
											state={checkLists.raisingDefectCopiesTaskName ?? false}
											changeHandler={() =>
												onraisingDefectCopiesTaskNameChange(
													"raisingDefectCopiesTaskName",
													!checkLists.raisingDefectCopiesTaskName
												)
											}
											disabled={
												serviceLoading.raisingDefectCopiesTaskName || isReadOnly
											}
										/>
									}
									label={
										<Typography className={classes.checkboxText}>
											Raising a {customCaptions?.defect ?? "defect"} copies the{" "}
											{customCaptions?.task ?? "task"} name into the{" "}
											{customCaptions?.defect ?? "defect"} description
										</Typography>
									}
									className={classes.tickbox_label}
								/>
							</FormGroup>
						</div>
						<div className={classes.serviceTick}>
							<FormGroup className={classes.tickboxSpacing}>
								<FormControlLabel
									control={
										<EMICheckbox
											state={checkLists.showServiceClientName ?? false}
											// changeHandler={onServiceClientChange}
											changeHandler={() =>
												onraisingDefectCopiesTaskNameChange(
													"showServiceClientName",
													!checkLists.showServiceClientName
												)
											}
											disabled={
												serviceLoading.showServiceClientName ||
												isReadOnly ||
												role !== roles.superAdmin
											}
										/>
									}
									label={
										<Typography className={classes.checkboxText}>
											Show Client Name in {customCaptions?.service ?? "Service"}{" "}
											Screens
										</Typography>
									}
									className={classes.tickbox_label}
								/>
							</FormGroup>
						</div>
					</Grid>
				</Grid>

				{/* --- Mobile View --- */}
				<Grid container className="mobileViewGrid">
					<Grid item xs={12}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								variant="outlined"
								fullWidth
								value={details?.name ?? ""}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
								}}
							/>
						</div>

						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Purpose
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								variant="outlined"
								fullWidth
								multiline
								minRows={2}
								maxRows={4}
								value={details?.purpose ?? ""}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
								}}
							/>
						</div>
					</Grid>
				</Grid>
			</AccordionBox>
		</div>
	);
};

export default Application;
