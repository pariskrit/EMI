import React, { useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import PageNotFound from "components/Elements/PageNotFound";
import { getServiceDetails } from "services/services/serviceDetails/detail";
import { ServiceContext } from "contexts/ServiceDetailContext";

function ServicesDetails(props) {
	const [state, dispatch] = useContext(ServiceContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

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
	return <>{props.children(state.serviceDetail)}</>;
}

export default ServicesDetails;
