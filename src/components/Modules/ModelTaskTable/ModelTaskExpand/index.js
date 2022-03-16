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
		minHeight: "150px",
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
								label: `${customCaptions?.intervalPlural} (${TaskDetail?.intervalCount})`,
								name: "interval",
							},
							{
								label: `${customCaptions?.stagePlural} (${TaskDetail?.stageCount})`,
								name: "stage",
							},
							{
								label: `${customCaptions?.zonePlural} (${TaskDetail?.zoneCount})`,
								name: "zone",
							},
							...(showParts
								? [
										{
											label: `${customCaptions?.partPlural} (${TaskDetail?.partCount})`,
											name: "part",
										},
								  ]
								: []),
							{ label: `${customCaptions?.lubricant}`, name: "lubricant" },
							{
								label: `${customCaptions?.toolPlural} (${TaskDetail?.toolCount})`,
								name: "tool",
							},
							{ label: `Permits (${TaskDetail?.permitCount})`, name: "permit" },
							{ label: `${customCaptions?.workbook}`, name: "workbook" },
							{ label: `Images (${TaskDetail?.imageCount})`, name: "images" },
							{
								label: `${customCaptions?.questionPlural} (${TaskDetail?.questionCount})`,
								name: "question",
							},
							{
								label: `Attachments (${TaskDetail?.documentCount})`,
								name: "attachment",
							},
						]}
						onClick={(d) => setCurrent(d)}
					/>
					<div className={classes.component}>
						{current === "Details" && (
							<Details taskInfo={taskInfo} access={access} />
						)}
						{current === `interval` && (
							<Intervals taskId={taskInfo.id} access={access} />
						)}
						{current === `stage` && <Stages taskInfo={taskInfo} />}
						{current === `zone` && (
							<Zones taskInfo={taskInfo} access={access} />
						)}
						{current === `part` && (
							<Parts taskInfo={taskInfo} access={access} />
						)}
						{current === `lubricant` && (
							<Lubricant taskInfo={taskInfo} access={access} />
						)}
						{current === `tool` && (
							<Tools taskInfo={taskInfo} access={access} />
						)}
						{current === `permit` && (
							<Permits taskInfo={taskInfo} access={access} />
						)}
						{current === `workbook` && (
							<WorkBook taskInfo={taskInfo} access={access} />
						)}
						{current === `images` && <Images taskInfo={taskInfo} />}
						{current === `question` && (
							<Questions
								captions={{
									plural: customCaptions?.questionPlural,
									singular: customCaptions?.question,
								}}
								taskInfo={taskInfo}
								access={access}
							/>
						)}
						{current === `attachment` && (
							<Attachments taskInfo={taskInfo} access={access} />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ModelTaskExpand;
