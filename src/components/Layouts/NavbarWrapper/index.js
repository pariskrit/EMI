import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./style.scss";
import Navbar from "components/Layouts/NavbarWrapper/Navbar";
import { CssBaseline } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

/* Adds Navbar component  */
function NavbarWrapper({ isApplicationPortal, children }) {
	// Init hooks
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Navbar isApplicationPortal={isApplicationPortal} />

			<main className={classes.content}>{children}</main>
		</div>
	);
}

export default NavbarWrapper;
