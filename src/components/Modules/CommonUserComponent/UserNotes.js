import React, { useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddNoteDialog from "./AddNoteDialog";
import UserNoteRow from "./UserNoteRow";
import DeleteDialog from "components/Elements/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "flex-end",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
}));

const UserNotes = ({ id, getError, setNotes, apis, handleGetNotes, notes }) => {
	const classes = useStyles();

	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
	});
	const [noteId, setNoteId] = useState(null);

	const { addModal, deleteModal } = modal;

	//Add Handler
	const handleCreateData = async (note) => {
		try {
			let result = await apis.postNotesAPI({
				clientUserId: id,
				note,
			});
			if (result.status) {
				result = result.data;
				setNotes([]);
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

	return (
		<div className={classes.noteContainer}>
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
						</TableRow>
					</TableHead>
					<TableBody>
						{notes.map((row) => (
							<UserNoteRow
								key={row.id}
								row={row}
								classes={classes}
								onDeleteNote={() => handleDeleteNote(row.id)}
							/>
						))}
					</TableBody>
				</Table>
			</AccordionBox>
		</div>
	);
};

export default UserNotes;
