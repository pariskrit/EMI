import React, { useCallback, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { ModelContext } from "contexts/ModelDetailContext";
import {
	getModelDetails,
	getModelLists,
} from "services/models/modelDetails/details";
import PageNotFound from "components/Elements/PageNotFound";

function ModelDetails(props) {
	const [state, dispatch] = useContext(ModelContext);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const { siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const { id } = useParams();

	const fetchModelDetails = useCallback(async () => {
		const response = await Promise.all([
			getModelDetails(id),
			getModelLists(siteAppID),
		]);

		if (!response?.every((res) => res.status)) {
			setIsError(true);
		} else {
			dispatch({
				type: "SET_MODEL_DETAIL",
				payload: {
					detail: response[0].data,
					activeModelVersion:
						response[1].data.find(
							(model) => model?.activeModelVersionID === +id
						)?.activeModelVersion ?? null,
				},
			});
		}
		setIsLoading(false);
	}, [id, dispatch, siteAppID]);

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
