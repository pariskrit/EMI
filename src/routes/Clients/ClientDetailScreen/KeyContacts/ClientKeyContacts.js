import {
	Accordion,
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
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import ClientKeyRow from "./ClientKeyRow";

const useStyles = makeStyles((theme) => ({
	keyContainer: {
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
	keyAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
}));

const ClientKeyContacts = ({ clientId }) => {
	const classes = useStyles();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchKeyContacts = async () => {
			try {
				let result = await API.get(
					`${BASE_API_PATH}Clients/${clientId}/keycontacts`
				);
				if (result.status === 200) {
					result = result.data;
					handleSort(result, setData, "name", "asc");
				} else {
					//Throw error if failed to fetch
					throw new Error(`Error: Status ${result.status}`);
				}
			} catch (error) {
				console.log(error);
				return error;
			}
		};
		fetchKeyContacts();
	}, [clientId]);

	return (
		<div className={classes.keyContainer}>
			<Accordion className={classes.keyAccordion} defaultExpanded={true}>
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
							Key Contacts
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Site</TableCell>
								<TableCell>Application</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => (
								<ClientKeyRow key={row.id} row={row} />
							))}
						</TableBody>
					</Table>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default ClientKeyContacts;
