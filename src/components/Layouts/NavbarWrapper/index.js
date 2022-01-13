import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./style.scss";
import Navbar from "components/Layouts/NavbarWrapper/Navbar";
import { CssBaseline } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginWithSiteAppId } from "redux/common/actions";

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
	const loading = useSelector((state) => state.commonData.loading);
	const dispatch = useDispatch();
	const siteAppId = localStorage.getItem("siteAppId");

	useEffect(() => {
		// Is called with clicking site application from Application Portal where siteAppId is set
		if (siteAppId) {
			dispatch(loginWithSiteAppId(siteAppId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppId]);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Navbar isApplicationPortal={isApplicationPortal} isLoading={loading} />
			{!siteAppId && <main className={classes.content}>{children}</main>}
		</div>
	);
}

export default NavbarWrapper;
