import React, { useContext, useState } from "react";
import Navigation from "./Navigation";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

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

export const useStyles = makeStyles({
	main: {
		background: "#FFFFFF",
		marginBottom: 22,
		paddingBottom: 12,
		display: "flex",
		flexDirection: "column",
		minHeight: "600px",
	},
	component: { width: "95%", margin: "auto" },
});

const ModelTaskExpand = ({ taskInfo, taskLoading, access }) => {
	const classes = useStyles();
	const [current, setCurrent] = useState("Details");

	const {
		application: { showParts },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [TaskDetailState] = useContext(TaskContext);
	const { taskInfo: TaskDetail } = TaskDetailState;

	const currentTab = (currentTab) => {
		switch (currentTab) {
			case "Details":
				return <Details taskInfo={taskInfo} access={access} />;
			case "interval":
				return <Intervals taskId={taskInfo.id} access={access} />;
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
							},
							{
								label: `${customCaptions?.stagePlural} (${
									TaskDetail?.stageCount || 0
								})`,
								name: "stage",
							},
							{
								label: `${customCaptions?.zonePlural} (${
									TaskDetail?.zoneCount || 0
								})`,
								name: "zone",
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
