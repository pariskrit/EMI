import React from "react";
import AccordionBox from "components/Layouts/SiteWrapper/AccordionBox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import EMICheckbox from "components/Elements/EMICheckbox";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	inputText: {
		fontSize: 14,
	},
	tickContainer: {
		paddingTop: "3%",
	},
	tickInputContainer: {
		width: "100%",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
}));
function ServiceOptions() {
	const classes = useStyles();

	return (
		<AccordionBox title="Service Options">
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography gutterBottom className={classes.labelText}>
						User Confirmation Message<span style={{ color: "#E31212" }}>*</span>
					</Typography>
					<Card variant="outlined" raised={false}>
						<CardContent sx={{ padding: "10px" }}>
							Please confirm that you are the person logged into this device. if
							not, please cancel the service and log back in under your own
							profile. Please do not use or share another person's log in
							details as this document may be uses in a court law.
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<div className={classes.tickInputContainer}>
						<FormGroup className={classes.tickboxSpacing}>
							<FormControlLabel
								control={
									<EMICheckbox
									// state={inputData.equipmentModelStructure}
									// changeHandler={() => {
									// 	setInputData({
									// 		...inputData,
									// 		...{
									// 			equipmentModelStructure: !inputData.equipmentModelStructure,
									// 		},
									// 	});
									// }}
									/>
								}
								label={
									<Typography className={classes.inputText}>
										Enable confirm user screen
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
									// state={inputData.equipmentModelStructure}
									// changeHandler={() => {
									// 	setInputData({
									// 		...inputData,
									// 		...{
									// 			equipmentModelStructure: !inputData.equipmentModelStructure,
									// 		},
									// 	});
									// }}
									/>
								}
								label={
									<Typography className={classes.inputText}>
										Raising a defect copies the task name into the defect
										description
									</Typography>
								}
							/>
						</FormGroup>
					</div>
				</Grid>
			</Grid>
		</AccordionBox>
	);
}

export default ServiceOptions;
