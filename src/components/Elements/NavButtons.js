import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MenuDropdown from "./MenuDropdown";
import ColourConstants from "helpers/colourConstants";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	buttonGroup: {
		width: "99.5%",
	},
	curveButton: {
		borderRadius: 50,
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

const NavButtons = ({ navigation, applicationName, current, onClick }) => {
	// Init hooks
	const classes = useStyles();

	// Init State
	const [selectedButton, setSelectedButton] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<div className={`${classes.root} buttonGroup`}>
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
							onMouseEnter={(e) => {
								setAnchorEl(e.currentTarget);
								setSelectedButton(index);
							}}
							onMouseLeave={() => {
								setAnchorEl(null);
								setSelectedButton(null);
							}}
							onClick={() => onClick(navItem.url)}
							key={index}
						>
							{navItem.name}
							{navItem?.dropdown?.length > 0 && (
								<MenuDropdown
									index={index}
									selectedButton={selectedButton}
									anchorEl={anchorEl}
									content={navItem.dropdown}
									applicationName={applicationName}
								/>
							)}
						</Button>
					);
				})}
			</ButtonGroup>
		</div>
	);
};

NavButtons.propTypes = {
	/** is array of objects containing name of the nav and its dropdown menu if any */
	navigation: PropTypes.array.isRequired,

	/** the current name of the application or site*/
	applicationName: PropTypes.string,

	//** this is the name of the nav current selected */
	current: PropTypes.string.isRequired,
};

NavButtons.defaultProps = {
	onClick: () => {},
};

export default NavButtons;