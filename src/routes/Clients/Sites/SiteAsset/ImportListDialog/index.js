import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Button,
	TableHead,
} from "@material-ui/core";
import DropUpload from "components/DropUploadBox";
import { BASE_API_PATH } from "helpers/constants";
import { importSiteAssets } from "services/clients/sites/siteAssets";

const datas = {
	newReferences: [],
	newAssets: [],
	modifiedReferences: [],
	modifiedAssets: [],
};
const useStyles = makeStyles({
	content: {
		display: "flex",
		flexDirection: "column",
		gap: 5,
		marginBottom: 15,
	},
});

const ImportListDialog = ({
	open,
	handleClose,
	siteId,
	importSuccess,
	getError,
}) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState({});
	const [data, setData] = useState(datas);
	const [show, setShow] = useState(false);

	const closeOverride = () => {
		setFile({});
		handleClose();
		setData(datas);
		setShow(false);
	};

	const importDocument = async (key, imp) => {
		try {
			const response = await importSiteAssets(siteId, {
				key,
				import: imp,
			});
			if (response.status) {
				return response;
			} else {
				if (response.data.detail) {
					getError(response.data.detail);
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
			console.log(res.data);
			setShow(true);
			setData(res.data);
			setLoading(false);
		});
	};

	const onExport = () => {
		importDocument(file.key, true).then(async (res) => {
			await importSuccess();
			closeOverride();
		});
	};

	const { newReferences } = data;

	return (
		<Dialog open={open} onClose={closeOverride}>
			<DialogTitle>Upload Document</DialogTitle>
			<DialogContent style={{ width: 500 }}>
				<div className={classes.content}>
					<DropUpload
						filesUploading={loading}
						setFilesUploading={setLoading}
						isImageUploaded={false}
						uploadReturn={onDocumentUpload}
						apiPath={`${BASE_API_PATH}SiteAssets/${siteId}/uploadList`}
					/>
					{show ? (
						<>
							<Button
								variant="outlined"
								color="primary"
								onClick={onExport}
								style={{ marginTop: 12, width: "35%" }}
							>
								Import Assets
							</Button>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Description</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{newReferences.map((x, i) => (
										<TableRow key={i}>
											<TableCell>{x.assetName}</TableCell>
											<TableCell>{x.description}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportListDialog;
