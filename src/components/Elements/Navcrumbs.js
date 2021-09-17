import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "../../helpers/colourConstants";

const useStyles = makeStyles((theme) => ({
	crumbText: {
		fontWeight: "bold",
		fontSize: "20px",
		color: ColourConstants.commonText,
	},
	separator: {
		fontWeight: "bold",
		fontSize: "20px",
	},
	icon: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		margin: "5px 5px 0px 5px",
	},
}));

const Navcrumbs = ({ crumbs, status }) => {
	// Init hooks
	const classes = useStyles();

	// Custom styled separator icon
	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb" separator={<DefaultSeparator />}>
				{crumbs.map((crumb) => (
					<Typography
						key={crumb}
						className={classes.crumbText}
						color="textPrimary"
					>
						{crumb}
					</Typography>
				))}
			</Breadcrumbs>
		</div>
	);
};

export default Navcrumbs;
