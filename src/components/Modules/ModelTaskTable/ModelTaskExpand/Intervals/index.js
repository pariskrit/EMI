import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import {
	checkSelected,
	unCheckSelected,
	getModelVersionTaskIntervals,
} from "services/models/modelDetails/modelTaskIntervals";
import IntervalTable from "./Table";

const Intervals = ({ taskId, access }) => {
	const [intervals, setIntervals] = useState([]);
	const [isLoading, setIsloading] = useState(true);

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
			console.log("error");
		}
	};

	const fetchModelTaskIntervals = useCallback(async () => {
		const response = await getModelVersionTaskIntervals(taskId);

		if (response.status) {
			setIntervals([
				...response.data.map((interval) => ({
					...interval,
					checked: !!interval.id,
				})),
			]);
		}

		setIsloading(false);
	}, [taskId]);

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

export default Intervals;
