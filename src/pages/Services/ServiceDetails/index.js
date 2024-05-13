import React, { useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import PageNotFound from "components/Elements/PageNotFound";
import { getServiceDetails } from "services/services/serviceDetails/detail";
import { ServiceContext } from "contexts/ServiceDetailContext";
import TabTitle from "components/Elements/TabTitle";

function ServicesDetails(props) {
	const [state, dispatch] = useContext(ServiceContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const { application } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const { id } = useParams();

	const fetchServiceDetails = useCallback(async () => {
		const response = await getServiceDetails(id);
		if (!response?.status) {
			setIsError(true);
		} else {
			dispatch({ type: "SET_SERVICE_DETAIL", payload: response.data });
		}
		setIsLoading(false);
	}, [id, dispatch]);

	useEffect(() => {
		fetchServiceDetails();
	}, [fetchServiceDetails]);

	if (isLoading) {
		return <CircularProgress />;
	}

	if (isError) {
		return <PageNotFound message="Service Not Found" />;
	}
	return (
		<>
			<TabTitle
				title={`${state?.serviceDetail?.workOrder} | ${application.name}`}
			/>
			{props.children(state.serviceDetail)}
		</>
	);
}

export default ServicesDetails;
