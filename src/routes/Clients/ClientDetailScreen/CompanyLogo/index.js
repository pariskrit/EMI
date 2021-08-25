import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/AccordionBox";
import DropUploadBox from "components/DropUploadBox";
import ProviderAsset from "components/ProvidedAsset/ProvidedAsset";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 15,
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

const ClientLogo = ({
	clientId,
	clientDetail,
	fetchClientDetail,
	getError,
}) => {
	const classes = useStyles();
	const [showUpload, setShowUpload] = useState(true);
	const [filesUploading, setFilesUploading] = useState(false);

	useEffect(() => {
		if (clientDetail.logoURL) {
			setShowUpload(false);
		}
	}, [clientDetail]);

	const onLogoUpload = async (key) => {
		try {
			const response = await API.patch(`${BASE_API_PATH}Clients/${clientId}`, [
				{ op: "replace", path: "logoKey", value: key },
			]);

			if (response.status === 200 || response.status === 201) {
				fetchClientDetail(clientId);
			} else {
				throw new Error(response);
			}
		} catch (error) {
			setFilesUploading(false);
			if (
				error.response.data.errors !== undefined &&
				error.response.data.detail === undefined
			) {
				getError(error.response.data.errors.name);
			} else if (
				error.response.data.errors !== undefined &&
				error.response.data.detail !== undefined
			) {
				getError(error.response.data.detail.name);
			} else {
				getError("Something went wrong!");
			}
		}
	};

	const onDeleteLogo = (id) => {
		setShowUpload(true);
		setFilesUploading(false);
	};

	return (
		<div className={classes.logoContainer}>
			<AccordionBox title="Company Logo (1)">
				{showUpload ? (
					<div className={classes.logoContentParent}>
						<DropUploadBox
							uploadReturn={onLogoUpload}
							clientID={clientId}
							isImageUploaded={true}
							filesUploading={filesUploading}
							setFilesUploading={setFilesUploading}
							getError={getError}
						/>
					</div>
				) : (
					<div className={classes.logoContentParent}>
						<ProviderAsset
							name={clientDetail.logoFilename}
							src={clientDetail.logoURL}
							alt={clientDetail.logoFilename}
							deleteLogo={onDeleteLogo}
						/>
					</div>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientLogo;
