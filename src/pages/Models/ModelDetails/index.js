import { CircularProgress } from "@material-ui/core";
import { ModelContext } from "contexts/ModelDetailContext";
import React, { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getModelDetails } from "services/models/modelDetails/details";

function ModelDetails(props) {
	const [_, dispatch] = useContext(ModelContext);
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();

	const fetchModelDetails = useCallback(async () => {
		const response = await getModelDetails(id);
		dispatch({ type: "SET_MODEL_DETAIL", payload: response.data });
		setIsLoading(false);
	}, [id, dispatch]);

	useEffect(() => {
		fetchModelDetails();
	}, [fetchModelDetails]);

	if (isLoading) {
		return <CircularProgress />;
	}
	return <>{props.children}</>;
}

export default ModelDetails;
