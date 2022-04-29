import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReactComponent as UploadIcon } from "assets/icons/uploadIcon.svg";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import axios from "axios";

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
	loadingText: {
		color: "#307AD6",
	},
}));

// BIG TODO: Need to have handling for single vs. multi uploads
const DropUpload = ({
	uploadReturn,
	apiPath,
	isImageUploaded = false,
	isDocumentUploaded = false,
	filesUploading,
	setFilesUploading,
	getError,
	inApplication,
	uploadPercentCompleted,
	setUploadPercentCompleted,
	showProgress = false,
	percentMultiplyBy = 100,
}) => {
	// Init hooks
	const classes = useStyles();

	const [localLoading, setLocalLoading] = useState(false);

	// Hook called when a file is dropped
	const onDrop = useCallback(
		(acceptedFiles) => {
			// Setting spinner
			showProgress && setLocalLoading(true);
			setFilesUploading(true);

			// Getting filetype
			const fileType = acceptedFiles[0].type.split("/").pop();
			const fileName = acceptedFiles[0].name;

			if (isImageUploaded) {
				// checking if the file is of image type
				const isFileOfImageType = ["jpg", "jpeg", "png"].indexOf(fileType) > 0;

				// checking if the file size is less than 1mb
				const isFileSizeLessThan1Mb = acceptedFiles[0].size < 1000000;

				if (!isFileOfImageType) {
					setFilesUploading(false);
					getError("Please upload file of image type!");

					return;
				}

				if (!isFileSizeLessThan1Mb) {
					setFilesUploading(false);
					getError("Please upload image of size less than 1mb!");

					return;
				}
			}

			if (isDocumentUploaded) {
				const isFileSizeLessThan6Mb = acceptedFiles[0].size < 6000000;

				if (!isFileSizeLessThan6Mb) {
					setFilesUploading(false);
					getError("Please upload document of size less than 6mb!");

					return;
				}
			}

			// Getting upload url and attempting upload
			// NOTE: currently handling single file
			getUploadLink(fileName).then((uploadDetails) =>
				uploadFile(acceptedFiles[0], uploadDetails.url).then((res) => {
					uploadReturn(uploadDetails.key, acceptedFiles[0].path);
				})
			);
		},
		// eslint-disable-next-line
		[uploadReturn]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	// Helpers
	const getUploadLink = async (fileName) => {
		// Attemptong to get signed s3 upload link
		try {
			let uploadLink = await API.post(
				apiPath,
				inApplication
					? { fileType: fileName }
					: {
							Filename: fileName,
					  }
			);

			// Getting URL from stream if success
			if (uploadLink.status === 200) {
				showProgress && setLocalLoading(false);

				return uploadLink.data;
			} else {
				// Printing failure
				console.log(uploadLink);
				showProgress && setLocalLoading(false);

				throw new Error(`Unable to get link`);
			}
		} catch (err) {
			showProgress && setLocalLoading(false);
			// TODO: real error handling
			console.log(err);

			return false;
		}
	};

	const uploadFile = async (file, uploadURL) => {
		// Attempting file upload
		try {
			// Attempting upload
			await axios.put(uploadURL, file, {
				onUploadProgress: (progressEvent) => {
					let percentCompleted = Math.floor(
						(progressEvent.loaded * percentMultiplyBy) / progressEvent.total
					);
					showProgress && setUploadPercentCompleted((prev) => percentCompleted);

					// do whatever you like with the percentage complete
					// maybe dispatch an action that will update a progress bar or something
				},
			});

			return true;
		} catch (err) {
			// TODO: real error handling
			console.log(err);
			return false;
		}
	};

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
					{!showProgress ? (
						<CircularProgress />
					) : (
						<>
							{localLoading ? (
								<CircularProgress />
							) : (
								<Typography variant="body1" className={classes.loadingText}>
									{uploadPercentCompleted}%
								</Typography>
							)}
						</>
					)}
				</div>
			</div>
		);
	}
};

export default DropUpload;
