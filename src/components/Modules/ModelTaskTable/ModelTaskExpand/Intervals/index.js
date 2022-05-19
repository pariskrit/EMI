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
import { ModelContext } from "contexts/ModelDetailContext";
import EMICheckbox from "components/Elements/EMICheckbox";
import { patchModelTask } from "services/models/modelDetails/modelTasks";

const Intervals = ({ taskInfo, access, isMounted }) => {
	const [intervals, setIntervals] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [isDisabled, setIsDisabled] = useState(false);
	const [selectedIntervalsCount, setSelectedIntervalsCount] = useState(0);
	const dispatch = useDispatch();
	const [taskDetails, CtxDispatch] = useContext(TaskContext);
	const [state] = useContext(ModelContext);
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const handleIntervalCheckbox = async (
		checked,
		intervalId,
		taskIntervalId
	) => {
		if (access === "R" || state?.modelDetail?.isPublished) {
			return;
		}

		if (
			checked &&
			!taskDetails?.taskInfo?.customIntervals &&
			intervals.some((interval) => interval.checked)
		)
			return;

		const tempIntervals = [...intervals];

		let response = null;
		setIsDisabled(true);
		if (checked) {
			response = await checkSelected({
				modelVersionTaskID: taskInfo.id,
				modelVersionIntervalID: intervalId,
			});
			setIntervals([
				...tempIntervals.map((interval) =>
					interval.modelVersionIntervalID === intervalId
						? { ...interval, checked, id: response.data }
						: interval
				),
			]);
		} else {
			setIntervals([
				...tempIntervals.map((interval) =>
					interval.modelVersionIntervalID === intervalId
						? { ...interval, checked, id: null }
						: interval
				),
			]);
			response = await unCheckSelected(taskIntervalId);
		}

		if (!response.status) {
			setIntervals(tempIntervals);
			dispatch(showError(response.data || "Could not update"));
		} else {
			const filteredIntervals = intervals.filter((x) => Boolean(x.id)).length;
			const counts = checked ? filteredIntervals + 1 : filteredIntervals - 1;
			setSelectedIntervalsCount(counts);
			document
				.getElementById(`taskExpandable${taskInfo.id}`)
				.querySelector(`#dataCellintervals > div >p`).innerHTML = intervals
				.map((z) =>
					z.modelVersionIntervalID === intervalId
						? { ...z, id: checked ? true : null }
						: z
				)
				.filter((x) => Boolean(x.id))
				.map((x) => x.name)
				.join(",");
			await fetchModelTaskIntervals();
		}
		setIsDisabled(false);
	};

	const fetchModelTaskIntervals = useCallback(async () => {
		const response = await getModelVersionTaskIntervals(taskInfo.id);

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
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "intervalCount",
						data: response.data.filter((interval) => Boolean(interval.id))
							.length,
					},
				});
			}
		} else {
			dispatch(showError("Could not get intervals"));
		}
		if (!isMounted.aborted) setIsloading(false);
	}, [taskInfo.id, isMounted.aborted, dispatch, CtxDispatch]);

	const onCustomCheckboxInputChange = async () => {
		CtxDispatch({ type: "TOGGLE_CUSTOM_INTERVALS" });
		setIsDisabled(true);
		const res = await patchModelTask(taskInfo.id, [
			{
				path: "customIntervals",
				op: "replace",
				value: !taskInfo.customIntervals,
			},
		]);
		if (!res.status) CtxDispatch({ type: "TOGGLE_CUSTOM_INTERVALS" });

		setIsDisabled(false);
	};

	useEffect(() => {
		fetchModelTaskIntervals();
	}, [fetchModelTaskIntervals]);

	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<DetailsPanel
					header={me.customCaptions.intervalPlural}
					dataCount={selectedIntervalsCount}
				/>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "50%",
						justifyContent: "end",
					}}
				>
					<EMICheckbox
						state={taskDetails?.taskInfo?.customIntervals}
						changeHandler={onCustomCheckboxInputChange}
						disabled={isDisabled}
					/>
					<p>
						This {me?.customCaptions?.task} has Custom{" "}
						{me?.customCaptions?.intervalPlural}
					</p>
				</div>
			</div>

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
