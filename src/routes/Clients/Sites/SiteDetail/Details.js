import React from "react";
import { Grid } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import { useParams } from "react-router-dom";

const Details = () => {
	const { id } = useParams();
	return (
		<div style={{ marginTop: 22 }}>
			<Grid container>
				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<AccordionBox title="Site Details">
								<SiteDetails siteId={id} />
							</AccordionBox>
						</Grid>
						<Grid item xs={12}>
							<KeyContacts siteId={id} />
						</Grid>
						<Grid item xs={12}>
							<Applications siteId={id} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Details;
