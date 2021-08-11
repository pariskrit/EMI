import React from "react";
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
import CurveButton from "../../components/CurveButton";
import ArrowIcon from "../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../helpers/colourConstants";
import { ReactComponent as DeleteIcon } from "../../assets/icons/deleteIcon.svg";

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

	return (
		<div className={classes.noteContainer}>
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
							<TableRow>
								<TableCell>Sarah MacPherson</TableCell>
								<TableCell>18/11/2020</TableCell>
								<TableCell>
									Lorem Ipson, this is the description with various features in
									its
								</TableCell>
								<TableCell>
									<span className={classes.view}>View</span>
								</TableCell>
								<TableCell>
									<DeleteIcon className={classes.deleteIcon} />
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<CurveButton>Add Note</CurveButton>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientNotes;
