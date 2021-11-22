import React from "react";
import { Redirect, Switch } from "react-router";
// import { connect } from "react-redux";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";
import UsersPage from "pages/Users/Links/UsersPage";
// import { getUserDetail } from "redux/auth/actions";
import ApplicationPortal from "./ApplicationPortal";
import { applicationPortalPath } from "helpers/routePaths";

const MainApp = ({ location }) => {
	// useEffect(() => {
	// 	if (!isAuthenticated) {
	// 		fetchDetailUser();
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isAuthenticated]);
	if (!location.pathname.split("/").includes("app")) {
		return <Redirect to="/login" />;
	}

	return (
		<Switch>
			<NavbarWrapper
				isApplicationPortal={location.pathname === applicationPortalPath}
			>
				<ApplicationPortal />
				<ApplicationPage />
				<ClientPage />
				<SitePage />
				<SiteAppPage />
				<UsersPage />
			</NavbarWrapper>
		</Switch>
	);
};
// const mapStateToProps = ({ authData: { isAuthenticated } }) => ({
// 	isAuthenticated,
// });
// const mapDispatchToProps = (dispatch) => ({
// 	fetchDetailUser: () => dispatch(getUserDetail()),
// });

export default MainApp;
