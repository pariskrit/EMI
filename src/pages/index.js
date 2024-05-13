import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavbarWrapper from "components/Layouts/NavbarWrapper";

const MainApp = () => {
	const location = useLocation();

	if (!location.pathname.split("/").includes("app")) {
		return <Navigate to="/login" />;
	}
	return (
		<NavbarWrapper isApplicationPortal={location.pathname === "/app/portal"}>
			<Outlet />
		</NavbarWrapper>
	);
};

export default MainApp;
