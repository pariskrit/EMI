import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
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
	cardContent: {
		maxWidth: "fit-content",
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
					<Card
						variant="outlined"
						raised={false}
						className={classes.cardContent}
					>
						<CardContent>
							<p>
								Please confirm that you are the person logged into this device.
								<br /> if not, please cancel the service and log back in under
								your own profile.
								<br />
								<br /> Please do not use or share another person's log in
								details as this document may be uses in a court law.
							</p>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<div className={classes.tickInputContainer}>
						<FormGroup className={classes.tickboxSpacing}>
							<FormControlLabel
								control={<EMICheckbox state={true} changeHandler={() => {}} />}
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
								control={<EMICheckbox state={false} changeHandler={() => {}} />}
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
