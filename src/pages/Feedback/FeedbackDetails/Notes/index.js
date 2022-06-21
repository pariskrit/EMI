import React, { useCallback, useEffect, useState } from "react";
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import NoteRow from "./NoteRow";
import AddNoteDialog from "./AddNoteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ContentDialog from "./ContentDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";
import {
	addFeedbackNotes,
	getFeedbackNotes,
} from "services/feedback/feedbackdetails";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		// marginTop: 25,
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

const Notes = ({ data, feedbackId, isReadOnly }) => {
	const classes = useStyles();
	const [feedback, setFeedback] = useState({
		openAddModal: false,
		openDeleteModal: false,
		openContentModal: false,
	});
	const [notes, setNotes] = useState([]);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	const handleAddNote = async (note) => {
		const response = await addFeedbackNotes({ feedbackID: feedbackId, note });

		if (response.status) {
			fetchNotes();
		} else {
			dispatch(showError(response.data.error || "Could not add note"));
		}
	};

	const handleDelete = async () => {
		fetchNotes();
		onCloseDeleteDialog();
	};

	const fetchNotes = useCallback(async () => {
		const response = await getFeedbackNotes(feedbackId);

		if (response.status) {
			setNotes(response.data);
		} else {
			dispatch(showError(response.data?.error || "Could not fetch note"));
		}
		setLoading(false);
	}, [feedbackId, dispatch]);

	const onOpenDeleteDialog = (id) =>
		setFeedback({ ...feedback, openDeleteModal: { id, open: true } });

	const onCloseDeleteDialog = () =>
		setFeedback({ ...feedback, openDeleteModal: false });

	const onOpenAddDialog = () =>
		setFeedback((prev) => ({ ...prev, openAddModal: true }));

	const onCloseAddDialog = () =>
		setFeedback((prev) => ({ ...prev, openAddModal: false }));

	const onCloseContentDialog = () =>
		setFeedback({ ...feedback, openContentModal: false });
	const onOpenContentDialog = (note) =>
		setFeedback({ ...feedback, openContentModal: { open: true, note } });

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	return (
		<div className={classes.noteContainer}>
			<ContentDialog
				open={feedback.openContentModal.open ?? false}
				onClose={onCloseContentDialog}
				note={feedback.openContentModal.note}
			/>
			<AddNoteDialog
				open={feedback.openAddModal}
				handleClose={onCloseAddDialog}
				createHandler={handleAddNote}
			/>
			<DeleteDialog
				entityName="Note"
				open={feedback?.openDeleteModal?.open ?? false}
				closeHandler={onCloseDeleteDialog}
				deleteEndpoint={Apis.FeedbackNotes}
				deleteID={feedback?.openDeleteModal?.id}
				handleRemoveData={handleDelete}
				getError={(error) =>
					dispatch(showError(error || "Could not delete note"))
				}
			/>

			<AccordionBox
				title={`Notes (${notes?.length})`}
				isActionsPresent={isReadOnly ? false : true}
				buttonName="Add Note"
				buttonAction={onOpenAddDialog}
				accordianDetailsCss="table-container"
			>
				{loading ? (
					<CircularProgress />
				) : (
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
				)}
			</AccordionBox>
		</div>
	);
};

export default Notes;
