import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { LinearProgress } from "@mui/material";
import Navigation from "./Navigation";
import Details from "./Details";
import Intervals from "./Intervals";
import Attachments from "./Attachments";
import Stages from "./Stages";
import Zones from "./Zones";
import Parts from "./Parts";
import Lubricant from "./Lubricant";
import Tools from "./Tools";
import Permits from "./Permits";
import WorkBook from "./WorkBook";
import Images from "./Images";
import Questions from "./Questions";
import { TaskContext } from "contexts/TaskDetailContext";
import { useLocation } from "react-router-dom";
import Arrangements from "./Arrangements";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

export const useStyles = makeStyles()((theme) => ({
	main: {
		background: "#FFFFFF",
		marginBottom: 22,
		paddingBottom: 12,
		display: "flex",
		flexDirection: "column",
		minHeight: "150px",
	},
	component: { width: "95%", margin: "auto" },
}));

const ModelTaskExpand = ({
	state,
	taskInfo,
	taskLoading,
	access,
	originalRow,
	setTaskInfo,
}) => {
	const location = useLocation();
	const { classes } = useStyles();
	const [current, setCurrent] = useState("Details");
	const [siteAppState, setSiteAppState] = useState(null);
	const {
		application: { showParts, showArrangements, showLubricants },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [TaskDetailState, taskDispatch] = useContext(TaskContext);

	const { taskInfo: TaskDetail, stageList } = TaskDetailState;

	//current site id
	const { siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	//to get the state of current application--applicatioin.showLubricants and so on.
	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(siteAppID);
		setSiteAppState(result);
	};

	useEffect(() => {
		fetchSiteApplicationDetails();

		const isTaskWithHighlightedQuestion =
			location.state?.modelVersionTaskID === taskInfo.id;
		if (
			isTaskWithHighlightedQuestion &&
			location.state?.modelVersionQuestionID &&
			!taskLoading
		)
			setCurrent("question");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskLoading]);

	useEffect(() => {
		if (TaskDetail?.intervalCount === 0 || 0) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: `No ${customCaptions?.intervalPlural} Assigned`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: "",
				},
			});
		}
		if (TaskDetail?.stageCount === 0 || 0) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: `No ${customCaptions?.stagePlural} Assigned`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: "",
				},
			});
		}
		if (
			stageList.filter((x) => x.hasZones && x.id !== null)?.length > 0 &&
			TaskDetail?.zoneCount === 0 &&
			TaskDetail?.stageCount !== 0
		) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: `No ${customCaptions?.zonePlural} Assigned`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: "",
				},
			});
		}
		if (
			TaskDetail?.roles === null ||
			TaskDetail?.roles?.filter((r) => r.id !== null).length === 0
		) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: `No ${customCaptions?.rolePlural} Assigned`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: "",
				},
			});
		}
		if (+TaskDetail.estimatedMinutes <= 0) {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: `Invalid Estimated Minutes`,
				},
			});
		} else {
			taskDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: "",
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		TaskDetail.intervalCount,
		taskDispatch,
		customCaptions.intervalPlural,
		customCaptions.stagePlural,
		TaskDetail.stageCount,
		TaskDetail.zoneCount,
		TaskDetail.estimatedMinutes,
		TaskDetail.roles,
		originalRow.stages,
		stageList,
	]);

	const currentTab = (currentTab) => {
		switch (currentTab) {
			case "Details":
				return (
					<Details
						state={siteAppState}
						taskInfo={taskInfo}
						access={access}
						setTaskInfo={setTaskInfo}
					/>
				);
			case "interval":
				return <Intervals taskInfo={taskInfo} access={access} />;
			case "arrangement":
				return <Arrangements taskInfo={taskInfo} access={access} />;
			case "stage":
				return <Stages taskInfo={taskInfo} access={access} />;
			case "zone":
				return <Zones taskInfo={taskInfo} access={access} />;
			case "part":
				return <Parts taskInfo={taskInfo} access={access} />;
			case "lubricant":
				return <Lubricant taskInfo={taskInfo} access={access} />;
			case "tool":
				return <Tools taskInfo={taskInfo} access={access} />;
			case "permit":
				return <Permits taskInfo={taskInfo} access={access} />;
			case "workbook":
				return (
					<WorkBook
						taskInfo={taskInfo}
						access={access}
						setTaskInfo={setTaskInfo}
					/>
				);
			case "images":
				return <Images taskInfo={taskInfo} access={access} />;
			case "question":
				return (
					<Questions
						captions={{
							plural: customCaptions?.questionPlural,
							singular: customCaptions?.question,
							taskCaption: customCaptions?.task,
						}}
						service={customCaptions?.service}
						taskInfo={taskInfo}
						access={access}
					/>
				);

			case "attachment":
				return <Attachments taskInfo={taskInfo} access={access} />;

			default:
				return (
					<Details
						siteAppState={siteAppState}
						taskInfo={taskInfo}
						access={access}
						setTaskInfo={setTaskInfo}
					/>
				);
		}
	};

	//to show table-details only if the state is true for certain table-Header

	const modalNavigationData = [
		{ label: "Details", name: "Details" },
		{
			label: `${customCaptions?.intervalPlural} (${
				TaskDetail?.intervalCount || 0
			})`,
			name: "interval",
			hasError: TaskDetail?.intervalCount === 0 || 0 ? true : false,
			errorMessage: `No ${customCaptions?.intervalPlural} Assigned`,
		},
		...(showArrangements && state?.modelDetail?.arrangementCount > 0
			? [
					{
						label: `${customCaptions?.arrangementPlural} (${
							TaskDetail?.arrangementCount || 0
						})`,
						name: "arrangement",
					},
			  ]
			: []),
		{
			label: `${customCaptions?.stagePlural} (${TaskDetail?.stageCount || 0})`,
			name: "stage",
			hasError: TaskDetail?.stageCount === 0 || 0 ? true : false,
			errorMessage: `No ${customCaptions?.stagePlural} Assigned`,
		},
		{
			label: `${customCaptions?.zonePlural} (${TaskDetail?.zoneCount || 0})`,
			name: "zone",
			hasError:
				stageList.filter((x) => x.hasZones && x.id !== null)?.length > 0 &&
				TaskDetail?.zoneCount === 0 &&
				TaskDetail?.stageCount !== 0
					? true
					: false,
			errorMessage: `No ${customCaptions?.zonePlural} Assigned`,
		},
		...(showLubricants
			? [
					{
						label: `${customCaptions?.lubricant}`,
						name: "lubricant",
					},
			  ]
			: []),
		...(showParts
			? [
					{
						label: `${customCaptions?.partPlural} (${
							TaskDetail?.partCount || 0
						})`,
						name: "part",
					},
			  ]
			: []),

		{
			label: `${customCaptions?.toolPlural} (${TaskDetail?.toolCount || 0})`,
			name: "tool",
		},
		{
			label: `${customCaptions?.permitPlural}  (${
				TaskDetail?.permitCount || 0
			})`,
			name: "permit",
		},
		{ label: `${customCaptions?.workbook}`, name: "workbook" },
		{
			label: `Images (${TaskDetail?.imageCount || 0})`,
			name: "images",
		},
		{
			label: `${customCaptions?.questionPlural} (${
				TaskDetail?.questionCount || 0
			})`,
			name: "question",
		},
		{
			label: `Attachments (${TaskDetail?.documentCount || 0})`,
			name: "attachment",
		},
	];

	return (
		<div className={classes.main}>
			{taskLoading ? (
				<LinearProgress />
			) : (
				<div className="task-expand-table">
					<Navigation
						current={current}
						navigation={modalNavigationData}
						onClick={(d) => setCurrent(d)}
					/>
					<div className={classes.component}>{currentTab(current)}</div>
				</div>
			)}
		</div>
	);
};

export default ModelTaskExpand;
