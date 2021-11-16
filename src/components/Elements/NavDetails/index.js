import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "helpers/colourConstants";
import SaveHistory from "../SaveHistory";
import { connect } from "react-redux";

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
		margin: "0 5px 0px 5px",
		display: "flex",
		alignItems: "center",
	},
}));

const NavDetails = ({ staticCrumbs, crumbs, status }) => {
	// Init hooks
	const classes = useStyles();

	// Custom styled separator icon
	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb" separator={<DefaultSeparator />}>
				{staticCrumbs?.length > 0 && staticCrumbs.every((crumb) => crumb)
					? staticCrumbs?.map((crumb, i) => (
							<Typography
								key={i}
								className={classes.crumbText}
								color="textPrimary"
							>
								{crumb}
							</Typography>
					  ))
					: crumbs.map((crumb) => (
							<Typography
								key={crumb}
								className={classes.crumbText}
								color="textPrimary"
							>
								{crumb}
							</Typography>
					  ))}
			</Breadcrumbs>
			<div className="left-section flex-wrap  mb-sm">
				{status && (
					<div className="flex mr-sm mt-sm">
						<b>Status:</b>
						<div
							className={`${classes.icon} flex`}
							style={{
								backgroundColor: "#24BA78",
							}}
						></div>
						Active
					</div>
				)}
				<SaveHistory />
			</div>
		</div>
	);
};

const mapStateToProps = ({ siteDetailData: { crumbs } }) => ({
	crumbs,
});

export default connect(mapStateToProps)(NavDetails);
