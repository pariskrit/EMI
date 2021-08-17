import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteDialog from "components/DeleteDialog";
import ErrorDialog from "components/ErrorDialog";
import React, { useEffect, useState } from "react";
import { ReactComponent as DeleteIcon } from "../../assets/icons/deleteIcon.svg";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";

const useStyles = makeStyles((theme) => ({
	assetParentContainer: {
		display: "flex",
		flexWrap: "wrap",
		width: "100%",
	},

	dividerStyle: {
		width: "100%",
		backgroundColor: ColourConstants.divider,
	},
	imageAssetContainer: {
		width: 85,
		height: 85,
		marginTop: 10,
		marginBottom: 10,
		display: "flex",
		alignItems: "center",
	},
	imageAssetContainerRec: {
		width: 141,
		height: 61,
		marginTop: 10,
		marginBottom: 10,
		display: "flex",
		alignItems: "center",
	},
	assetImage: {
		minWidth: "100%",
		maxWidth: "100%",
		minHeight: "100%",
		maxHeight: "100%",
		objectFit: "contain",
		display: "flex",
		marginRight: 20,
		borderColor: ColourConstants.commonBorder,
		borderWidth: 1,
		borderStyle: "solid",
	},
	linkContainer: {
		display: "flex",
		alignItems: "center",
		padding: "16px 10px",
	},
	imgLink: {
		textDecoration: "underline",
		color: "#307AD6",
		"&:hover": {
			cursor: "pointer",
		},
		fontSize: "14px",
	},
	deleteContainer: {
		display: "flex",
		alignItems: "center",
		marginLeft: "auto",
	},
	deleteButton: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

function ProvidedAssetNoImage({
	document,
	showBottomDivider,
	fetchClientDocuments,
	setOpenErrorModal,
	errorMessage,
	setErrorMessage,
}) {
	const classes = useStyles();
	const { id, name, url } = document;
	const [openDialog, setOpenDialog] = useState(false);
	const [objectURL, setObjectURL] = useState(false);
	const [serverError, setServerError] = useState(false);

	const closeDialogHandler = () => {
		setOpenDialog(false);
	};

	const fetchDocument = (id) => {
		fetchClientDocuments();
	};
	useEffect(() => {
		async function fetchImage() {
			try {
				//console.log(url);
				let res = await fetch(url);
				let blob = await res?.blob();
				setObjectURL(URL.createObjectURL(blob));
			} catch (e) {
				console.log("error occured in fetching");
				setServerError(true);

				setErrorMessage("Error occured while fetching image!");
			}
		}
		fetchImage();
	}, [url]);

	return (
		<>
			<ErrorDialog
				open={serverError}
				handleClose={() => setServerError(false)}
				message={errorMessage}
			/>
			<DeleteDialog
				open={openDialog}
				closeHandler={closeDialogHandler}
				entityName="document"
				deleteEndpoint={`${BASE_API_PATH}ClientDocuments`}
				deleteID={id}
				handleRemoveData={fetchDocument}
			/>
			<div className={classes.assetParentContainer}>
				<Divider className={classes.dividerStyle} />
				<div className={classes.linkContainer}>
					<Typography>
						<Link href={objectURL} download={name}>
							{name}
						</Link>
					</Typography>
				</div>

				<div className={classes.deleteContainer}>
					<DeleteIcon
						className={classes.deleteButton}
						alt="Delete icon"
						onClick={() => {
							setOpenDialog(true);
						}}
					/>
				</div>

				{showBottomDivider && <Divider className={classes.dividerStyle} />}
			</div>
		</>
	);
}

export default ProvidedAssetNoImage;
