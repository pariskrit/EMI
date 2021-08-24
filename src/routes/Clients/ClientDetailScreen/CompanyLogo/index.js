import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/AccordionBox";
import DropUploadBox from "components/DropUploadBox";
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
	const [filesUploading, setFilesUploading] = useState(true);
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const onLogoUpload = async (key) => {
		try {
			const response = await API.patch(`${BASE_API_PATH}Clients/${id}`, [
				{ op: "replace", path: "logoKey", value: key },
			]);

			if (response.status === 200 || response.status === 201) {
				fetchClientLogo();
			} else {
				throw new Error(response);
			}
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

	const fetchClientLogo = async () => {
		try {
			const result = await API.get(`${BASE_API_PATH}Clients/${id}`);
			console.log(result);
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
		setFilesUploading(false);
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
			<AccordionBox title="Company Logo (1)">
				{showUpload ? (
					<DropUploadBox
						uploadReturn={onLogoUpload}
						apiPath={`${BASE_API_PATH}Clients/${id}/upload`}
						isImageUploaded={true}
						filesUploading={filesUploading}
						setFilesUploading={setFilesUploading}
						setErrorMessage={setErrorMessage}
						setOpenErrorModal={setOpen}
					/>
				) : (
					<ProviderAsset
						name={logo.name}
						src={logo.src}
						alt={logo.alt}
						deleteLogo={onDeleteLogo}
					/>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientLogo;
