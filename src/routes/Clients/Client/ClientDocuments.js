import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ColourConstants from "../../../helpers/colourConstants";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import Typography from "@material-ui/core/Typography";
import DropUploadBox from "../../../components/DropUploadBox";
import ProvidedAssetNoImage from "../../../components/ProvidedAsset/ProvidedAssetNoImage";
import API from "../../../helpers/api";
import { useParams } from "react-router-dom";
import { BASE_API_PATH } from "../../../helpers/constants";
import ErrorDialog from "../../../components/ErrorDialog";

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
	uploaderContainer: {
		marginTop: "2%",
	},
	dividerStyle: {
		width: "100%",
	},
}));
function ClientDocuments() {
	const classes = useStyles();
	const { id } = useParams();
	const [listOfDocuments, setListOfDocuments] = useState([]);
	const [filesUploading, setFilesUploading] = useState(false);
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const onDocumentUpload = async (key, url) => {
		try {
			const response = await API.post(BASE_API_PATH + "ClientDocuments", {
				clientId: +id,
				documentKey: key,
			});

			if (response.status !== 201) {
				throw new Error("Cannot upload document!");
			}

			fetchClientDocuments();
		} catch (error) {
			console.log(error);
			setOpen(true);
			setFilesUploading(false);
			setErrorMessage("Something went wrong!");
		}
	};

	const fetchClientDocuments = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}ClientDocuments?clientId=${id}`
			);
			console.log(result);
			setListOfDocuments([
				...result.data.map((doc) => ({
					id: doc?.id,
					name: doc?.filename,
				})),
			]);

			setFilesUploading(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchClientDocuments();
	}, []);

	return (
		<div className={classes.logoContainer}>
			<ErrorDialog
				open={open}
				handleClose={() => setOpen(false)}
				message={errorMessage}
			/>

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
						Client documents ({listOfDocuments.length})
					</Typography>
				</AccordionSummary>

				<AccordionDetails>
					<div className={classes.logoContentParent}>
						{listOfDocuments.map((document, index) => {
							// Preventing duplication of dividers
							if (index === listOfDocuments.length - 1) {
								return (
									<ProvidedAssetNoImage
										key={document.id}
										document={document}
										showBottomDivider={true}
										setOpenErrorModal={setOpen}
										setErrorMessage={setErrorMessage}
										fetchClientDocuments={fetchClientDocuments}
									/>
								);
							} else {
								return (
									<ProvidedAssetNoImage
										key={document.id}
										document={document}
										setOpenErrorModal={setOpen}
										setErrorMessage={setErrorMessage}
										fetchClientDocuments={fetchClientDocuments}
									/>
								);
							}
						})}

						<div className={classes.uploaderContainer}>
							<DropUploadBox
								uploadReturn={onDocumentUpload}
								clientID={id}
								filesUploading={filesUploading}
								setFilesUploading={setFilesUploading}
							/>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default ClientDocuments;
