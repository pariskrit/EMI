import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import {
	checkSelected,
	unCheckSelected,
	getModelVersionTaskIntervals,
} from "services/models/modelDetails/modelTaskIntervals";
import IntervalTable from "./Table";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import withMount from "components/HOC/withMount";

const Intervals = ({ taskId, access, isMounted }) => {
	const [intervals, setIntervals] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const dispatch = useDispatch();

	const handleIntervalCheckbox = async (
		checked,
		intervalId,
		taskIntervalId
	) => {
		if (access === "R") {
			return;
		}
		const tempIntervals = [...intervals];
		setIntervals([
			...tempIntervals.map((interval) =>
				interval.modelVersionIntervalID === intervalId
					? { ...interval, checked: checked }
					: interval
			),
		]);

		let response = null;

		if (checked) {
			response = await checkSelected({
				modelVersionTaskID: taskId,
				modelVersionIntervalID: intervalId,
			});
		} else {
			response = await unCheckSelected(taskIntervalId);
		}

		if (!response.status) {
			setIntervals(tempIntervals);
			dispatch(showError("Could not update"));
		}
	};

	const fetchModelTaskIntervals = useCallback(async () => {
		const response = await getModelVersionTaskIntervals(taskId);
		if (response.status) {
			if (!isMounted.aborted) {
				setIntervals([
					...response.data.map((interval) => ({
						...interval,
						checked: !!interval.id,
					})),
				]);
			}
		} else {
			dispatch(showError("Could not get intervals"));
		}

		if (!isMounted.aborted) setIsloading(false);
	}, [taskId, isMounted, dispatch]);

	useEffect(() => {
		fetchModelTaskIntervals();
	}, [fetchModelTaskIntervals]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<IntervalTable
				data={intervals}
				loading={isLoading}
				handleIntervalCheckbox={handleIntervalCheckbox}
			/>
		</div>
	);
};

export default withMount(Intervals);
