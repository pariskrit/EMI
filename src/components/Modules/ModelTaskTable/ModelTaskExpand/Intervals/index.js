import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	checkSelected,
	unCheckSelected,
	getModelVersionTaskIntervals,
} from "services/models/modelDetails/modelTaskIntervals";
import IntervalTable from "./Table";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";

const Intervals = ({ taskId, access, isMounted }) => {
	const [intervals, setIntervals] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const dispatch = useDispatch();
	const [, CtxDispatch] = useContext(TaskContext);

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
			CtxDispatch({
				type: "TAB_COUNT",
				payload: {
					countTab: "intervalCount",
					data: intervals.filter((x) => Boolean(x.id)).length + 1,
				},
			});
			document
				.getElementById(`taskExpandable${taskId}`)
				.querySelector(`#dataCellintervals > div >p`).innerHTML = intervals
				.map((z) =>
					z.modelVersionIntervalID === intervalId ? { ...z, id: true } : z
				)
				.filter((x) => Boolean(x.id))
				.map((x) => x.name)
				.join(",");
		} else {
			response = await unCheckSelected(taskIntervalId);
			CtxDispatch({
				type: "TAB_COUNT",
				payload: {
					countTab: "intervalCount",
					data: intervals.filter((x) => Boolean(x.id)).length - 1,
				},
			});
			document
				.getElementById(`taskExpandable${taskId}`)
				.querySelector(`#dataCellintervals > div >p`).innerHTML = intervals
				.map((z) =>
					z.modelVersionIntervalID === intervalId ? { ...z, id: null } : z
				)
				.filter((x) => Boolean(x.id))
				.map((x) => x.name)
				.join(",");
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
