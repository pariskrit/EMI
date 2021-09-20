import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import EMICheckbox from "components/Elements/EMICheckbox";
import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import React from "react";

const useStyles = makeStyles((theme) => ({
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

const ApplicationDetails = ({ inputData, setInputData, errors }) => {
	// Init hooks
	const classes = useStyles();

	return (
		<div className={classes.detailsContainer}>
			<AccordionBox title="Details">
				{/* --- Desktop View --- */}
				<Grid container className="desktopViewGrid">
					<Grid item xs={6}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name
							</Typography>

							<TextField
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								fullWidth
								value={inputData.name}
								onChange={(e) => {
									setInputData({ ...inputData, ...{ name: e.target.value } });
								}}
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
								error={errors.purpose === null ? false : true}
								helperText={errors.purpose === null ? null : errors.purpose}
								variant="outlined"
								fullWidth
								multiline
								rows={2}
								rowsMax={4}
								value={inputData.purpose}
								onChange={(e) => {
									setInputData({
										...inputData,
										...{ purpose: e.target.value },
									});
								}}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
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
												state={inputData.equipmentModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															equipmentModelStructure: !inputData.equipmentModelStructure,
														},
													});
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
												state={inputData.assetModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															assetModelStructure: !inputData.assetModelStructure,
														},
													});
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
								<FormGroup className={classes.tickboxSpacing}>
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
								<FormGroup className={classes.tickboxSpacing}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={inputData.showLubricants}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLubricants: !inputData.showLubricants,
														},
													});
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
												state={inputData.showParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showParts: !inputData.showParts,
														},
													});
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
												state={inputData.showOperatingMode}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showOperatingMode: !inputData.showOperatingMode,
														},
													});
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
												state={inputData.showSystem}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSystem: !inputData.showSystem,
														},
													});
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
												state={inputData.showDefectParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showDefectParts: !inputData.showDefectParts,
														},
													});
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
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								fullWidth
								value={inputData.name}
								onChange={(e) => {
									setInputData({ ...inputData, ...{ name: e.target.value } });
								}}
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
								error={errors.purpose === null ? false : true}
								helperText={errors.purpose === null ? null : errors.purpose}
								variant="outlined"
								fullWidth
								multiline
								rows={2}
								rowsMax={4}
								value={inputData.purpose}
								onChange={(e) => {
									setInputData({
										...inputData,
										...{ purpose: e.target.value },
									});
								}}
								InputProps={{
									classes: {
										input: classes.inputText,
									},
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
												state={inputData.equipmentModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															equipmentModelStructure: !inputData.equipmentModelStructure,
														},
													});
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
												state={inputData.assetModelStructure}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															assetModelStructure: !inputData.assetModelStructure,
														},
													});
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
												state={inputData.showLubricants}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showLubricants: !inputData.showLubricants,
														},
													});
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
												state={inputData.showParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showParts: !inputData.showParts,
														},
													});
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
												state={inputData.showOperatingMode}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showOperatingMode: !inputData.showOperatingMode,
														},
													});
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
												state={inputData.showSystem}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showSystem: !inputData.showSystem,
														},
													});
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
												state={inputData.showDefectParts}
												changeHandler={() => {
													setInputData({
														...inputData,
														...{
															showDefectParts: !inputData.showDefectParts,
														},
													});
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
						</div>
					</Grid>
				</Grid>
			</AccordionBox>
		</div>
	);
};

export default ApplicationDetails;
