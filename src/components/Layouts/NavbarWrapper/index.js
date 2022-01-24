import React, { useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./style.scss";
import Navbar from "components/Layouts/NavbarWrapper/Navbar";
import { CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
// import { useEffect } from "react";
import { loginWithSiteAppId } from "redux/common/actions";
import { logOutUser } from "redux/auth/actions";
import { authSlice } from "redux/auth/reducers";

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
function NavbarWrapper({
	isApplicationPortal,
	children,
	userLogOut,
	loading,
	loginSiteApp,
	setUserDetail,
	userDetail,
}) {
	// Init hooks
	const classes = useStyles();

	const siteAppId = localStorage.getItem("siteAppId");

	useLayoutEffect(() => {
		// Is called with clicking site application from Application Portal where siteAppId is set
		if (siteAppId) {
			loginSiteApp(siteAppId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppId]);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Navbar
				isApplicationPortal={isApplicationPortal}
				isLoading={loading}
				userLogOut={userLogOut}
				userDetail={userDetail}
				setUserDetail={setUserDetail}
			/>
			{!siteAppId && <main className={classes.content}>{children}</main>}
		</div>
	);
}

const mapStateToProps = (state) => ({
	loading: state.commonData.loading,
	userDetail: state.authData.userDetail,
});

const mapDispatchToProps = (dispatch) => ({
	userLogOut: () => dispatch(logOutUser()),
	loginSiteApp: (id) => dispatch(loginWithSiteAppId(id)),
	setUserDetail: (data) => dispatch(authSlice.actions.dataSuccess({ data })),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavbarWrapper);
