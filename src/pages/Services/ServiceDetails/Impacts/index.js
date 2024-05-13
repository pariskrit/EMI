import { CircularProgress } from "@mui/material";
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
import { serviceStatus } from "constants/serviceDetails";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import updateStorage from "helpers/updateStorage";

const getAllData = (customCaptions, application) => [
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
		title: `Missing ${
			application.showParts
				? `${customCaptions?.partPlural ?? "Parts"} And `
				: ""
		} ${customCaptions?.toolPlural ?? "Tools"}`,
		data: [],
		columns: ["userName", "partOrTool", "reasonName", "otherReason"],
		headers: [
			"User",
			`${customCaptions?.part ?? "part"} / ${customCaptions?.tool ?? "tool"}`,
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
		columns: [
			"createdDateTime",
			"userName",
			"status",
			"changeStatusReasonName",
		],
		headers: ["Time", "User", "New Status", "Reason"],
	},
];

function Impacts() {
	const { id } = useParams();
	const { application, customCaptions, siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const [data, setData] = useState(getAllData(customCaptions, application));
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const [siteAppState, setSiteAppState] = useState({ application });
	const reduxDispatch = useDispatch();

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			setSiteAppState(result?.data);
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		}
	};
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
					response?.[errorTileIndex].data?.detail || "Could not fetch data"
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
		const missingPartTool = response[2].data
			? response[2].data.map((part) => ({
					...part,
					partOrTool: (part.partName || part.toolName) ?? "",
			  }))
			: [];

		const skippedTasks = response[3].data
			? response[3].data.map((skip) => ({
					...skip,
					taskActionName: `${skip?.actionName} ${skip?.taskName}`,
			  }))
			: [];

		const status = response[4].data
			? response[4].data.map((status) => ({
					...status,
					createdDateTime: isoDateWithoutTimeZone(status.createdDateTime + "Z"),
					status: serviceStatus[status.status],
			  }))
			: [];

		setData((prev) => [
			{ ...prev[0], data: pause },
			{ ...prev[1], data: stop },
			{ ...prev[2], data: missingPartTool },
			{ ...prev[3], data: skippedTasks },
			{ ...prev[4], data: status },
		]);
		setLoading(false);
	}, [dispatch, id]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	useEffect(() => {
		fetchSiteApplicationDetails();
		if (siteAppID) updateStorage(siteAppID);
	}, []);
	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div style={{ margin: "30px 0" }}>
			{data.map((element) => (
				<AccordionBox
					key={element.id}
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
