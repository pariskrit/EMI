import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";
import ArrowIcon from "../../assets/icons/arrowIcon.svg";
import ColourConstants from "../../helpers/colourConstants";
import { useState } from "react";
import IOSSwitch from "../../components/IOSSwitch";

const useStyles = makeStyles((theme) => ({
	appContainer: {
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
	appAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
	appName: {
		color: "#307AD6",
		textDecoration: "underline",
	},
	curveButton: {
		borderRadius: 50,
		padding: "6px 26px",
		borderWidth: 1,
		borderColor: ColourConstants.navButtonOnHover,
		fontWeight: "bold",
		fontSize: "12px",
		fontFamily: "Roboto Condensed",
		letterSpacing: 0,
		backgroundColor: "#24BA78",
		float: "right",
		color: "white",
		textTransform: "none",
		"&:hover": { backgroundColor: "#D2D2D9" },
	},
	actionButton: { padding: "0px 13px 12px 6px" },
}));

const ClientApplication = () => {
	const classes = useStyles();
	const [currentStatus, setCurrentStatus] = useState(true);

	return (
		<div className={classes.appContainer}>
			<Accordion className={classes.appAccordion}>
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
							Application (3)
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Sites(Qty)</TableCell>
								<TableCell>Sites(Locations)</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell className={classes.appName}>
									Zone Maintenance
								</TableCell>
								<TableCell>3</TableCell>
								<TableCell>Tamani</TableCell>
								<TableCell>
									<IOSSwitch
										onChange={() => setCurrentStatus(!currentStatus)}
										currentStatus={currentStatus}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</AccordionDetails>
				<AccordionActions className={classes.actionButton}>
					<Button className={classes.curveButton}>Add new</Button>
				</AccordionActions>
			</Accordion>
		</div>
	);
};

export default ClientApplication;
