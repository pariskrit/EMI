import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	makeStyles,
	Button,
} from "@material-ui/core";
import ImportTable from "./ImportTable";
import { BASE_API_PATH } from "helpers/constants";
import { importUserList } from "services/users/usersList";
import DropUpload from "components/Elements/DropUploadBox";
import AddDialogStyle from "styles/application/AddDialogStyle";

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

const ImportListDialog = ({ open, handleClose, importSuccess, getError }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState({});
	const [data, setData] = useState([]);
	const [show, setShow] = useState(false);

	const closeOverride = () => {
		setFile({});
		handleClose();
		setData([]);
		setShow(false);
		setLoading(false);
	};

	const importDocument = async (key, imp) => {
		try {
			const response = await importUserList({
				key,
				import: imp,
			});
			if (response.status) {
				return response;
			} else {
				if (response.data.detail) {
					getError(response.data.detail);
					return { success: false };
				}
			}
			setLoading(false);
		} catch (err) {
			return err;
		}
	};

	const onDocumentUpload = async (key, url) => {
		setFile({ key, url });

		importDocument(key, false).then((res) => {
			setShow(true);
			setData(res.data);
			setLoading(false);
		});
	};

	const onImportUser = () => {
		setLoading(true);
		importDocument(file.key, true).then(async (res) => {
			await importSuccess();
			closeOverride();
		});
	};
	return (
		<Dialog open={open} onClose={closeOverride} fullWidth maxWidth="md">
			<AT.ActionContainer>
				<DialogTitle>
					<AT.HeaderText>Upload Document</AT.HeaderText>
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
							apiPath={`${BASE_API_PATH}Users/uploadUserList`}
						/>
					)}
					{show ? (
						<>
							{data?.length === 0 ? (
								<h1>No Changes are going to be made</h1>
							) : (
								<>
									<Button
										variant="outlined"
										color="primary"
										onClick={onImportUser}
										className={classes.button}
									>
										{loading ? "Importing ..." : "Import Users"}
									</Button>
									<ImportTable title="New Users" data={data} />
								</>
							)}
						</>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportListDialog;
