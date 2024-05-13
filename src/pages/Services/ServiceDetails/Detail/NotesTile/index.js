import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import NoteRow from "pages/Services/ServiceDetails/Detail/NotesTile/NoteRow";
import AddNoteDialog from "pages/Services/ServiceDetails/Detail/NotesTile/AddNoteDialog";
import DeleteDialog from "pages/Services/ServiceDetails/Detail/DeleteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	deleteServiceNotes,
	getServiceNotes,
	postServiceNote,
} from "services/services/serviceDetails/detail";
import NoteContentPopup from "components/Elements/NoteContentPopup";

const useStyles = makeStyles()((theme) => ({
	noteContainer: {
		display: "flex",
		justifyContent: "flex-end",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	noteAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},

	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
	view: {
		textDecoration: "underline",
		color: "#307ad7",
		cursor: "pointer",
	},

	actionButton: { padding: "0px 13px 12px 6px" },
}));

const Notes = ({ data, serviceId, isReadOnly }) => {
	const { classes, cx } = useStyles();
	const [modal, setModal] = useState({
		openAddModal: false,
		openDeleteModal: false,
		openContentModal: false,
	});
	const [notes, setNotes] = useState([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const dispatch = useDispatch();

	const handleAddNote = async (note) => {
		const response = await postServiceNote({
			serviceID: serviceId,
			note: note,
		});

		if (response.status) {
			fetchNotes();
		} else {
			dispatch(showError(response?.data?.error || "Could not add note"));
		}
	};

	const handleDelete = async () => {
		const {
			openDeleteModal: { id },
		} = modal;
		setIsDeleting(true);
		const response = await deleteServiceNotes(id);

		if (response.status) {
			setNotes([...notes.filter((note) => note.id !== id)]);
		} else {
			dispatch(showError(response?.data?.error || "Could not delete note"));
		}

		setIsDeleting(false);
		onCloseDeleteDialog();
	};

	const fetchNotes = async () => {
		const response = await getServiceNotes(serviceId);

		if (response.status) {
			setNotes(response.data);
		} else {
			dispatch(showError(response?.data?.error || "Could not delete note"));
		}
	};

	const onOpenDeleteDialog = (id) =>
		setModal({ ...modal, openDeleteModal: { id, open: true } });

	const onCloseDeleteDialog = () =>
		setModal({ ...modal, openDeleteModal: false });

	const onOpenAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: true }));

	const onCloseAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: false }));

	const onCloseContentDialog = () =>
		setModal({ ...modal, openContentModal: false });
	const onOpenContentDialog = (note) =>
		setModal({ ...modal, openContentModal: { open: true, note } });

	useEffect(() => {
		if (data) {
			setNotes(data);
		}
	}, [data]);
	return (
		<div className={classes.noteContainer}>
			<NoteContentPopup
				open={modal.openContentModal.open ?? false}
				onClose={onCloseContentDialog}
				note={modal.openContentModal.note}
			/>
			<AddNoteDialog
				open={modal.openAddModal}
				handleClose={onCloseAddDialog}
				createHandler={handleAddNote}
			/>
			<DeleteDialog
				entityName="Note"
				open={modal?.openDeleteModal?.open ?? false}
				closeHandler={onCloseDeleteDialog}
				handleDelete={handleDelete}
				isDeleting={isDeleting}
			/>

			<AccordionBox
				title={`Notes (${notes.length})`}
				isActionsPresent={isReadOnly ? false : true}
				buttonName="Add Note"
				buttonAction={onOpenAddDialog}
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
					<TableBody>
						{notes?.map((row) => (
							<NoteRow
								key={row.id}
								row={row}
								classes={classes}
								onDeleteNote={onOpenDeleteDialog}
								onViewNote={onOpenContentDialog}
								isReadOnly={isReadOnly}
							/>
						))}
					</TableBody>
				</Table>
			</AccordionBox>
		</div>
	);
};

export default Notes;
