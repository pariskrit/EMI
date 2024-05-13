import { Navigate } from "react-router-dom";
import React from "react";
import { useLocation } from "react-router-dom";
const ProtectedRoute = ({ component: Component, children, ...rest }) => {
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const { pathname, search } = useLocation();
	//case for redirectedUrl with siteAppId
	const isRedirectUrl = search?.includes("siteAppId");

	//me?.position to check siteApp authentication
	if ((me && !isRedirectUrl) || me?.position) return children;

	//redirect if not logged into a site
	if ((!me?.position && isRedirectUrl) || (!me && isRedirectUrl)) {
		return <Navigate to={`/login?redirectUrl=${pathname}${search}`} />;
	} else return <Navigate to="/login" />;
};

export default ProtectedRoute;
