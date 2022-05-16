import React, { useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { ModelContext } from "contexts/ModelDetailContext";
import { getModelDetails } from "services/models/modelDetails/details";
import PageNotFound from "components/Elements/PageNotFound";

function ModelDetails(props) {
	const [state, dispatch] = useContext(ModelContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const { id } = useParams();

	const fetchModelDetails = useCallback(async () => {
		const response = await getModelDetails(id);
		if (!response?.status) {
			setIsError(true);
		} else {
			dispatch({ type: "SET_MODEL_DETAIL", payload: response.data });
		}
		setIsLoading(false);
	}, [id, dispatch]);

	useEffect(() => {
		fetchModelDetails();

		if (JSON.parse(localStorage.getItem("serviceLayoutData"))?.modelId !== id)
			localStorage.removeItem("serviceLayoutData");
	}, [fetchModelDetails, id]);

	if (isLoading) {
		return <CircularProgress />;
	}

	if (isError) {
		return <PageNotFound message="Model Not Found" />;
	}
	return <>{props.children(state.modelDetail)}</>;
}

export default ModelDetails;
