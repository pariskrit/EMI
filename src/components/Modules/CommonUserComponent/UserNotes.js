import React, { useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AddNoteDialog from "./AddNoteDialog";
import UserNoteRow from "./UserNoteRow";
import DeleteDialog from "components/Elements/DeleteDialog";
import { postUserDetailsNote } from "services/users/userDetails";
import NoteContentPopup from "components/Elements/NoteContentPopup";

const useStyles = makeStyles()((theme) => ({
	noteContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-end",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},

	tableBody: {
		whiteSpace: "noWrap",
	},
}));

const UserNotes = ({ id, getError, setNotes, apis, handleGetNotes, notes }) => {
	const { classes, cx } = useStyles();
	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
		openContentModal: false,
	});
	const [noteId, setNoteId] = useState(null);

	const { addModal, deleteModal } = modal;

	//Add Handler
	const handleCreateData = async (note) => {
		try {
			let result = await postUserDetailsNote({
				clientUserId: id,
				note,
			});

			if (result.status) {
				result = result.data;
				//setNotes([]);
				await handleGetNotes();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			getError("Error Creating Note");
		}
	};

	//Delete
	const handleDeleteNote = (id) => {
		setNoteId(id);
		setModal((th) => ({ ...th, deleteModal: true }));
	};

	const handleRemoveData = (id) => {
		const filteredData = [...notes].filter((x) => x.id !== id);
		setNotes(filteredData);
	};
	const onOpenContentDialog = (note) => {
		setModal({ ...modal, openContentModal: { open: true, note } });
	};
	const onCloseContentDialog = () =>
		setModal({ ...modal, openContentModal: false });

	return (
		<div className={classes.noteContainer}>
			<NoteContentPopup
				open={modal.openContentModal.open ?? false}
				onClose={onCloseContentDialog}
				note={modal.openContentModal.note}
			/>
			<AddNoteDialog
				open={addModal}
				handleClose={() => setModal((th) => ({ ...th, addModal: false }))}
				createHandler={handleCreateData}
				userId={id}
			/>

			<DeleteDialog
				entityName="Note"
				open={deleteModal}
				closeHandler={() => setModal((th) => ({ ...th, deleteModal: false }))}
				deleteEndpoint={apis.deleteNoteAPI}
				deleteID={noteId}
				handleRemoveData={handleRemoveData}
			/>

			<AccordionBox
				title="Notes"
				isActionsPresent={true}
				buttonName="Add Note"
				buttonAction={() => setModal((th) => ({ ...th, addModal: true }))}
				accordianDetailsCss="table-container"
			>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell style={{ width: "170px" }}>Name</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Note</TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={classes.tableBody}>
						{notes.map((row) => (
							<UserNoteRow
								key={row.id}
								row={row}
								classes={classes}
								onDeleteNote={() => handleDeleteNote(row.id)}
								onViewNote={onOpenContentDialog}
							/>
						))}
					</TableBody>
				</Table>
			</AccordionBox>
		</div>
	);
};

export default UserNotes;
