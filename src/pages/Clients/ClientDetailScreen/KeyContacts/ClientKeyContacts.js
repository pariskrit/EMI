import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import DataTable from "components/Modules/SimpleDataTable";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useRef, useState } from "react";
import { getClientKeyContacts } from "services/clients/clientDetailScreen";

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
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchKeyContacts = async () => {
			try {
				let result = await getClientKeyContacts(clientId);

				if (cancelFetch.current) {
					return;
				}
				if (result.status) {
					result = result.data;
					handleSort(result, setData, "name", "asc");
				} else {
					//Throw error if failed to fetch
					throw new Error(`Error: Status ${result.status}`);
				}
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				setIsLoading(false);
				return error;
			}
		};
		fetchKeyContacts();

		return () => {
			cancelFetch.current = true;
		};
	}, [clientId]);

	return (
		<div className={classes.keyContainer}>
			<AccordionBox title="Key Contacts" accordianDetailsCss="table-container">
				{isLoading ? (
					<CircularProgress />
				) : (
					<DataTable
						data={data}
						tableHeaders={["Name", "Application", "Site", "Phone", "Email"]}
					/>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientKeyContacts;
