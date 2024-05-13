import ServiceReport from "pages/Services/ServiceDetails/ServiceReport";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function Index() {
	const { id } = useParams();

	const { customCaptions } = JSON.parse(localStorage.getItem("me"));
	const state =
		JSON.parse(sessionStorage.getItem("state")) ||
		JSON.parse(localStorage.getItem("state"));

	useEffect(() => {
		if (!sessionStorage.getItem("state")) {
			sessionStorage.setItem("state", localStorage.getItem("state"));
		}
		window.onbeforeunload = () => {
			localStorage.removeItem("state");
		};
	}, []);

	return (
		<ServiceReport
			serviceId={id}
			customCaptions={customCaptions}
			state={state}
			isPrint
		/>
	);
}

export default Index;
