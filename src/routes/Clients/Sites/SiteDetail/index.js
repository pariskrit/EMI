import React from "react";
import { Grid } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import SiteWrapper from "components/SiteWrapper";
import { useHistory } from "react-router-dom";

const SiteDetail = () => {
	const history = useHistory();
	return (
		<SiteWrapper current="Details" onNavClick={(data) => history.push(data)}>
			<Grid container>
				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<AccordionBox title="Site Details">
								<SiteDetails
									onChange={(e) => console.log(e.target.value)}
									value="Boddington"
								/>
							</AccordionBox>
						</Grid>
						<Grid item xs={12}>
							<KeyContacts />
						</Grid>
						<Grid item xs={12}>
							<Applications />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</SiteWrapper>
	);
};

export default SiteDetail;
