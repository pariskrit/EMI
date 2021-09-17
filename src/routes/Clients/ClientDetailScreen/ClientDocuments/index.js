import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/SiteWrapper/AccordionBox";
import DropUploadBox from "components/Modules/DropUploadBox";
import ProvidedAssetNoImage from "components/Modules/ProvidedAsset/ProvidedAssetNoImage";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import {
	addClientDocument,
	getClientDocument,
} from "services/clients/clientDetailScreen";
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
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const onDocumentUpload = async (key, url) => {
		try {
			const response = await addClientDocument({
				clientId,
				documentKey: key,
			});

			if (response.status) {
				fetchClientDocuments();
			} else {
				throw new Error(response);
			}
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
			const result = await getClientDocument(clientId);

			if (cancelFetch.current) {
				return;
			}
			setListOfDocuments([
				...result.data.map((doc) => ({
					id: doc?.id,
					name: doc?.filename,
					url: doc?.documentURL,
				})),
			]);
			setIsLoading(false);
			setFilesUploading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		fetchClientDocuments();
		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			cancelFetch.current = true;
		};
	}, []);

	return (
		<div className={classes.logoContainer}>
			<AccordionBox title={`Client Documents (${listOfDocuments.length})`}>
				<div className={classes.logoContentParent}>
					{isLoading ? (
						<CircularProgress />
					) : (
						listOfDocuments.map((document, index) => {
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
						})
					)}

					<div className={classes.uploaderContainer}>
						<DropUploadBox
							uploadReturn={onDocumentUpload}
							apiPath={`${BASE_API_PATH}Clients/${clientId}/upload`}
							filesUploading={filesUploading}
							setFilesUploading={setFilesUploading}
						/>
						{/* <DropUploadBox
							uploadReturn={onDocumentUpload}
							clientID={clientId}
							filesUploading={filesUploading}
							setFilesUploading={setFilesUploading}
						/> */}
					</div>
				</div>
			</AccordionBox>
		</div>
	);
}

export default ClientDocuments;
