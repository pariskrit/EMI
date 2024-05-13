import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AccordionBox from "components/Layouts/AccordionBox";
import DropUploadBox from "components/Elements/DropUploadBox";
import ProviderAsset from "components/Modules/ProvidedAsset/ProvidedAsset";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { updateClientLogo } from "services/clients/clientDetailScreen";

const useStyles = makeStyles()((theme) => ({
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
	const { classes, cx } = useStyles();
	const [showUpload, setShowUpload] = useState(true);
	const [filesUploading, setFilesUploading] = useState(false);

	useEffect(() => {
		if (clientDetail?.logoURL || clientDetail[0]?.logoURL) {
			setShowUpload(false);
		}
	}, [clientDetail]);

	const onLogoUpload = async (key) => {
		try {
			const response = await updateClientLogo(clientId, [
				{ op: "replace", path: "logoKey", value: key },
			]);

			if (response.status) {
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
			<AccordionBox title="Company Logo">
				{showUpload ? (
					<DropUploadBox
						uploadReturn={onLogoUpload}
						apiPath={`${BASE_API_PATH}Clients/${clientId}/upload`}
						isImageUploaded={true}
						filesUploading={filesUploading}
						setFilesUploading={setFilesUploading}
					/>
				) : (
					<ProviderAsset
						name={clientDetail?.logoFilename || clientDetail[0]?.name}
						src={clientDetail?.logoURL || clientDetail[0]?.logoURL}
						alt={clientDetail?.logoFilename || clientDetail[0]?.logoFilename}
						deleteLogo={onDeleteLogo}
						deleteEndpoint={`${BASE_API_PATH}Clients`}
					/>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientLogo;
