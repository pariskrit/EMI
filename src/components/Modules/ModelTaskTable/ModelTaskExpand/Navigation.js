import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ColourConstants from "helpers/colourConstants";
import PropTypes from "prop-types";

const media = "@media(max-width: 768px)";

const useStyles = makeStyles((theme) => ({
	desktopNav: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		[media]: {
			display: "none",
		},
	},

	mobileNav: {
		display: "none",
		[media]: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			"& > *": {
				margin: theme.spacing(1),
			},
		},
	},
	background: {
		[media]: {
			position: " absolute",
			top: 0,
			left: 0,
			height: "100vh",
			width: "100vw",
		},
	},
	buttonGroup: {
		width: "100%",
	},
	curveButton: {
		borderRadius: 0,
		padding: 6,
		borderWidth: 1,
		borderColor: ColourConstants.navButtonOnHover,
		fontWeight: "bold",
		fontSize: "14.5px",
		fontFamily: "Roboto Condensed",
		letterSpacing: 0,
		"&:hover": {
			backgroundColor: ColourConstants.navButtonOnHover,
			color: "#FFFFFF",
		},
	},
	curveButtonCurrent: {
		backgroundColor: ColourConstants.navButtonOnHover,
		color: "#FFFFFF",
	},
}));

const Navigation = ({ navigation, current, onClick }) => {
	// Init hooks
	const classes = useStyles();

	return (
		<>
			<div className={classes.background}></div>
			<div className={` buttonGroup ${classes.desktopNav}`}>
				<ButtonGroup
					fullWidth={true}
					className={`${classes.buttonGroup} `}
					aria-label="outlined primary button group"
					size="small"
				>
					{navigation.map((navItem, index) => {
						// TODO: below is updated zeroth button to be current. This needs to come
						// from state in prod

						return (
							<Button
								className={`${
									navItem.name === current
										? clsx(classes.curveButton, classes.curveButtonCurrent)
										: classes.curveButton
								} largeBtn`}
								onClick={() => onClick(navItem.name)}
								key={index}
							>
								{navItem.label}
							</Button>
						);
					})}
				</ButtonGroup>
			</div>
			<div className={`buttonGroup ${classes.mobileNav}`}>
				<ButtonGroup
					fullWidth={true}
					className={`${classes.buttonGroup} `}
					aria-label="outlined primary button group"
					size="small"
				>
					{navigation.map((navItem, index) => {
						// TODO: below is updated zeroth button to be current. This needs to come
						// from state in prod

						return (
							<Button
								className={`${
									navItem.name === current
										? clsx(classes.curveButton, classes.curveButtonCurrent)
										: classes.curveButton
								} largeBtn`}
								onClick={(e) => {
									onClick(navItem.name);
								}}
								key={index}
							>
								{navItem.label}
							</Button>
						);
					})}
				</ButtonGroup>
			</div>
		</>
	);
};

Navigation.propTypes = {
	/** is array of objects containing name of the nav and its dropdown menu if any */
	navigation: PropTypes.array.isRequired,

	//** this is the name of the nav current selected */
	current: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

Navigation.defaultProps = {
	onClick: () => {},
};

export default Navigation;
