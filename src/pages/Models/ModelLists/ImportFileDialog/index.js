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
	uploadPercentCompleted,
	setUploadPercentCompleted,
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const dispatch = useDispatch();

	const closeOverride = () => {
		handleClose();
		setShow(false);
	};

	const importDocument = async (Key, imp) => {
		try {
			const response = await API.post(`${BASE_API_PATH}ModelImports/prepare`, {
				Key,
				SiteAppID: siteAppID,
				import: imp,
			});
			if (response.status) {
				await importSuccess();
				return response;
			} else {
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
			dispatch(
				showNotications({
					show: true,
					message: "Failed To Import",
					severity: "error",
				})
			);
			return err;
		} finally {
			setLoading(false);
		}
	};

	const onDocumentUpload = async (key, url) => {
		importDocument(key, true).then(async (res) => {
			setShow(true);
			closeOverride();
			setUploadPercentCompleted(0);
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
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportFileDialouge;
