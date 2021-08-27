import React from "react";
import RestoreIcon from "@material-ui/icons/Restore";
import Navcrumbs from "components/Navcrumbs";
import { makeStyles } from "@material-ui/core";
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

const Assets = ({ children }) => {
	const classes = useStyle();
	return (
		<div>
			<div className="flex justify-between">
				<Navcrumbs
					crumbs={["Client", "Region", "SIte"]}
					status=""
					lastSaved=""
				/>

				<div>
					<div className="restore">
						<RestoreIcon className={classes.restore} />
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};

export default Assets;
