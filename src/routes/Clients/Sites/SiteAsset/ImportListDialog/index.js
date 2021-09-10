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
} from "@material-ui/core";
import DropUpload from "components/DropUploadBox";
import { BASE_API_PATH } from "helpers/constants";
import { importSiteAssets } from "services/clients/sites/siteAssets";
import TableStyle from "styles/application/TableStyle";
const datas = {
	newReferences: [],
	newAssets: [],
	modifiedReferences: [],
	modifiedAssets: [],
};
const AT = TableStyle();
const useStyles = makeStyles({
	paper: { width: "90%", margin: "auto" },
	content: { display: "flex", flexDirection: "column", gap: 5 },
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

	const closeOverride = () => {
		setFile({});
		handleClose();
		setData(datas);
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
		<Dialog open={open} onClose={closeOverride} className={classes.paper}>
			<DialogTitle>Upload Document</DialogTitle>
			<DialogContent>
				<div className={classes.content}>
					<DropUpload
						filesUploading={loading}
						setFilesUploading={setLoading}
						isImageUploaded={false}
						uploadReturn={onDocumentUpload}
						apiPath={`${BASE_API_PATH}SiteAssets/${siteId}/uploadList`}
					/>
					<Button
						variant="outlined"
						color="primary"
						onClick={onExport}
						style={{ marginTop: 12, width: "35%" }}
					>
						Export
					</Button>
					<Table>
						<AT.TableHead>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
						</AT.TableHead>
						<TableBody>
							{newReferences.map((x) => (
								<TableRow>
									<TableCell>{x.assetName}</TableCell>
									<TableCell>{x.description}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportListDialog;
