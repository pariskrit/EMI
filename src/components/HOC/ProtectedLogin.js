import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultRedirect } from "helpers/constants";

const ProtectedLogin = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const me =
			JSON.parse(sessionStorage.getItem("me")) ||
			JSON.parse(localStorage.getItem("me"));
		const isNavigatingFromFeedback =
			location.search.includes("siteAppId") &&
			location.search.includes("feedback");
		if (me && !isNavigatingFromFeedback) {
			const state = location.state || {};
			navigate(
				state?.from?.pathname
					? state.from.pathname
					: me.siteAppID
					? defaultRedirect[me.position.defaultPage]
					: "/app/me",
				{ state: { from: location } }
			);
		}
	}, [location, navigate]);

	return children;
};

export default ProtectedLogin;
