import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { CSVLink } from "react-csv";
import DropUpload from "components/Elements/DropUploadBox";
import { BASE_API_PATH } from "helpers/constants";
import { importSiteAssets } from "services/clients/sites/siteAssets";
import ImportTable from "./ImportTable";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { Link } from "@mui/material";
import { DownloadCSVTemplateForSiteSetting } from "services/services/serviceLists";
const AT = AddDialogStyle();

const media = "@media (max-width:414px)";

const datas = {
	newReferences: [],
	newAssets: [],
	modifiedReferences: [],
	modifiedAssets: [],
};
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
}));

const ImportListDialog = ({
	open,
	handleClose,
	siteId,
	importSuccess,
	getError,
}) => {
	const { classes, cx } = useStyles();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState({});
	const [data, setData] = useState(datas);
	const [show, setShow] = useState(false);
	const [templateCSV, setTemplateCSV] = useState("");
	const closeOverride = () => {
		setFile({});
		handleClose();
		setData(datas);
		setShow(false);
		setLoading(false);
	};
	useEffect(() => {
		if (open) {
			// download csv template for import
			const DownloadImportCSVTemplate = async () => {
				const response = await DownloadCSVTemplateForSiteSetting();
				if (response.status) {
					setTemplateCSV(response?.data);
				}
			};
			DownloadImportCSVTemplate();
		}
	}, [open]);
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
			setShow(true);
			setData(res.data);
			setLoading(false);
		});
	};

	const onImportAsset = () => {
		setLoading(true);
		importDocument(file.key, true).then(async (res) => {
			await importSuccess();
			closeOverride();
		});
	};

	const { newAssets, newReferences, modifiedReferences, modifiedAssets } = data;
	const allZero =
		newAssets.length === 0 &&
		newReferences.length === 0 &&
		modifiedReferences.length === 0 &&
		modifiedAssets.length === 0;

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
							apiPath={`${BASE_API_PATH}SiteAssets/${siteId}/uploadList`}
						/>
					)}
					{show ? (
						<>
							{allZero ? (
								<h1>No Changes are going to be made</h1>
							) : (
								<>
									<Button
										variant="outlined"
										color="primary"
										onClick={onImportAsset}
										className={classes.button}
									>
										{loading ? "Importing ..." : "Import Assets"}
									</Button>
									<ImportTable title="New Assets" data={newAssets} />
									<ImportTable title="Modified Assets" data={modifiedAssets} />
									<ImportTable title="New References" data={newReferences} />
									<ImportTable
										title="Modified References"
										data={modifiedReferences}
									/>
								</>
							)}
						</>
					) : null}
				</div>
				<div style={{ height: "10px" }}></div>
				<CSVLink data={templateCSV} filename="site-assets-csv-template.csv">
					<Link
						style={{ cursor: "pointer", fontSize: "16px", color: "#307AD6" }}
					>
						Download Import CSV Template
					</Link>
				</CSVLink>
				<div style={{ height: "10px" }}></div>
			</DialogContent>
		</Dialog>
	);
};

export default ImportListDialog;
