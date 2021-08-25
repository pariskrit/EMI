import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import DropUploadBox from "components/DropUploadBox";
import ProvidedAssetNoImage from "components/ProvidedAsset/ProvidedAssetNoImage";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-start",
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
	uploaderContainer: {
		marginTop: "2%",
	},
	dividerStyle: {
		width: "100%",
	},
}));
function ClientDocuments({ clientId, getError }) {
	const classes = useStyles();
	const [listOfDocuments, setListOfDocuments] = useState([]);
	const [filesUploading, setFilesUploading] = useState(false);

	const onDocumentUpload = async (key, url) => {
		try {
			const response = await API.post(BASE_API_PATH + "ClientDocuments", {
				clientId,
				documentKey: key,
			});

			if (response.status !== 201) {
				throw new Error(response);
			}

			fetchClientDocuments();
		} catch (error) {
			setFilesUploading(false);

			let errorMessage = "";

			if (
				error.response.data.errors !== undefined &&
				error.response.data.detail === undefined
			) {
				errorMessage = error.response.data.errors.name;
			} else if (
				error.response.data.errors !== undefined &&
				error.response.data.detail !== undefined
			) {
				errorMessage = error.response.data.detail.name;
			} else {
				errorMessage = "Something went wrong!";
			}
			getError(errorMessage);
		}
	};

	const fetchClientDocuments = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}ClientDocuments?clientId=${clientId}`
			);
			console.log(result);
			setListOfDocuments([
				...result.data.map((doc) => ({
					id: doc?.id,
					name: doc?.filename,
					url: doc?.documentURL,
				})),
			]);

			setFilesUploading(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchClientDocuments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={classes.logoContainer}>
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
										getError={getError}
										fetchClientDocuments={fetchClientDocuments}
									/>
								);
							} else {
								return (
									<ProvidedAssetNoImage
										key={document.id}
										document={document}
										getError={getError}
										fetchClientDocuments={fetchClientDocuments}
									/>
								);
							}
						})}

						<div className={classes.uploaderContainer}>
							<DropUploadBox
								uploadReturn={onDocumentUpload}
								clientID={clientId}
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
