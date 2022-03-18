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
import DetailsPanel from "components/Elements/DetailsPanel";

const Intervals = ({ taskId, access, isMounted }) => {
	const [intervals, setIntervals] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [isDisabled, setIsDisabled] = useState(false);
	const [selectedIntervalsCount, setSelectedIntervalsCount] = useState(0);
	const dispatch = useDispatch();
	const [, CtxDispatch] = useContext(TaskContext);
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const handleIntervalCheckbox = async (
		checked,
		intervalId,
		taskIntervalId
	) => {
		if (access === "R") {
			return;
		}
		const tempIntervals = [...intervals];

		let response = null;
		setIsDisabled(true);
		if (checked) {
			response = await checkSelected({
				modelVersionTaskID: taskId,
				modelVersionIntervalID: intervalId,
			});
			setIntervals([
				...tempIntervals.map((interval) =>
					interval.modelVersionIntervalID === intervalId
						? { ...interval, checked: checked, id: response.data }
						: interval
				),
			]);
			setSelectedIntervalsCount(
				intervals.filter((x) => Boolean(x.id)).length + 1
			);
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
			setIntervals([
				...tempIntervals.map((interval) =>
					interval.modelVersionIntervalID === intervalId
						? { ...interval, checked: checked, id: null }
						: interval
				),
			]);
			response = await unCheckSelected(taskIntervalId);

			setSelectedIntervalsCount(
				intervals.filter((x) => Boolean(x.id)).length - 1
			);
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

		setIsDisabled(false);
	};

	const fetchModelTaskIntervals = useCallback(async () => {
		if (intervals.length === 0) {
			const response = await getModelVersionTaskIntervals(taskId);
			if (response.status) {
				if (!isMounted.aborted) {
					setIntervals([
						...response.data.map((interval) => ({
							...interval,
							checked: !!interval.id,
						})),
					]);
					setSelectedIntervalsCount(
						response.data.filter((interval) => Boolean(interval.id)).length
					);
				}
			} else {
				dispatch(showError("Could not get intervals"));
			}

			if (!isMounted.aborted) setIsloading(false);
		}
	}, [taskId, isMounted, dispatch, intervals]);

	useEffect(() => {
		fetchModelTaskIntervals();
	}, [fetchModelTaskIntervals]);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<DetailsPanel
				header={me.customCaptions.intervalPlural}
				dataCount={selectedIntervalsCount}
			/>
			<IntervalTable
				data={intervals}
				loading={isLoading}
				handleIntervalCheckbox={handleIntervalCheckbox}
				isDisabled={isDisabled}
			/>
		</div>
	);
};

export default withMount(Intervals);
