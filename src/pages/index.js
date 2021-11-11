import React, { useEffect } from "react";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";
import UsersPage from "pages/Users/Links/UsersPage";
import { Switch } from "react-router";
import { connect } from "react-redux";
import { getUserDetail } from "redux/auth/actions";

const MainApp = ({ isAuthenticated, fetchDetailUser }) => {
	useEffect(() => {
		if (!isAuthenticated) {
			fetchDetailUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);
	return (
		<NavbarWrapper>
			<ApplicationPage />
			<ClientPage />
			<SitePage />
			<SiteAppPage />
			<UsersPage />
		</NavbarWrapper>
	);
};
const mapStateToProps = ({ authData: { isAuthenticated } }) => ({
	isAuthenticated,
});
const mapDispatchToProps = (dispatch) => ({
	fetchDetailUser: () => dispatch(getUserDetail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
