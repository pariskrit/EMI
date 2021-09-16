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
import AccordionBox from "components/Elements/AccordionBox";
import DeleteDialog from "components/Modules/DeleteDialog";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import {
	addClientNote,
	getClientNotes,
} from "services/clients/clientDetailScreen";
import AddNoteDialog from "./AddNoteDialog";
import ClientNoteRow from "./ClientNoteRow";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		marginTop: 25,
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

	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ClientNotes = ({ clientId, getError }) => {
	const classes = useStyles();
	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
	});
	const [noteId, setNoteId] = useState(null);
	const [data, setData] = useState([]);
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchNotes = async () => {
		try {
			let result = await getClientNotes(clientId);

			if (cancelFetch.current) {
				return;
			}
			if (result.status) {
				result = result.data;
				handleSort(result, setData, "name", "asc");
			}
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
			return err;
		}
	};

	useEffect(() => {
		fetchNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			cancelFetch.current = true;
		};
	}, []);

	const handleCreateData = async (note) => {
		try {
			let result = await addClientNote({
				note,
				clientID: clientId,
			});
			if (result.status) {
				result = result.data;
				setData([]);
				await fetchNotes();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			getError("Error Creating Note");
		}
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
	return (
		<div className={classes.noteContainer}>
			<AddNoteDialog
				open={addModal}
				handleClose={() => setModal((th) => ({ ...th, addModal: false }))}
				createHandler={handleCreateData}
				clientId={clientId}
			/>
			<DeleteDialog
				entityName="Note"
				open={deleteModal}
				closeHandler={() => setModal((th) => ({ ...th, deleteModal: false }))}
				deleteEndpoint={`${BASE_API_PATH}Clientnotes`}
				deleteID={noteId}
				handleRemoveData={handleRemoveData}
			/>

			<AccordionBox
				title={`Notes (${data.length})`}
				isActionsPresent={true}
				buttonName="Add Note"
				buttonAction={() => setModal((th) => ({ ...th, addModal: true }))}
				accordianDetailsCss="table-container"
			>
				{isLoading ? (
					<CircularProgress />
				) : (
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
							{data.map((row) => (
								<ClientNoteRow
									key={row.id}
									row={row}
									classes={classes}
									onDeleteNote={() => handleDeleteNote(row.id)}
								/>
							))}
						</TableBody>
					</Table>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientNotes;
