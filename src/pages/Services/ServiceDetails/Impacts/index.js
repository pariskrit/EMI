import { CircularProgress } from "@material-ui/core";
import AccordionBox from "components/Layouts/AccordionBox";
import { getLocalStorageData, isoDateWithoutTimeZone } from "helpers/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import {
	getMissingPartsTools,
	getPauses,
	getSkippedTasks,
	getStatusChanges,
	getStops,
} from "services/services/impacts";
import CommonTable from "./CommonTable";
import { dateDifference } from "helpers/utils";

const getAllData = (customCaptions) => [
	{
		id: 1,
		title: customCaptions?.pauseReasonPlural ?? "Pause Reasons",
		data: [],
		columns: [
			"userName",
			"startDate",
			"endDate",
			"pauseMinutes",
			"pauseReasonName",
			"otherReason",
		],
		headers: [
			"User",
			"Start Time",
			"End Time",
			"Total Duration",
			"Reason",
			"Other Reason",
		],
	},
	{
		id: 2,
		title: customCaptions?.stopReasonPlural ?? "Stop Reasons",
		data: [],
		columns: ["displayName", "endDate", "stopReason", "otherReason"],
		headers: ["User", "End Time", "Reason", "Other Reason"],
	},
	{
		id: 3,
		title: `Missing ${customCaptions?.partPlural ?? "Part"} And ${
			customCaptions?.toolPlural ?? "Tools"
		}`,
		data: [],
		columns: ["userName", "toolName", "quantity", "reasonName", "otherReason"],
		headers: [
			"User",
			`Name of the ${customCaptions?.part ?? "part"} / ${
				customCaptions?.tool ?? "tool"
			}`,
			"Quantity",
			"Reason",
			"Other Reason",
		],
	},
	{
		id: 4,
		title: `Skipped ${customCaptions?.taskPlural ?? "Tasks"}`,
		data: [],
		columns: ["stageName", "zoneName", "taskActionName", "skipReasonName"],
		headers: [
			customCaptions?.stage,
			customCaptions?.zone,
			customCaptions?.task,
			"Reason",
		],
	},
	{
		id: 5,
		title: "Status Changes",
		data: [],
		columns: ["createdDateTime", "userName", "status", "otherReason"],
		headers: ["Time", "User", "New Status", "Reason"],
	},
];

function Impacts() {
	const { id } = useParams();
	const { customCaptions } = getLocalStorageData("me");

	const [data, setData] = useState(getAllData(customCaptions));
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const fetchAllData = useCallback(async () => {
		const response = await Promise.all([
			getPauses(id),
			getStops(id),
			getMissingPartsTools(id),
			getSkippedTasks(id),
			getStatusChanges(id),
		]);

		if (response.some((res) => !res.status)) {
			const errorTileIndex = response.findIndex((res) => !res.status);
			dispatch(
				showError(
					response[errorTileIndex].data?.detail || "Could not fetch data"
				)
			);
		}
		const pause = response[0].data
			? response[0].data.map((pause) => ({
					...pause,
					pauseMinutes: dateDifference(pause.endDate, pause.startDate),
					startDate: isoDateWithoutTimeZone(pause.startDate + "Z"),
					endDate: isoDateWithoutTimeZone(pause.endDate + "Z"),
			  }))
			: [];
		const stop = response[1].data
			? response[1].data.map((stop) => ({
					...stop,

					endDate: isoDateWithoutTimeZone(stop.endDate + "Z"),
			  }))
			: [];

		const skippedTasks = response[3].data
			? response[3].data.map((skip) => ({
					...skip,
					taskActionName: `${skip?.actionName} ${skip?.taskName}`,
			  }))
			: [];
		setData((prev) =>
			prev.map((d, index) => ({
				...d,
				data:
					index === 0
						? pause
						: index === 1
						? stop
						: index === 3
						? skippedTasks
						: response[index].data,
			}))
		);
		setLoading(false);
	}, [dispatch, id]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div style={{ margin: "30px 0" }}>
			{data.map((element) => (
				<AccordionBox
					title={`${element.title} (${element.data?.length ?? 0})`}
					style={{ margin: "20px 0" }}
				>
					<CommonTable
						data={element.data}
						columns={element.columns}
						headers={element.headers}
					/>
				</AccordionBox>
			))}
		</div>
	);
}

export default Impacts;
