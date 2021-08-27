import React from "react";
import RestoreIcon from "@material-ui/icons/Restore";
import Navcrumbs from "components/Navcrumbs";
import { Grid, makeStyles } from "@material-ui/core";
import AccordionBox from "components/AccordionBox";
import SiteDetails from "components/SiteDetails";
import KeyContacts from "./KeyContacts";
import Applications from "./Applications";

const useStyle = makeStyles({
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
});

const Detail = () => {
	const classes = useStyle();
	return (
		<div>
			<div className="flex justify-between">
				<Navcrumbs
					crumbs={["Client", "Region", "Site"]}
					status=""
					lastSaved=""
				/>
				<div className="right-section">
					<div className="restore">
						<RestoreIcon className={classes.restore} />
					</div>
				</div>
			</div>
			<Grid container>
				<Grid item xs={6}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<AccordionBox title="Site Details">
								<SiteDetails />
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
		</div>
	);
};

export default Detail;
