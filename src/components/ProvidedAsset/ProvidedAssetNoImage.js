import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { ReactComponent as DeleteIcon } from "../../assets/icons/deleteIcon.svg";
import DeleteDialog from "./DeleteDialog";
import ColourConstants from "../../helpers/colourConstants";

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
		transform: "scale(1)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

function ProvidedAssetNoImage({ name, showBottomDivider }) {
	const classes = useStyles();
	return (
		<div className={classes.assetParentContainer}>
			<Divider className={classes.dividerStyle} />
			<div className={classes.linkContainer}>
				<Typography>
					<Link className={classes.imgLink}>{name}</Link>
				</Typography>
			</div>

			<div className={classes.deleteContainer}>
				<DeleteIcon
					className={classes.deleteButton}
					alt="Delete icon"
					// onClick={() => {
					// 	setOpenDialog(true);
					// }}
				/>
			</div>

			{showBottomDivider && <Divider className={classes.dividerStyle} />}
		</div>
	);
}

export default ProvidedAssetNoImage;
