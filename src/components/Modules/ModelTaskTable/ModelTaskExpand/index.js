import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import Navigation from "./Navigation";
import Details from "./Details";
import Intervals from "./Intervals";
import Stages from "./Stages";
import Zones from "./Zones";
import Parts from "./Parts";
import Lubricant from "./Lubricant";
import Tools from "./Tools";
import Permits from "./Permits";
import WorkBook from "./WorkBook";
import Images from "./Images";
import Questions from "./Questions";
import Attachments from "./Attachments";
import { TaskContext } from "contexts/TaskDetailContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const useStyles = makeStyles({
	main: {
		background: "#FFFFFF",
		marginBottom: 22,
		paddingBottom: 12,
		display: "flex",
		flexDirection: "column",
		minHeight: "150px",
	},
	component: { width: "95%", margin: "auto" },
});

const ModelTaskExpand = ({ taskInfo, taskLoading, access, originalRow }) => {
	const history = useHistory();
	const classes = useStyles();
	const [current, setCurrent] = useState("Details");

	const {
		application: { showParts },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [TaskDetailState, taskDispatch] = useContext(TaskContext);
	const { taskInfo: TaskDetail } = TaskDetailState;

	useEffect(() => {
		const isTaskWithHighlightedQuestion =
			history.location.state?.modelVersionTaskID === taskInfo.id;
		if (
			isTaskWithHighlightedQuestion &&
			history.location.state?.modelVersionQuestionID &&
			!taskLoading
		)
			setCurrent("question");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskLoading]);

	useEffect(() => {
		if (!TaskDetail?.intervalCount || 0) {
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
		if (!TaskDetail?.stageCount || 0) {
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
			originalRow.stages.filter((x) => x.hasZones).length > 0 &&
			TaskDetail?.zoneCount === 0
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
	]);

	const currentTab = (currentTab) => {
		switch (currentTab) {
			case "Details":
				return <Details taskInfo={taskInfo} access={access} />;
			case "interval":
				return <Intervals taskInfo={taskInfo} access={access} />;
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
				return <WorkBook taskInfo={taskInfo} access={access} />;
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
						taskInfo={taskInfo}
						access={access}
					/>
				);

			case "attachment":
				return <Attachments taskInfo={taskInfo} access={access} />;

			default:
				return <Details taskInfo={taskInfo} access={access} />;
		}
	};

	return (
		<div className={classes.main}>
			{taskLoading ? (
				<LinearProgress />
			) : (
				<>
					<Navigation
						current={current}
						navigation={[
							{ label: "Details", name: "Details" },
							{
								label: `${customCaptions?.intervalPlural} (${
									TaskDetail?.intervalCount || 0
								})`,
								name: "interval",
								hasError: !TaskDetail?.intervalCount || 0 ? true : false,
								errorMessage: `No ${customCaptions?.intervalPlural} Assigned`,
							},
							{
								label: `${customCaptions?.stagePlural} (${
									TaskDetail?.stageCount || 0
								})`,
								name: "stage",
								hasError: !TaskDetail?.stageCount || 0 ? true : false,
								errorMessage: `No ${customCaptions?.stagePlural} Assigned`,
							},
							{
								label: `${customCaptions?.zonePlural} (${
									TaskDetail?.zoneCount || 0
								})`,
								name: "zone",
								hasError:
									originalRow.stages.filter((x) => x.hasZones).length > 0 &&
									TaskDetail?.zoneCount === 0
										? true
										: false,
								errorMessage: `No ${customCaptions?.zonePlural} Assigned`,
							},
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
							{ label: `${customCaptions?.lubricant}`, name: "lubricant" },
							{
								label: `${customCaptions?.toolPlural} (${
									TaskDetail?.toolCount || 0
								})`,
								name: "tool",
							},
							{
								label: `Permits (${TaskDetail?.permitCount || 0})`,
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
						]}
						onClick={(d) => setCurrent(d)}
					/>
					<div className={classes.component}>{currentTab(current)}</div>
				</>
			)}
		</div>
	);
};

export default ModelTaskExpand;
