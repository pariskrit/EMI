import React, { useEffect, useRef, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import DropUploadBox from "components/Elements/DropUploadBox";
import { Apis } from "services/api";
import {
	getModelDocuments,
	uploadDocument,
} from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import Row from "./Row";
import DeleteDialog from "pages/Models/ModelDetails/ModelDetail/DeleteDialog";

import { deleteDocument } from "services/models/modelDetails/details";
import { showError } from "redux/common/actions";

function Documents({
	classes,
	modelId,
	documents,
	isReadOnly,
	customCaptions,
}) {
	const [filesUploading, setFilesUploading] = useState(false);
	const [listOfDocuments, setListOfDocuments] = useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState({
		isOpen: false,
		id: null,
	});
	const [isDeleting, setIsDeleting] = useState(false);
	const [documentError, setDocumentError] = useState("");
	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);
	const cancelFileUpload = useRef(null);

	const dispatch = useDispatch();

	const onDocumentUpload = async (key, url) => {
		setFilesUploading(false);
		const response = await uploadDocument({ modelId, documentKey: key });
		if (response.status) {
			const documents = await getModelDocuments(modelId);
			setDocumentError("");
			setListOfDocuments(documents.data);
		} else {
			dispatch(showError("Could not upload document"));
		}

		setUploadPercentCompleted(0);
	};

	const onOpenDeleteDialog = (id) => setOpenDeleteDialog({ isOpen: true, id });

	const onDeleteDialogClose = () =>
		setOpenDeleteDialog({ isOpen: false, id: null });

	const handleDelete = async () => {
		const { id } = openDeleteDialog;
		setIsDeleting(true);
		const response = await deleteDocument(id);
		if (response.status) {
			setListOfDocuments([
				...listOfDocuments.filter((document) => document.id !== id),
			]);
		} else {
			dispatch(showError("Could not delete document"));
		}

		setIsDeleting(false);
		onDeleteDialogClose();
	};

	useEffect(() => {
		if (documents && documents.length) {
			setListOfDocuments(documents);
		}
	}, [documents]);

	useEffect(() => {
		if (uploadPercentCompleted === 100) {
			setFilesUploading(false);
		}
	}, [uploadPercentCompleted]);
	return (
		<>
			<DeleteDialog
				open={openDeleteDialog.isOpen}
				closeHandler={onDeleteDialogClose}
				entityName="Model Document"
				handleDelete={handleDelete}
				isDeleting={isDeleting}
			/>
			<AccordionBox
				title={`${customCaptions?.model} Documents (${listOfDocuments.length})`}
			>
				<div className={classes.logoContentParent}>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell style={{ width: "170px" }}>Filename</TableCell>
								<TableCell>User</TableCell>
								<TableCell>Date</TableCell>
								{isReadOnly ? null : <TableCell></TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{listOfDocuments.map((row) => (
								<Row
									key={row.id}
									row={row}
									classes={classes}
									onDeleteClick={() => onOpenDeleteDialog(row.id)}
									isReadOnly={isReadOnly}
								/>
							))}
						</TableBody>
					</Table>

					{isReadOnly ? null : (
						<div className={classes.uploaderContainer}>
							<DropUploadBox
								uploadReturn={onDocumentUpload}
								apiPath={`${Apis.Models}/${modelId}/uploadDocument`}
								filesUploading={filesUploading}
								setFilesUploading={setFilesUploading}
								isDocumentUploaded
								getError={setDocumentError}
								uploadPercentCompleted={uploadPercentCompleted}
								setUploadPercentCompleted={setUploadPercentCompleted}
								cancelFileUpload={cancelFileUpload}
								showProgress
							/>
							<p className={classes.documentError}>{documentError}</p>
						</div>
					)}
				</div>
			</AccordionBox>
		</>
	);
}

export default Documents;
