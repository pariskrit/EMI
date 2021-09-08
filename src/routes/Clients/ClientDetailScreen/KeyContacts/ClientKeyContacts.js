import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import DataTable from "components/SimpleDataTable";
import { getClientKeyContacts } from "services/clients/clientDetailScreen";
import { CircularProgress } from "@material-ui/core";

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
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchKeyContacts = async () => {
			try {
				let result = await getClientKeyContacts(clientId);
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
	}, [clientId]);

	return (
		<div className={classes.keyContainer}>
			<AccordionBox title="Key Contacts" accordianDetailsCss="table-container">
				{isLoading ? (
					<CircularProgress />
				) : (
					<DataTable
						data={data}
						tableHeaders={["Name", "Site", "Application", "Email", "Phone"]}
					/>
				)}
			</AccordionBox>
		</div>
	);
};

export default ClientKeyContacts;
