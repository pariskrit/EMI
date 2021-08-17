import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import CurveButton from "components/CurveButton";
import DeleteDialog from "components/DeleteDialog";
import ErrorDialog from "components/ErrorDialog";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
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

const ClientNotes = ({ clientId }) => {
	const classes = useStyles();
	const [modal, setModal] = useState({
		addModal: false,
		deleteModal: false,
		errorModal: false,
	});
	const [noteId, setNoteId] = useState(null);
	const [data, setData] = useState([]);

	const fetchNotes = async () => {
		try {
			let result = await API.get(
				`${BASE_API_PATH}clientnotes?clientid=${clientId}`
			);
			if (result.status === 200) {
				result = result.data;
				handleSort(result, setData, "name", "asc");
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	const handleCreateData = async (note) => {
		try {
			let result = await API.post(`${BASE_API_PATH}ClientNotes`, {
				note,
				clientID: clientId,
			});
			if (result.status === 201 || result.status === 200) {
				result = result.data;
				setData([]);
				await fetchNotes();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {
			console.log(err.response);
			setModal((th) => ({ ...th, errorModal: true }));
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
	const { addModal, errorModal, deleteModal } = modal;
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
			/>{" "}
			<ErrorDialog
				open={errorModal}
				handleClose={() => setModal((th) => ({ ...th, errorModal: false }))}
			/>
			<Accordion className={classes.noteAccordion} defaultExpanded={true}>
				<AccordionSummary
					expandIcon={
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<div>
						<Typography className={classes.sectionHeading}>
							Notes ({data.length})
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails className="table-container">
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
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<CurveButton
						onClick={() => setModal((th) => ({ ...th, addModal: true }))}
					>
						Add Note
					</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientNotes;
