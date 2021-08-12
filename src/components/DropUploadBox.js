import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReactComponent as UploadIcon } from "../assets/icons/uploadIcon.svg";
import API from "../helpers/api";
import ColourConstants from "../helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	dragContainer: {
		padding: 25,
		borderStyle: "dashed",
		borderColor: ColourConstants.uploaderBorder,
		borderWidth: 2,
		borderRadius: "11px",
		width: "100%",
	},
	dragTextContainer: {
		display: "flex",
		width: "100%",
		justifyContent: "center",
		justifyItems: "center",
	},
	imgLink: {
		textDecoration: "underline",
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
}));

// BIG TODO: Need to have handling for single vs. multi uploads
const DropUpload = ({ uploadReturn, applicationID }) => {
	// Init hooks
	const classes = useStyles();

	// Hook called when a file is dropped
	const onDrop = useCallback(
		(acceptedFiles) => {
			// Setting spinner
			setFilesUploading(true);

			// Getting filetype
			const fileType = acceptedFiles[0].type.split("/").pop();

			// checking if the file is of image type
			if (["jpg", "jpeg", "png"].indexOf(fileType) < 0) {
				setFilesUploading(false);
				alert("Please upload image");
				return;
			}

			// Getting upload url and attempting upload
			// NOTE: currently handling single file
		},
		// eslint-disable-next-line
		[uploadReturn]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	// Init state
	const [filesUploading, setFilesUploading] = useState(false);

	// Showing uploader. Otherwise, showing spinner
	if (!filesUploading) {
		return (
			<div {...getRootProps()} className={classes.dragContainer}>
				<input {...getInputProps()} />
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
							Drag and drop some files here, or{" "}
							<Link className={classes.imgLink}>browse</Link>
						</Typography>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div className={classes.dragContainer}>
				<div className={classes.spinnerContainer}>
					<CircularProgress />
				</div>
			</div>
		);
	}
};

export default DropUpload;
