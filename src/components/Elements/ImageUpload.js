import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { ReactComponent as UploadIcon } from "assets/icons/uploadIcon.svg";
import ColourConstants from "helpers/colourConstants";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";

const useStyles = makeStyles((theme) => ({
	dragContainer: {
		padding: 25,
		borderStyle: "dashed",
		borderColor: "#307AD6",
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
	},
	imageContainerMain: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

const ImageUpload = ({ onDrop, imageUrl, imageName, removeImage }) => {
	// Init hooks
	const classes = useStyles();

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} className={classes.dragContainer}>
			{imageUrl ? (
				<div className={classes.imageContainerMain}>
					<img
						src={imageUrl}
						alt="url of file"
						className={classes.imageContainer}
					/>
					<Link>{imageName}</Link>
					<div style={{ width: "50px", border: "none" }}>
						<DeleteIcon className={classes.deleteIcon} onClick={removeImage} />
					</div>
				</div>
			) : (
				<>
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
								Drag and drop some file here, or{" "}
								<Link className={classes.imgLink}>browse</Link>
							</Typography>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ImageUpload;
