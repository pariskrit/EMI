import React, { useState } from "react";
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
	const [open, setOpen] = useState(false);
	const [data] = useState([
		{
			id: 1,
			name: "Sarah MacPherson",
			date: "18/12/2019",
			note: "Lorem Ipson, this is the description with various features in its",
		},
		{
			id: 2,
			name: "Lara MacPherson",
			date: "18/12/2019",
			note: "Gorem Ipson, this is the description with various features in its",
		},
	]);

	return (
		<div className={classes.noteContainer}>
			<AddNoteDialog open={open} handleClose={() => setOpen(false)} />
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
							Notes (3)
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
								<ClientNoteRow key={row.id} row={row} classes={classes} />
							))}
						</TableBody>
					</Table>
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<CurveButton onClick={() => setOpen(true)}>Add Note</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientNotes;
