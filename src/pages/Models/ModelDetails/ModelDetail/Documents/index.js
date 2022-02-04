import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import Row from "./Row";
import DeleteDialog from "../DeleteDialog";

import { deleteDocument } from "services/models/modelDetails/details";
import { showError } from "redux/common/actions";

function Documents({ classes, modelId, documents, isReadOnly }) {
	const [filesUploading, setFilesUploading] = useState(false);
	const [listOfDocuments, setListOfDocuments] = useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState({
		isOpen: false,
		id: null,
	});
	const [isDeleting, setIsDeleting] = useState(false);
	const dispatch = useDispatch();

	const onDocumentUpload = async (key, url) => {
		const response = await uploadDocument({ modelId, documentKey: key });
		if (response.status) {
			const documents = await getModelDocuments(modelId);
			setListOfDocuments(documents.data);
		} else {
			dispatch(showError("Could not upload document"));
		}

		setFilesUploading(false);
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
		if (listOfDocuments.length === 0) {
			setListOfDocuments(documents);
		}
	}, [documents, listOfDocuments]);
	return (
		<>
			<DeleteDialog
				open={openDeleteDialog.isOpen}
				closeHandler={onDeleteDialogClose}
				entityName="Model Document"
				handleDelete={handleDelete}
				isDeleting={isDeleting}
			/>
			<AccordionBox title={`Model documents (2)`}>
				<div className={classes.logoContentParent}>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell style={{ width: "170px" }}>FileName</TableCell>
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
							/>
						</div>
					)}
				</div>
			</AccordionBox>
		</>
	);
}

export default Documents;
