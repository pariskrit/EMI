import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	makeStyles,
} from "@material-ui/core";
import { BASE_API_PATH } from "helpers/constants";
import DropUpload from "components/Elements/DropUploadBox";
import AddDialogStyle from "styles/application/AddDialogStyle";
import API from "helpers/api";
import { useDispatch } from "react-redux";
import { showNotications } from "redux/notification/actions";

const AT = AddDialogStyle();

const media = "@media (max-width:414px)";

const useStyles = makeStyles({
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
});

const ImportFileDialouge = ({
	open,
	handleClose,
	importSuccess,
	getError,
	siteAppID,
}) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);

	const closeOverride = () => {
		handleClose();
		setShow(false);
	};

	const importDocument = async (Key, imp) => {
		try {
			const response = await API.post(
				`${BASE_API_PATH}ModelImports/prepare`,
				{
					Key,
					SiteAppID: siteAppID,
					import: imp,
				},
				{
					onUploadProgress: (progressEvent) => {
						let percentCompleted = Math.floor(
							(progressEvent.loaded * 5) / progressEvent.total
						);
						setUploadPercentCompleted((prev) => prev + percentCompleted);
						// do whatever you like with the percentage complete
						// maybe dispatch an action that will update a progress bar or something
					},
				}
			);
			if (response.status === 201 || response.status === 200) {
				setUploadPercentCompleted((prev) => 99);
				await importSuccess();
				setUploadPercentCompleted((prev) => 100);

				return response;
			} else {
				setUploadPercentCompleted((prev) => 99);

				if (response.data.detail) {
					dispatch(
						showNotications({
							show: true,
							message: response.data.detail || "Failed To Import",
							severity: "error",
						})
					);
					return { success: false };
				}
			}
			setLoading(false);
		} catch (err) {
			setUploadPercentCompleted((prev) => 99);
			dispatch(
				showNotications({
					show: true,
					message: "Failed To Import",
					severity: "error",
				})
			);
			return err;
		}
	};

	const onDocumentUpload = async (key, url) => {
		importDocument(key, true).then(async (res) => {
			setTimeout(() => {
				setShow(true);
				closeOverride();
				setLoading(false);
				setUploadPercentCompleted(0);
			}, 100);
		});
	};

	return (
		<Dialog open={open} onClose={closeOverride} fullWidth maxWidth="md">
			<AT.ActionContainer>
				<DialogTitle>
					<AT.HeaderText>Upload File</AT.HeaderText>
				</DialogTitle>
				<AT.ButtonContainer>
					<AT.CancelButton variant="contained" onClick={closeOverride}>
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
							apiPath={`${BASE_API_PATH}ModelImports/upload`}
							showProgress
							uploadPercentCompleted={uploadPercentCompleted}
							setUploadPercentCompleted={setUploadPercentCompleted}
							percentMultiplyBy={90}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportFileDialouge;
