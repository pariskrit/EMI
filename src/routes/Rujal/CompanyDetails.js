import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	TextField,
	Typography,
} from "@material-ui/core";
import ColourConstants from "../../helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	detailAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
	},
	inputText: {
		fontSize: 14,
	},
}));
const CompanyDetails = () => {
	const classes = useStyles();

	return (
		<Accordion className={classes.detailAccordion} expanded={true}>
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
				<div>
					<Typography className={classes.sectionHeading}>
						Company Details
					</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container spacing={5}>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Company Name<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Liscense Type<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Total Liscense Count<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registration Date<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							value="18/11/2019"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
								readOnly: true,
							}}
						/>
					</Grid>
					<Grid item sm={6}>
						<Typography className={classes.labelText}>
							Registered By<span style={{ color: "red" }}>*</span>
						</Typography>
						<TextField
							value="Russel Harland"
							variant="outlined"
							fullWidth
							InputProps={{
								classes: {
									input: classes.inputText,
								},
								readOnly: true,
							}}
						/>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};

export default CompanyDetails;
