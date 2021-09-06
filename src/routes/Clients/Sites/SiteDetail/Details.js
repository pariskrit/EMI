import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import { useParams } from "react-router-dom";
import { getSiteAppKeyContacts } from "services/clients/sites/siteDetails";

const Details = () => {
	const { id } = useParams();
	const [listOfSiteAppId, setListOfSiteAppId] = useState([]);
	const [contactsList, setContactsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const cancelFetch = useRef(false);
	const [isApplicationsLoading, setApplicationsLoading] = useState(true);

	const fetchKeyContactsList = async () => {
		const result = await getSiteAppKeyContacts(id);

		if (cancelFetch.current) {
			return;
		}

		if (result.status) {
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

			if (result.data.length === 0) {
				setApplicationsLoading(false);
			}
			setIsLoading(false);
			return true;
		} else {
			setIsLoading(false);
			return false;
		}
	};

	useEffect(() => {
		fetchKeyContactsList();

		return () => {
			cancelFetch.current = true;
		};
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
							<KeyContacts contactsList={contactsList} isLoading={isLoading} />
						</Grid>
						<Grid item xs={12}>
							<Applications
								siteId={id}
								listOfSiteAppId={listOfSiteAppId}
								fetchKeyContactsList={fetchKeyContactsList}
								isLoading={isApplicationsLoading}
								setIsLoading={setApplicationsLoading}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Details;
