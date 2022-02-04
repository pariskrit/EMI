import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { ReactComponent as UploadIcon } from "assets/icons/uploadIcon.svg";
import ColourConstants from "helpers/colourConstants";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import { CircularProgress, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
}));

const ImageUpload = ({
	onDrop,
	imageUrl,
	imageName,
	removeImage,
	isUploading = false,
	isReadOnly = false,
}) => {
	// Init hooks
	const classes = useStyles();

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	if (isUploading) {
		return (
			<div className={classes.dragContainer}>
				<div className={classes.spinnerContainer}>
					<CircularProgress />
				</div>
			</div>
		);
	}

	return (
		<div
			{...getRootProps()}
			className={
				imageUrl ? classes.assetParentContainer : classes.dragContainer
			}
		>
			{imageUrl && <Divider className={classes.dividerStyle} />}

			{imageUrl ? (
				<div className={classes.imageContainerMain}>
					<div className={classes.imageAndLink}>
						<img
							src={imageUrl}
							alt="url of file"
							className={classes.imageContainer}
						/>
						<Link className="new-link">{imageName}</Link>
					</div>

					<div style={{ width: "50px", border: "none" }}>
						{isReadOnly ? null : (
							<DeleteIcon
								className={classes.deleteIcon}
								onClick={removeImage}
							/>
						)}
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
			{imageUrl && <Divider className={classes.dividerStyle} />}
		</div>
	);
};

export default ImageUpload;
