import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EMICheckbox from "components/Elements/EMICheckbox";
import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import React, { useEffect, useState } from "react";
import { updateApplicaitonDetails } from "services/applications/detailsScreen/application";
import { Facebook } from "react-spinners-css";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { RESELLER_ID } from "constants/UserConstants/indes";

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
	},
	tickContainer: {
		paddingTop: "3%",
	},
	tickInputContainer: {
		width: "100%",
	},
	tickboxSpacing: {
		marginLeft: "15%",
	},
	tickboxSpacingMobile: {
		marginLeft: "0%",
	},
}));

const ApplicationDetails = ({
	inputData,
	originalInputData,
	setInputData,
	errors,
	id,
	adminType,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	const [isFetching, setIsFetching] = useState({});
	const [localData, setLocalData] = useState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (originalInputData) setLocalData(originalInputData);
	}, [originalInputData]);

	const handleUpdateDetail = async (value, name) => {
		if (name === "name") {
			if (value === "") {
				setInputData((prev) => ({
					...prev,
					name: localData.name,
				}));
				return;
			}
		}

		setIsFetching((prev) => ({ ...prev, [name]: true }));
		try {
			const payload = [
				{
					op: "replace",
					path: name,
					value: value,
				},
			];
			const response = await updateApplicaitonDetails(id, payload);
			if (response.status) {
				setLocalData((prev) => ({
					...prev,
					...{
						[name]: value,
					},
				}));
			} else {
				setInputData((prev) => ({
					...prev,
					...{
						[name]: localData[name],
					},
				}));
				setLocalData((prev) => ({
					...prev,
					...{
						[name]: localData[name],
					},
				}));
				dispatch(
					showError(response?.data?.detail || "Could not update " + name)
				);
			}
		} catch (error) {
			dispatch(showError("Could not update " + name));
		}
		setIsFetching((prev) => ({ ...prev, [name]: false }));
	};

	const Readonly = adminType === RESELLER_ID;
	return (
		<div className={classes.detailsContainer}>
			<AccordionBox title="Details">
				{/* --- Desktop View --- */}
				<Grid container className="desktopViewGrid">
					<Grid item xs={6}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name<span style={{ color: "#E31212" }}>*</span>
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								fullWidth
								value={inputData.name}
								onChange={(e) => {
									setInputData({ ...inputData, ...{ name: e.target.value } });
								}}
								onBlur={() => {
									if (!Readonly) handleUpdateDetail(inputData.name, "name");
								}}
								InputProps={{
									readOnly: Readonly,
									classes: {
										input: classes.inputText,
									},
									endAdornment: isFetching["name"] ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
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
								error={errors.purpose === null ? false : true}
								helperText={errors.purpose === null ? null : errors.purpose}
								variant="outlined"
								fullWidth
								multiline
								minRows={2}
								maxRows={4}
								value={inputData.purpose}
								onChange={(e) => {
									setInputData({
										...inputData,
										...{ purpose: e.target.value },
									});
								}}
								onBlur={() => {
									if (!Readonly)
										handleUpdateDetail(inputData.purpose, "purpose");
								}}
								InputProps={{
									readOnly: Readonly,
									classes: {
										input: classes.inputText,
									},
									endAdornment: isFetching["purpose"] ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
							/>
						</div>
					</Grid>

					<Grid item xs={6}>
						<div className={classes.tickContainer}>
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.equipmentModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															equipmentModelStructure:
																!inputData.equipmentModelStructure,
														},
													});
													handleUpdateDetail(
														!inputData.equipmentModelStructure,
														"allowIndividualAssetModels"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Individual Asset Model
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.assetModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															assetModelStructure:
																!inputData.assetModelStructure,
														},
													});
													handleUpdateDetail(
														!inputData.assetModelStructure,
														"allowFacilityBasedModels"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Facility-Based Model
											</Typography>
										}
									/>
								</FormGroup>
							</div>
							{/* 
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showLocations}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLocations: !inputData.showLocations,
														},
													});
													handleUpdateDetail(
														!inputData.showLocations,
														"showLocations"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Locations
											</Typography>
										}
									/>
								</FormGroup>
							</div> */}

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showLubricants}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLubricants: !inputData.showLubricants,
														},
													});
													handleUpdateDetail(
														!inputData.showLubricants,
														"showLubricants"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Lubricants
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showParts: !inputData.showParts,
														},
													});
													handleUpdateDetail(!inputData.showParts, "showParts");
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Parts
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showOperatingMode}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showOperatingMode: !inputData.showOperatingMode,
														},
													});
													handleUpdateDetail(
														!inputData.showOperatingMode,
														"showOperatingMode"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Operating Mode
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showSystem}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSystem: !inputData.showSystem,
														},
													});
													handleUpdateDetail(
														!inputData.showSystem,
														"showSystem"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show System
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showDefectParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showDefectParts: !inputData.showDefectParts,
														},
													});
													handleUpdateDetail(
														!inputData.showDefectParts,
														"showDefectParts"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Defect Parts
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							{/* <div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={inputData.showModel}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showModel: !inputData.showModel,
														},
													});
													handleUpdateDetail(!inputData.showModel, "showModel");
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Model
											</Typography>
										}
									/>
								</FormGroup>
							</div> */}

							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showSerialNumberRange}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSerialNumberRange:
																!inputData.showSerialNumberRange,
														},
													});
													handleUpdateDetail(
														!inputData.showSerialNumberRange,
														"showSerialNumberRange"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Serial Number Range
											</Typography>
										}
									/>
								</FormGroup>
							</div>
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showArrangements}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showArrangements: !inputData.showArrangements,
														},
													});
													handleUpdateDetail(
														!inputData.showArrangements,
														"showArrangements"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Arrangements
											</Typography>
										}
									/>
								</FormGroup>
							</div>
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.allowRegisterAssetsForServices}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															allowRegisterAssetsForServices:
																!inputData.allowRegisterAssetsForServices,
														},
													});
													handleUpdateDetail(
														!inputData.allowRegisterAssetsForServices,
														"allowRegisterAssetsForServices"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Allow New Assets When Registering a Service
											</Typography>
										}
									/>
								</FormGroup>
							</div>
						</div>
					</Grid>
				</Grid>

				{/* --- Mobile View --- */}
				<Grid container className="mobileViewGrid">
					<Grid item xs={12}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name<span style={{ color: "#E31212" }}>*</span>
							</Typography>

							<TextField
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								fullWidth
								value={inputData.name}
								onChange={(e) => {
									setInputData({ ...inputData, ...{ name: e.target.value } });
								}}
								onBlur={() => {
									handleUpdateDetail(inputData.name, "name");
								}}
								InputProps={{
									readOnly: Readonly,
									classes: {
										input: classes.inputText,
									},
									endAdornment: isFetching["name"] ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
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
								error={errors.purpose === null ? false : true}
								helperText={errors.purpose === null ? null : errors.purpose}
								variant="outlined"
								fullWidth
								multiline
								minRows={2}
								maxRows={4}
								value={inputData.purpose}
								onChange={(e) => {
									setInputData({
										...inputData,
										...{ purpose: e.target.value },
									});
								}}
								onBlur={() => {
									handleUpdateDetail(inputData.purpose, "purpose");
								}}
								InputProps={{
									readOnly: Readonly,
									classes: {
										input: classes.inputText,
									},
									endAdornment: isFetching["purpose"] ? (
										<Facebook size={20} color="#A79EB4" />
									) : null,
								}}
							/>
						</div>
					</Grid>

					<Grid item xs={12}>
						<div className={classes.tickContainer}>
							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.equipmentModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															equipmentModelStructure:
																!inputData.equipmentModelStructure,
														},
													});
													handleUpdateDetail(
														!inputData.equipmentModelStructure,
														"allowIndividualAssetModels"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Individual Asset Model
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.assetModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															assetModelStructure:
																!inputData.assetModelStructure,
														},
													});
													handleUpdateDetail(
														!inputData.assetModelStructure,
														"allowFacilityBasedModels"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Facility-Based Model
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={inputData.showLocations}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLocations: !inputData.showLocations,
														},
													});
													handleUpdateDetail(
														!inputData.showLocations,
														"showLocations"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Locations
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showLubricants}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLubricants: !inputData.showLubricants,
														},
													});
													handleUpdateDetail(
														!inputData.showLubricants,
														"showLubricants"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Lubricants
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showParts: !inputData.showParts,
														},
													});
													handleUpdateDetail(!inputData.showParts, "showParts");
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Parts
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showOperatingMode}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showOperatingMode: !inputData.showOperatingMode,
														},
													});
													handleUpdateDetail(
														!inputData.showOperatingMode,
														"showOperatingMode"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Operating Mode
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showSystem}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSystem: !inputData.showSystem,
														},
													});
													handleUpdateDetail(
														!inputData.showSystem,
														"showSystem"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show System
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showDefectParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showDefectParts: !inputData.showDefectParts,
														},
													});
													handleUpdateDetail(
														!inputData.showDefectParts,
														"showDefectParts"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Defect Parts
											</Typography>
										}
									/>
								</FormGroup>
							</div>

							{/* <div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={inputData.showModel}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showModel: !inputData.showModel,
														},
													});
													handleUpdateDetail(!inputData.showModel, "showModel");
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Model
											</Typography>
										}
									/>
								</FormGroup>
							</div> */}

							<div className={classes.tickInputContainer}>
								<FormGroup className={`${classes.tickboxSpacing} ticketBox`}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showSerialNumberRange}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSerialNumberRange:
																!inputData.showSerialNumberRange,
														},
													});
													handleUpdateDetail(
														!inputData.showSerialNumberRange,
														"showSerialNumberRange"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Serial Number Range
											</Typography>
										}
									/>
								</FormGroup>
							</div>
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.showArrangements}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showArrangements: !inputData.showArrangements,
														},
													});
													handleUpdateDetail(
														!inputData.showArrangements,
														"showArrangements"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Show Arrangements
											</Typography>
										}
									/>
								</FormGroup>
							</div>
							<div className={classes.tickInputContainer}>
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												disabled={Readonly}
												state={inputData.allowRegisterAssetsForServices}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															allowRegisterAssetsForServices:
																!inputData.allowRegisterAssetsForServices,
														},
													});
													handleUpdateDetail(
														!inputData.allowRegisterAssetsForServices,
														"allowRegisterAssetsForServices"
													);
												}}
											/>
										}
										label={
											<Typography className={classes.inputText}>
												Allow New Assets When Registering a Service
											</Typography>
										}
									/>
								</FormGroup>
							</div>
						</div>
					</Grid>
				</Grid>
			</AccordionBox>
		</div>
	);
};

export default ApplicationDetails;
