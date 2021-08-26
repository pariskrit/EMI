import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/AccordionBox";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { BASE_API_PATH } from "helpers/constants";
import { handleSort } from "helpers/utils";
import React, { useEffect, useState } from "react";
import DataTable from "components/SimpleDataTable";

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
			<AccordionBox title="Key Contacts" accordianDetailsCss="table-container">
				<DataTable
					data={data}
					tableHeaders={["Name", "Site", "Application", "Email", "Phone"]}
				/>
			</AccordionBox>
		</div>
	);
};

export default ClientKeyContacts;
