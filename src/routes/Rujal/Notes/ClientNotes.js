import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import CurveButton from "../../../components/CurveButton";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../../helpers/colourConstants";
import AddNoteDialog from "./AddNoteDialog";
import ClientNoteRow from "./ClientNoteRow";
import API from "../../../helpers/api";
import { BASE_API_PATH } from "../../../helpers/constants";
import { handleSort } from "../../../helpers/utils";
import DeleteDialog from "../../../components/DeleteDialog";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
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
		width: "99%",
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
		color: "#307AD6",
		textDecoration: "underline",
		"&:hover": {
			cursor: "pointer",
		},
	},
	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ClientNotes = () => {
	const classes = useStyles();
	const [addModal, setAddModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [noteId, setNoteId] = useState(null);
	const [data, setData] = useState([]);

	const fetchNotes = async () => {
		try {
			let result = await API.get(`${BASE_API_PATH}clientnotes?clientid=8`);
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
				clientID: 8,
			});
			if (result.status === 201 || result.status === 200) {
				result = result.data;
				setData([]);
				await fetchNotes();
				return { success: true };
			} else {
				throw new Error(result);
			}
		} catch (err) {}
	};

	const handleDeleteNote = (id) => {
		setNoteId(id);
		setDeleteModal(true);
	};

	const handleRemoveData = (id) => {
		const filteredData = [...data].filter((x) => x.id !== id);
		setData(filteredData);
	};
	return (
		<div className={classes.noteContainer}>
			<AddNoteDialog
				open={addModal}
				handleClose={() => setAddModal(false)}
				createHandler={handleCreateData}
			/>
			<DeleteDialog
				entityName="Note"
				open={deleteModal}
				closeHandler={() => setDeleteModal(false)}
				deleteEndpoint={`${BASE_API_PATH}Clientnotes`}
				deleteID={noteId}
				handleRemoveData={handleRemoveData}
			/>{" "}
			<Accordion className={classes.noteAccordion}>
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
				<AccordionDetails>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Note</TableCell>
								<TableCell></TableCell>
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
					<CurveButton onClick={() => setAddModal(true)}>Add Note</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientNotes;
