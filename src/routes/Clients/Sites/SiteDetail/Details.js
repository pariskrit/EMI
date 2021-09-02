import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import { useParams } from "react-router-dom";
import { BASE_API_PATH } from "helpers/constants";
import API from "helpers/api";

const Details = () => {
	const { id } = useParams();
	const [listOfSiteAppId, setListOfSiteAppId] = useState([]);
	const [contactsList, setContactsList] = useState([]);

	const fetchKeyContactsList = async () => {
		try {
			const result = await API.get(
				`${BASE_API_PATH}siteappkeycontacts/Site/${id}`
			);

			setContactsList(
				result.data.map((data) => ({
					id: data.siteAppID,
					name: data.displayName,
					product: data.name,
					email: data.email,
					phone: data.phone,
				}))
			);
			setListOfSiteAppId(
				result.data.map((data) => ({ siteAppId: data.siteAppID }))
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchKeyContactsList();
	}, []);
	return (
		<div style={{ marginTop: 22 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<AccordionBox title="Site Details">
								<SiteDetails siteId={id} />
							</AccordionBox>
						</Grid>
						<Grid item xs={12}>
							<KeyContacts contactsList={contactsList} />
						</Grid>
						<Grid item xs={12}>
							<Applications
								siteId={id}
								listOfSiteAppId={listOfSiteAppId}
								fetchKeyContactsList={fetchKeyContactsList}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Details;
