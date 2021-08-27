import React from "react";
import { Grid } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";
import Wrapper from "components/Wrapper";

const SiteDetail = () => {
	return (
		<Wrapper>
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
		</Wrapper>
	);
};

export default SiteDetail;
