import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ReactComponent as UploadIcon } from "assets/icons/uploadIcon.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";

import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles()((theme) => ({
	assetParentContainer: {
		border: "none",
		width: "100%",
	},
	dividerStyle: {
		width: "100%",
		backgroundColor: ColourConstants.divider,
	},
	dragContainer: {
		padding: 25,
		borderStyle: "dashed",
		borderColor: "#307AD6",
		borderWidth: 2,
		borderRadius: "11px",
		width: "100%",
	},
	imageAndLink: {
		display: "flex",
		alignItems: "center",
		flex: "1",
	},
	dragTextContainer: {
		display: "flex",
		width: "100%",
		justifyContent: "center",
		justifyItems: "center",
	},
	imgLink: {
		textDecoration: "underline",
		color: "#307AD6",
		"&:hover": {
			cursor: "pointer",
		},
	},
	uploadIcon: {
		marginRight: "2%",
		color: ColourConstants.uploaderIcon,
	},
	spinnerContainer: {
		display: "flex",
		justifyContent: "center",
	},
	dropText: {
		fontSize: "14px",
	},
	imageContainer: {
		width: "120px",
		height: "120px",
		objectFit: "contain",
		marginRight: "12px",
	},
	imageContainerMain: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		margin: 10,
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

const ImageUpload = ({ onDrop, file, disabled = false, removeImage }) => {
	// Init hooks
	const { classes, cx } = useStyles();

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		disabled,
	});

	return (
		<>
			{!file && (
				<div {...getRootProps()} className={classes.dragContainer}>
					<>
						{<input {...getInputProps()} />}
						{isDragActive ? (
							<div className={classes.dragTextContainer}>
								<Typography className={classes.dropText}>
									Drop the files here...
								</Typography>
							</div>
						) : (
							<div className={classes.dragTextContainer}>
								<UploadIcon alt="upload icon" className={classes.uploadIcon} />

								<Typography className={classes.dropText}>
									Drag and drop some file here, or{" "}
									<Link className={classes.imgLink}>browse</Link>
								</Typography>
							</div>
						)}
					</>
				</div>
			)}
			{file && (
				<aside className={classes.imageContainerMain}>
					<Typography className="new-link">{file?.name ?? file}</Typography>
					<DeleteIcon className={classes.deleteIcon} onClick={removeImage} />
				</aside>
			)}
		</>
	);
};

export default ImageUpload;
