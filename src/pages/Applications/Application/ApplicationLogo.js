import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import EMICheckbox from "components/Elements/EMICheckbox";
import ProviderAsset from "components/Modules/ProvidedAsset/ProvidedAsset";
import DropUploadBox from "components/Elements/DropUploadBox";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import AccordionBox from "components/Layouts/AccordionBox";

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

const ApplicationLogo = ({
	logoTrademark,
	logoURL,
	logoName,
	newLogoKey,
	newLogoFilename,
	newLogoTrademark,
	id,
	handleSave,
}) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [loading, setIsLoading] = useState(true);
	const [showUpload, setShowUpload] = useState(false);
	const [filesUploading, setFilesUploading] = useState(false);
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
					name: result.data.logoFilename,
					alt: result.data.logoFilename,
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
		setFilesUploading(false);

		// Updating logo state
		newLogoKey("");
		newLogoFilename("");

		// Removing stored logo
		setLogo({});
	};
	const handleTickChange = (currentState, setCurrentState) => {
		setCurrentState(!currentState);
	};

	// Showing uploader if no logo, otherwise logo
	useEffect(() => {
		if (logoURL === null) {
			setShowUpload(true);
			setIsLoading(false);
		} else {
			setLogo({
				name: logoName,
				src: logoURL,
				alt: logoName,
			});

			setShowUpload(false);
			setIsLoading(false);
		}
		// eslint-disable-next-line
	}, []);

	if (loading) {
		return (
			<div className={`${classes.logoContainer} logoContainer`}>
				<AccordionBox title="Application Logo" defaultExpanded={false}>
					<div className={classes.logoContentParent}>
						<div className={classes.spinnerContainer}>
							<CircularProgress />
						</div>
					</div>
				</AccordionBox>
			</div>
		);
	} else {
		return (
			<div className={`${classes.logoContainer} logoContainer`}>
				<AccordionBox title="Application Logo" defaultExpanded={false}>
					{showUpload ? (
						<div className={classes.logoContentParent}>
							<DropUploadBox
								uploadReturn={handleLogoUpload}
								apiPath={`${BASE_API_PATH}Applications/${id}/upload`}
								isImageUploaded={true}
								inApplication={true}
								filesUploading={filesUploading}
								setFilesUploading={setFilesUploading}
							/>
						</div>
					) : (
						<div className={classes.logoContentParent}>
							<ProviderAsset
								isRec={true}
								name={logo.name}
								src={logo.src}
								alt={logo.alt}
								deleteLogo={handleDelete}
								deleteEndpoint={`${BASE_API_PATH}Applications`}
							/>

							<div>
								<FormGroup className={classes.trademarkContainer}>
									<FormControlLabel
										control={
											<EMICheckbox
												state={logoTrademark}
												changeHandler={() => {
													handleTickChange(logoTrademark, newLogoTrademark);
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
				</AccordionBox>
			</div>
		);
	}
};

export default ApplicationLogo;
