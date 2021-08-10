import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ColourConstants from "../../../helpers/colourConstants";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import EMICheckbox from "../../../components/EMICheckbox";
import ProviderAsset from "../../../components/ProvidedAsset/ProvidedAsset";
import DropUpload from "../../../components/DropUpload";
import logo from "../../../assets/rm.png";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingLeft: "2%",
	},
	logoAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	logoContentParent: {
		width: "100%",
	},
	spinnerContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	trademarkContainer: {
		marginTop: 10,
	},
	trademarkText: {
		fontSize: "14px",
	},
}));

const ClientLogo = () => {
	const classes = useStyles();

	const [showUpload, setShowUpload] = useState(false);

	const handleLogoUpload = (fileKey, fileName) => {};

	return (
		<div className={classes.logoContainer}>
			<Accordion className={classes.logoAccordion}>
				<AccordionSummary
					expandIcon={
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.sectionHeading}>
						Company Logo (1)
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{showUpload ? (
						<div className={classes.logoContentParent}>
							<DropUpload uploadReturn={handleLogoUpload} applicationID={1} />
						</div>
					) : (
						<div className={classes.logoContentParent}>
							<ProviderAsset
								name="pari"
								src={logo}
								alt="some image"
								// handleDelete={handleDelete}
							/>

							<div>
								<FormGroup className={classes.trademarkContainer}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={true}
												changeHandler={() => {
													console.log("checked");
												}}
											/>
										}
										label={
											<Typography className={classes.trademarkText}>
												Is logo trademarked?
											</Typography>
										}
									/>
								</FormGroup>
							</div>
						</div>
					)}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default ClientLogo;
