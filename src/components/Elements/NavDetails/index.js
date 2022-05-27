import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import ColourConstants from "helpers/colourConstants";
import SaveHistory from "../SaveHistory";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

const NavDetails = ({
	state,
	staticCrumbs,
	crumbs,
	status,
	history,
	hideLastLogin,
	hideVersion,
	hideLastSave = false,
}) => {
	// Init hooks
	const classes = useStyles();
	const [isActive, setActive] = useState(false);
	const { role, site } = JSON.parse(
		sessionStorage.getItem("me") || localStorage.getItem("me")
	);
	const location = useLocation();
	const path = location.pathname.split("/");

	// Custom styled separator icon
	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	let realCrumbs =
		staticCrumbs?.length > 0 && staticCrumbs.every((crumb) => crumb.name)
			? staticCrumbs
			: crumbs;

	// Show Site Name only in crumbs if user is Site Application User
	if (role === "SiteUser" && path.includes("clients"))
		realCrumbs = [{ id: 1, name: site?.siteName }];

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb" separator={<DefaultSeparator />}>
				{realCrumbs?.map((crumb, i) =>
					i === realCrumbs.length - 1 ? (
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
								backgroundColor: state?.statusColor,
							}}
						></div>
						{state?.modelStatusName ?? "Active"}
					</div>
				)}
				{history && (
					<SaveHistory
						hideLastLogin={hideLastLogin}
						versionNumber={state?.version}
						hideVersion={hideVersion}
						hideLastSave={hideLastSave}
					/>
				)}
			</div>
		</div>
	);
};

NavDetails.defaultProps = {
	history: true,
};

NavDetails.propTypes = {
	history: PropTypes.bool,
	crumbs: PropTypes.array,
	staticCrumbs: PropTypes.array,
};

const mapStateToProps = ({ siteDetailData: { crumbs } }) => ({
	crumbs,
});

export default connect(mapStateToProps)(NavDetails);
