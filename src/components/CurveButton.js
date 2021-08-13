import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "../helpers/colourConstants";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	curveButton: {
		borderRadius: 50,
		padding: "6px 26px",
		borderWidth: 1,
		borderColor: ColourConstants.navButtonOnHover,
		fontWeight: "bold",
		fontSize: "12px",
		fontFamily: "Roboto Condensed",
		letterSpacing: 0,
		backgroundColor: "#24BA78",
		float: "right",
		color: "white",
		textTransform: "none",
		"&:hover": { backgroundColor: "#D2D2D9" },
	},
}));
const CurveButton = ({ onClick, children, style }) => {
	const classes = useStyles();
	return (
		<Button onClick={onClick} className={classes.curveButton} style={style}>
			{children}
		</Button>
	);
};

export default CurveButton;

CurveButton.defaultProps = {
	style: {},
};

CurveButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	style: PropTypes.object,
};
