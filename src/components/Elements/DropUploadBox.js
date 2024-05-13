import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactComponent as UploadIcon } from "assets/icons/uploadIcon.svg";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import axios, { CancelToken, isCancel } from "axios";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles()((theme) => ({
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
	cancelFileUpload,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

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
				uploadFile(acceptedFiles[0], uploadDetails.url, uploadDetails).then(
					(res) => {
						if (uploadDetails?.key) {
							uploadReturn(uploadDetails.key, acceptedFiles[0].path, res);
						} else {
							setFilesUploading(false);
						}
					}
				)
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

				showProgress && setLocalLoading(false);

				throw new Error(`Unable to get link`);
			}
		} catch (err) {
			showProgress && setLocalLoading(false);
			// TODO: real error handling
			dispatch(showError(err?.response?.data?.detail || "Failed to upload."));

			return err?.response?.data?.detail || false;
		}
	};

	const uploadFile = async (file, uploadURL, message) => {
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
				cancelToken: showProgress
					? new CancelToken((cancel) => (cancelFileUpload.current = cancel))
					: null,
			});
			return true;
		} catch (err) {
			if (isCancel(err)) {
				dispatch(showError(err?.message || "File upload cancelled."));
			}
			// TODO: real error handling
			// if (showProgress) {
			// 	if (axios.isCancel()) {
			// 		source.cancel("Operation cancellled");
			// 	}
			// }
			const errorMsg =
				(!uploadURL ? message : err?.message) || "Failed to upload file.";
			dispatch(showError(errorMsg));
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
							<Link className={classes.imgLink} underline="none">
								browse
							</Link>
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
