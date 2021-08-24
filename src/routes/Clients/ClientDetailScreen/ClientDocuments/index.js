import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/AccordionBox";
import DropUploadBox from "components/DropUploadBox";
import ErrorDialog from "components/ErrorDialog";
import ProvidedAssetNoImage from "components/ProvidedAsset/ProvidedAssetNoImage";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
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
				throw new Error(response);
			}

			fetchClientDocuments();
		} catch (error) {
			setOpen(true);
			setFilesUploading(false);

			if (
				error.response.data.errors !== undefined &&
				error.response.data.detail === undefined
			) {
				setErrorMessage(error.response.data.errors.name);
			} else if (
				error.response.data.errors !== undefined &&
				error.response.data.detail !== undefined
			) {
				setErrorMessage(error.response.data.detail.name);
			} else {
				setErrorMessage("Something went wrong!");
			}
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
	}, []);

	return (
		<div className={classes.logoContainer}>
			<ErrorDialog
				open={open}
				handleClose={() => setOpen(false)}
				message={errorMessage}
			/>

			<AccordionBox title={`Client Documents (${listOfDocuments.length})`}>
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
									errorMessage={errorMessage}
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
									errorMessage={errorMessage}
								/>
							);
						}
					})}

					<div className={classes.uploaderContainer}>
						<DropUploadBox
							uploadReturn={onDocumentUpload}
							apiPath={`${BASE_API_PATH}Clients/${id}/upload`}
							filesUploading={filesUploading}
							setFilesUploading={setFilesUploading}
						/>
					</div>
				</div>
			</AccordionBox>
		</div>
	);
}

export default ClientDocuments;
