import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import Typography from "@material-ui/core/Typography";
import ProviderAsset from "../../../components/ProvidedAsset/ProvidedAsset";
import DropUpload from "../../../components/DropUpload";
import API from "../../../helpers/api";
import ColourConstants from "../../../helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingRight: "2%",
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
}));

const SmallNavLogo = ({
	logoURL,
	newLogoKey,
	newLogoFilename,
	id,
	handleSave,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [loading, setIsLoading] = useState(true);
	const [showUpload, setShowUpload] = useState(false);
	const [logo, setLogo] = useState({
		name: "",
		src: "",
		alt: "",
	});

	// Handlers
	const handleGetLogo = async () => {
		try {
			// Fetching logo URI from backend
			let result = await API.get(`/api/applications/${id}`);

			if (result.status === 200) {
				setLogo({
					name: "Application Logo",
					alt: "Application Logo",
					src: result.data.logoURL,
				});

				return true;
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

			return false;
		}
	};
	const handleLogoUpload = (fileKey, fileName) => {
		newLogoKey(fileKey);
		newLogoFilename(fileName);

		handleSave(fileKey, fileName)
			.then(() => {
				// Saving new logo to db
				handleGetLogo()
					.then((res) => {
						if (res) {
							setShowUpload(false);
						} else {
							setShowUpload(true);
							setIsLoading(false);
						}
					})
					.catch((err) => {
						console.log(`ERROR UPDATING LOGO: ${err}`);
						setShowUpload(true);
						setIsLoading(false);
					});
			})
			.catch((err) => {
				console.log(err);
				setShowUpload(true);
				setIsLoading(false);
			});
	};
	const handleDelete = () => {
		// Showing uploader
		setShowUpload(true);

		// Updating logo state
		newLogoKey("");
		newLogoFilename("");

		// Removing stored logo
		setLogo({});
	};

	// Showing uploader if no logo, otherwise logo
	useEffect(() => {
		if (logoURL === null) {
			setShowUpload(true);
			setIsLoading(false);
		} else {
			setLogo({
				name: "Application logo",
				src: logoURL,
				alt: "Application logo",
			});

			setShowUpload(false);
			setIsLoading(false);
		}
		// eslint-disable-next-line
	}, []);

	if (loading) {
		return (
			<div className={`${classes.logoContainer} logoContainerRight`}>
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
							Small Navigation Logo
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className={classes.logoContentParent}>
							<div className={classes.spinnerContainer}>
								<CircularProgress />
							</div>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>
		);
	} else {
		return (
			<div className={`${classes.logoContainer} logoContainerRight`}>
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
							Small Navigation Logo
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{showUpload ? (
							<div className={classes.logoContentParent}>
								<DropUpload
									uploadReturn={handleLogoUpload}
									applicationID={id}
								/>
							</div>
						) : (
							<div className={classes.logoContentParent}>
								<ProviderAsset
									isRec={true}
									name={logo.name}
									src={logo.src}
									alt={logo.alt}
									handleDelete={handleDelete}
								/>
							</div>
						)}
					</AccordionDetails>
				</Accordion>
			</div>
		);
	}
};

export default SmallNavLogo;
