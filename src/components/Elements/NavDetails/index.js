import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "helpers/colourConstants";
import SaveHistory from "../SaveHistory";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	crumbText: {
		fontWeight: "bold",
		fontSize: "20px",
		color: ColourConstants.commonText,
	},
	link: {
		fontWeight: "bold",
		fontSize: "20px",
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
	const [isActive, setActive] = useState(false);

	// Custom styled separator icon
	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb" separator={<DefaultSeparator />}>
				{staticCrumbs?.length > 0 && staticCrumbs.every((crumb) => crumb.name)
					? staticCrumbs?.map((crumb, i) =>
							i === staticCrumbs.length - 1 ? (
								<Typography
									key={crumb.id}
									className={classes.crumbText}
									color="textPrimary"
								>
									{crumb.name}
								</Typography>
							) : (
								<NavLink
									to={crumb.url}
									key={crumb.id}
									className={classes.link}
									style={{ color: isActive ? "#1164CE" : "#307AD7" }}
									onMouseDown={() => setActive(true)}
								>
									{crumb.name}
								</NavLink>
							)
					  )
					: crumbs?.map((crumb, i) =>
							i === crumbs.length - 1 ? (
								<Typography
									key={crumb.id}
									className={classes.crumbText}
									color="textPrimary"
								>
									{crumb.name}
								</Typography>
							) : (
								<NavLink
									to={crumb.url}
									key={crumb.id}
									className={classes.link}
									style={{ color: isActive ? "#1164CE" : "#307AD7" }}
									onMouseDown={() => setActive(true)}
								>
									{crumb.name}
								</NavLink>
							)
					  )}
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
