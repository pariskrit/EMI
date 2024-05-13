import React, { createContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "components/Layouts/NavbarWrapper/Navbar";
import { connect } from "react-redux";
import { loginWithSiteAppId } from "redux/common/actions";
import { logOutUser } from "redux/auth/actions";
import { authSlice } from "redux/auth/reducers";
import roles from "helpers/roles";
const theme = createTheme();

export const NavbarStateContext = createContext({});

function NavbarWrapper({
	isApplicationPortal,
	children,
	userLogOut,
	loading,
	loginSiteApp,
	setUserDetail,
	userDetail,
}) {
	const siteAppId = localStorage.getItem("siteAppId");

	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [navDrawerState, setNavDrawerState] = React.useState(false);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div
				style={{
					display: "flex",
					backgroundColor: "#FAFAFA",
				}}
			>
				<Navbar
					isApplicationPortal={isApplicationPortal}
					isLoading={loading}
					userLogOut={userLogOut}
					userDetail={userDetail}
					setUserDetail={setUserDetail}
					setNavState={setNavDrawerState}
				/>
				{(!siteAppId || me?.role === roles.clientAdmin) && (
					<NavbarStateContext.Provider value={{ navBarState: navDrawerState }}>
						<main
							style={{
								flexGrow: 1,
								padding: theme.spacing(3),
							}}
						>
							{children}
						</main>
					</NavbarStateContext.Provider>
				)}
			</div>
		</ThemeProvider>
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
