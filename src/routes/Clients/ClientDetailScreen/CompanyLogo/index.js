import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import DropUploadBox from "components/DropUploadBox";
import EMICheckbox from "components/EMICheckbox";
import ErrorDialog from "components/ErrorDialog";
import ProviderAsset from "components/ProvidedAsset/ProvidedAsset";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 15,
		display: "flex",
		justifyContent: "flex-start",
		//paddingLeft: "2%",
	},
	logoAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
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
	const { id } = useParams();
	const [showUpload, setShowUpload] = useState(true);
	const [logo, setLogo] = useState({});
	const [filesUploading, setFilesUploading] = useState(false);
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	const onLogoUpload = async (key, url) => {
		try {
			await API.patch(`${BASE_API_PATH}Clients/${id}`, [
				{ op: "replace", path: "logoKey", value: key },
			]);
			fetchClientLogo();
		} catch (error) {
			console.log(error);
		}
	};

	const fetchClientLogo = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}Clients/${id}`);
			if (result.data.logoURL) {
				setLogo({
					name: result.data.logoFilename,
					src: result.data.logoURL,
					alt: result.data.logoFilename,
				});
				setShowUpload(false);
			}

			if (filesUploading) {
				setFilesUploading(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onDeleteLogo = (id) => {
		setLogo({});
		setShowUpload(true);
	};

	useEffect(() => {
		fetchClientLogo();
	}, []);

	return (
		<div className={classes.logoContainer}>
			<ErrorDialog
				open={open}
				handleClose={() => setOpen(false)}
				message={errorMessage}
			/>
			<Accordion className={classes.logoAccordion} defaultExpanded={true}>
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
							<DropUploadBox
								uploadReturn={onLogoUpload}
								clientID={id}
								isImageUploaded={true}
								filesUploading={filesUploading}
								setFilesUploading={setFilesUploading}
								setErrorMessage={setErrorMessage}
								setOpenErrorModal={setOpen}
							/>
						</div>
					) : (
						<div className={classes.logoContentParent}>
							<ProviderAsset
								name={logo.name}
								src={logo.src}
								alt={logo.alt}
								deleteLogo={onDeleteLogo}
							/>
						</div>
					)}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default ClientLogo;
