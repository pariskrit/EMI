import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { ReactComponent as DeleteIcon } from "../../assets/icons/deleteIcon.svg";
import DeleteDialog from "components/DeleteDialog";
import ColourConstants from "../../helpers/colourConstants";
import { BASE_API_PATH } from "../../helpers/constants";
import { useParams } from "react-router-dom";

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
		paddingLeft: 19,
	},
	imgLink: {
		textDecoration: "underline",
		"&:hover": {
			cursor: "pointer",
		},
		fontSize: "14px",
		color: "#307AD6",
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

const ProvidedAsset = ({
	src,
	alt,
	name,
	deleteLogo,
	noBottomDivider,
	isRec,
}) => {
	// Init hooks
	const classes = useStyles();

	const { id } = useParams();

	// Init state
	const [openDialog, setOpenDialog] = useState(false);

	// Handlers
	const closeDialogHandler = () => {
		setOpenDialog(false);
	};

	// Handling non-provided alt text
	if (alt === undefined) {
		alt = "User uploaded image asset";
	}
	// Handling non-provided noBottomDivider
	if (noBottomDivider === undefined) {
		noBottomDivider = false;
	}
	// Handling non-provided isSquare
	if (isRec === undefined) {
		isRec = false;
	}

	return (
		<>
			<DeleteDialog
				open={openDialog}
				closeHandler={closeDialogHandler}
				entityName="logo"
				deleteEndpoint={`${BASE_API_PATH}Clients`}
				deleteID={id}
				handleRemoveData={deleteLogo}
				isLogo={true}
			/>
			<div className={classes.assetParentContainer}>
				<Divider className={classes.dividerStyle} />

				<div
					className={clsx(classes.always, {
						[classes.imageAssetContainer]: !isRec,
						[classes.imageAssetContainerRec]: isRec,
					})}
				>
					<img src={src} alt={alt} className={classes.assetImage} />
				</div>

				<div className={classes.linkContainer}>
					<Typography>
						<Link className={classes.imgLink}>{name}</Link>
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

				{noBottomDivider ? null : <Divider className={classes.dividerStyle} />}
			</div>
		</>
	);
};

export default ProvidedAsset;
