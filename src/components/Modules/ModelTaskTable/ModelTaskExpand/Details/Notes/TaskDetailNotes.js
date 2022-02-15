import React, { useEffect, useRef, useState } from "react";
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
import DeleteDialog from "components/Elements/DeleteDialog";
import ColourConstants from "helpers/colourConstants";
import { Apis } from "services/api";
import AddNoteDialog from "./AddNoteDialog";
import NoteRow from "./NoteRow";
import {
	addModelTaskNote,
	getModelTaskNotes,
} from "services/models/modelDetails/modelTaskNotes";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		display: "flex",
		justifyContent: "flex-end",
		width: "100%",
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

	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ModelTaskNotes = ({ taskGroupId, modelId, customCaptions, disabled }) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
	});
	const [noteId, setNoteId] = useState(null);
	const [data, setData] = useState([]);
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(false);

	const fetchNotes = async (showLoading = true) => {
		try {
			showLoading && setIsLoading(true);
			if (cancelFetch.current) {
				return;
			}
			const response = await getModelTaskNotes(modelId, taskGroupId);
			if (response.status) {
				setData(response.data);
			} else {
				dispatch(showError(response?.data?.title || "something went wrong"));
			}
		} catch (err) {
			dispatch(showError(err?.response?.data || "something went wrong"));
		} finally {
			showLoading && setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchNotes();

		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCreateData = async (note) => {
		return await addModelTaskNote({
			modelId: modelId,
			taskGroupId: taskGroupId,
			note: note,
		});
	};

	const handleDeleteNote = (id) => {
		setNoteId(id);
		setModal((th) => ({ ...th, deleteModal: true }));
	};

	const handleRemoveData = (id) => {
		const filteredData = [...data].filter((x) => x.id !== id);
		setData(filteredData);
	};
	const { addModal, deleteModal } = modal;

	if (isLoading) return <CircularProgress />;
	return (
		<div className={classes.noteContainer}>
			<AddNoteDialog
				open={addModal}
				handleClose={() => setModal((th) => ({ ...th, addModal: false }))}
				createHandler={handleCreateData}
				fetchNotes={() => fetchNotes(false)}
			/>
			<DeleteDialog
				entityName="Note"
				open={deleteModal}
				closeHandler={() => setModal((th) => ({ ...th, deleteModal: false }))}
				deleteEndpoint={`${Apis.ModelTaskNotes}`}
				deleteID={noteId}
				handleRemoveData={handleRemoveData}
			/>

			<AccordionBox
				title={`Notes (${data.length})`}
				isActionsPresent={disabled ? false : true}
				buttonName="Add Note"
				buttonAction={() => setModal((th) => ({ ...th, addModal: true }))}
				accordianDetailsCss="table-container"
			>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell>{customCaptions?.user}</TableCell>
							<TableCell>Date</TableCell>
							<TableCell style={{ width: "60%" }}>Note</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.length > 0 ? (
							[...data]
								?.reverse()
								?.map((row) => (
									<NoteRow
										key={row.id}
										row={row}
										classes={classes}
										onDeleteNote={() => handleDeleteNote(row.id)}
										disabled={disabled}
									/>
								))
						) : (
							<TableRow>
								<TableCell>No any records found</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AccordionBox>
		</div>
	);
};

export default ModelTaskNotes;
