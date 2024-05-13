import { CircularProgress } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ArrangementTable from "./Table";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import DetailsPanel from "components/Elements/DetailsPanel";
import { ModelContext } from "contexts/ModelDetailContext";
import {
	getModelVersionTaskArrangements,
	checkSelected,
	unCheckSelected,
} from "services/models/modelDetails/modelTaskArrangements";

const Arrangements = ({ taskInfo, access, isMounted }) => {
	const [arrangements, setArrangements] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [isDisabled, setIsDisabled] = useState(false);
	const [selectedArrangementsCount, setSelectedArrangementsCount] = useState(0);
	const dispatch = useDispatch();
	const [taskDetails, CtxDispatch] = useContext(TaskContext);
	const [state] = useContext(ModelContext);
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const handleArrangementCheckbox = async (
		checked,
		arrangementId,
		taskArrangementId
	) => {
		if (state?.modelDetail?.isPublished) {
			return;
		}

		const tempArrangements = [...arrangements];

		let response = null;
		setIsDisabled(true);
		if (checked) {
			response = await checkSelected({
				modelVersionTaskID: taskInfo.id,
				modelVersionArrangementID: arrangementId,
			});
			setArrangements([
				...tempArrangements.map((arrangement) =>
					arrangement.modelVersionArrangementID === arrangementId
						? { ...arrangement, checked, id: response.data }
						: arrangement
				),
			]);

			setArrangements((prev) =>
				prev.map((arrangement) =>
					arrangement.modelVersionArrangementID === arrangementId
						? { ...arrangement, checked, id: response.data }
						: arrangement
				)
			);
		} else {
			setArrangements([
				...tempArrangements.map((arrangement) =>
					arrangement.modelVersionArrangementID === arrangementId
						? { ...arrangement, checked, id: null }
						: arrangement
				),
			]);
			response = await unCheckSelected(taskArrangementId);
		}

		if (!response.status) {
			setArrangements(tempArrangements);
			dispatch(showError(response?.data || "Could not update"));
		} else {
			const filteredArrangements = arrangements.filter(
				(x) => x?.checked === true
			).length;
			const counts = checked
				? filteredArrangements + 1
				: filteredArrangements - 1;
			setSelectedArrangementsCount(counts);

			await fetchModelTaskArrangements();
		}
		setIsDisabled(false);
	};

	const fetchModelTaskArrangements = useCallback(async () => {
		const response = await getModelVersionTaskArrangements(taskInfo.id);

		if (response.status) {
			if (!isMounted.aborted) {
				setArrangements([
					...response.data.map((arrangement) => ({
						...arrangement,
						checked: !!arrangement.id,
					})),
				]);
				setSelectedArrangementsCount(
					response.data.filter((arrangement) => Boolean(arrangement.id)).length
				);
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "arrangementCount",
						data: response.data.filter((arrangement) => Boolean(arrangement.id))
							.length,
					},
				});
			}
		} else {
			dispatch(showError("Could not get arrangements"));
		}
		if (!isMounted.aborted) setIsloading(false);
	}, [taskInfo.id, isMounted.aborted, dispatch, CtxDispatch]);

	useEffect(() => {
		fetchModelTaskArrangements();
	}, [fetchModelTaskArrangements]);

	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<DetailsPanel
					header={me.customCaptions.arrangementPlural}
					dataCount={selectedArrangementsCount}
				/>
			</div>

			<ArrangementTable
				data={arrangements}
				loading={isLoading}
				handleArrangementCheckbox={handleArrangementCheckbox}
				isDisabled={isDisabled}
			/>
		</div>
	);
};

export default withMount(Arrangements);
