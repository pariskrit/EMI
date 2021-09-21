import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ColourConstants from "helpers/colourConstants";
import AccordionBox from "components/Layouts/AccordionBox";
import Divider from "@material-ui/core/Divider";

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
}));

const Application = ({ details }) => {
	// Init hooks
	const classes = useStyles();

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
					</Grid>
					<Grid item xs={6}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Purpose
							</Typography>

							<TextField
								variant="outlined"
								fullWidth
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
				</Grid>

				{/* --- Mobile View --- */}
				<Grid container className="mobileViewGrid">
					<Grid item xs={12}>
						<div className={classes.textInputContainer}>
							<Typography gutterBottom className={classes.labelText}>
								Name
							</Typography>

							<TextField
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
