import React, { useEffect, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Link,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { CSVLink } from "react-csv";
import { BASE_API_PATH } from "helpers/constants";
import DropUpload from "components/Elements/DropUploadBox";
import AddDialogStyle from "styles/application/AddDialogStyle";
import API from "helpers/api";
import { useDispatch } from "react-redux";
import { showNotications } from "redux/notification/actions";
import { showError } from "redux/common/actions";
import { findWindows } from "windows-iana";

const AT = AddDialogStyle();

const media = "@media (max-width:414px)";

const useStyles = makeStyles()((theme) => ({
	content: {
		display: "flex",
		flexDirection: "column",
		gap: 5,
		marginBottom: 15,
	},
	button: {
		marginTop: 15,
		width: "30%",
		[media]: {
			width: "auto",
		},
	},
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
}));

const ImportFileDialouge = ({
	open,
	handleClose,
	importSuccess,
	siteAppID,
	apiEndPoints,
	downloadCSVTemplate,
	uploadApiEndPoint,
	setTaskListImportSuccess,
}) => {
	const { classes } = useStyles();
	const dispatch = useDispatch();
	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [fetchLoading, setFetchLoading] = useState(false);
	const cancelFileUpload = useRef(null);
	const [templateCSV, setTemplateCSV] = useState("");
	const isCancellled = useRef(false);
	const [showProgress, setShowProgress] = useState(true);

	useEffect(() => {
		if (open) {
			// download csv template for import
			const DownloadImportCSVTemplate = async () => {
				const response = await downloadCSVTemplate();
				if (response.status) {
					setTemplateCSV(response?.data);
				}
			};
			DownloadImportCSVTemplate();
		}
	}, [open, downloadCSVTemplate]);

	const closeOverride = () => {
		handleClose();
		setShow(false);
	};

	const importDocument = async (Key, imp) => {
		setFetchLoading(true);
		try {
			const result = findWindows(
				Intl.DateTimeFormat().resolvedOptions().timeZone
			);

			const response = await API.post(`${BASE_API_PATH}${apiEndPoints}`, {
				Key,
				modelVersionID: siteAppID,
				import: imp,
				timeZone: result?.[0]?.toString(),
			});
			if (response.status === 201 || response.status === 200) {
				await importSuccess();
				setTaskListImportSuccess(prev=>!prev);
				return response;
			} else {
				if (response?.data?.detail) {
					if (!isCancellled.current) {
						dispatch(showError(response?.data?.detail || "Failed To Import"));
					}
					return { success: false };
				}
			}
			setLoading(false);
		} catch (err) {
			if (!isCancellled.current) {
				dispatch(showError(err?.response?.data?.detail || "Failed To Import"));
			}
			return err;
		} finally {
			setFetchLoading(false);
			setUploadPercentCompleted(0);
			setLoading(false);
		}
	};

	const onDocumentUpload = async (key, url, res) => {
		if (res) await importDocument(key, true);
		else {
			setFetchLoading(false);
			setLoading(false);
			setUploadPercentCompleted(0);
		}
		setShow(true);
		closeOverride();
		setShowProgress(true);
		isCancellled.current = false;
	};

	useEffect(() => {
		if (uploadPercentCompleted === 100) {
			setShowProgress(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadPercentCompleted]);

	const handleCancelFileUpload = () => {
		if (cancelFileUpload.current) {
			cancelFileUpload.current("Cancelled File import");
			isCancellled.current = true;
			dispatch(
				showNotications({
					show: true,
					message: "Cancelled File import",
					severity: "error",
				})
			);
		}
	};

	return (
		<>
			{fetchLoading && <LinearProgress className={classes.loading} />}
			<Dialog open={open} onClose={closeOverride} fullWidth maxWidth="md">
				<AT.ActionContainer>
					<DialogTitle>
						<AT.HeaderText>Upload CSV File</AT.HeaderText>
					</DialogTitle>
					<AT.ButtonContainer>
						<AT.CancelButton
							variant="contained"
							onClick={() => {
								handleCancelFileUpload();
								closeOverride();
							}}
						>
							Cancel
						</AT.CancelButton>
					</AT.ButtonContainer>
				</AT.ActionContainer>
				<DialogContent>
					<div className={classes.content}>
						{!show && (
							<DropUpload
								filesUploading={loading}
								setFilesUploading={setLoading}
								isImageUploaded={false}
								uploadReturn={onDocumentUpload}
								apiPath={`${BASE_API_PATH}${uploadApiEndPoint}`}
								showProgress={showProgress}
								uploadPercentCompleted={uploadPercentCompleted}
								setUploadPercentCompleted={setUploadPercentCompleted}
								percentMultiplyBy={100}
								cancelFileUpload={cancelFileUpload}
								isDocumentUploaded
								getError={(msg) => dispatch(showError(msg))}
							/>
						)}
					</div>
					<div style={{ height: "10px" }}></div>
					<CSVLink data={templateCSV} filename="CSVTemplate.csv">
						<Link
							style={{ cursor: "pointer", fontSize: "16px", color: "#307AD6" }}
						>
							Download Import CSV Template
						</Link>
					</CSVLink>
					<div style={{ height: "10px" }}></div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ImportFileDialouge;
