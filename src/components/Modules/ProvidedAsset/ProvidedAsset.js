import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import DeleteDialog from "components/Elements/DeleteDialog";
import ColourConstants from "helpers/colourConstants";
import { useParams } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
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
		cursor: "pointer",
	},
	linkContainer: {
		display: "flex",
		alignItems: "center",
		paddingLeft: 10,
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
	deleteEndpoint,
	deleteName = "logo",
	isLogo = true,
	imageId = null,
	onImageClick = null,
	isReadOnly = false,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

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

	useEffect(() => {
		return () => setOpenDialog(false);
	}, []);

	return (
		<>
			<DeleteDialog
				open={openDialog}
				closeHandler={closeDialogHandler}
				entityName={deleteName}
				deleteEndpoint={deleteEndpoint}
				deleteID={imageId ?? id}
				handleRemoveData={deleteLogo}
				isLogo={isLogo}
			/>
			<div className={classes.assetParentContainer}>
				<Divider className={classes.dividerStyle} />

				<div
					className={cx(classes.always, {
						[classes.imageAssetContainer]: !isRec,
						[classes.imageAssetContainerRec]: isRec,
					})}
				>
					<img
						src={src}
						alt={alt}
						className={classes.assetImage}
						onClick={onImageClick}
					/>
				</div>

				<div className={classes.linkContainer}>
					<Typography>
						<Link className={classes.imgLink}>{name}</Link>
					</Typography>
				</div>

				{!isReadOnly && (
					<div className={classes.deleteContainer}>
						<DeleteIcon
							className={classes.deleteButton}
							alt="Delete icon"
							onClick={() => {
								setOpenDialog(true);
							}}
						/>
					</div>
				)}

				{noBottomDivider ? null : <Divider className={classes.dividerStyle} />}
			</div>
		</>
	);
};

export default ProvidedAsset;
