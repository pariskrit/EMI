import React, { useState } from "react";
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

export const useStyles = makeStyles({
	main: {
		background: "#FFFFFF",
		marginBottom: 22,
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

	return (
		<div className={classes.main}>
			{taskLoading ? (
				<LinearProgress />
			) : (
				<>
					<Navigation
						current={current}
						navigation={[
							"Details",
							`${customCaptions?.intervalPlural} (${taskInfo?.intervalCount})`,
							`${customCaptions?.stagePlural} (${taskInfo?.stageCount})`,
							`${customCaptions?.zonePlural} (${taskInfo?.zoneCount})`,
							...(showParts
								? [`${customCaptions?.partPlural} (${taskInfo?.partCount})`]
								: []),
							`${customCaptions?.lubricant}`,
							`${customCaptions?.toolPlural} (${taskInfo?.toolCount})`,
							`Permits (${taskInfo?.permitCount})`,
							`${customCaptions?.workbook}`,
							`Images (${taskInfo?.imageCount})`,
							`${customCaptions?.questionPlural} (${taskInfo?.questionCount})`,
							`Attachments (${taskInfo?.documentCount})`,
						]}
						onClick={(d) => setCurrent(d)}
					/>
					<div className={classes.component}>
						{current === "Details" && (
							<Details taskInfo={taskInfo} access={access} />
						)}
						{current ===
							`${customCaptions?.intervalPlural} (${taskInfo?.intervalCount})` && (
							<Intervals taskId={taskInfo.id} access={access} />
						)}
						{current ===
							`${customCaptions?.stagePlural} (${taskInfo?.stageCount})` && (
							<Stages />
						)}
						{current ===
							`${customCaptions?.zonePlural} (${taskInfo?.zoneCount})` && (
							<Zones taskInfo={taskInfo} access={access} />
						)}
						{current ===
							`${customCaptions?.partPlural} (${taskInfo?.partCount})` && (
							<Parts taskInfo={taskInfo} access={access} />
						)}
						{current === `${customCaptions?.lubricant}` && (
							<Lubricant taskInfo={taskInfo} access={access} />
						)}
						{current ===
							`${customCaptions?.toolPlural} (${taskInfo?.toolCount})` && (
							<Tools />
						)}
						{current === `Permits (${taskInfo?.permitCount})` && <Permits />}
						{current === `${customCaptions?.workbook}` && <WorkBook />}
						{current === `Images (${taskInfo?.imageCount})` && <Images />}
						{current ===
							`${customCaptions?.questionPlural} (${taskInfo?.questionCount})` && (
							<Questions />
						)}
						{current === `Attachments (${taskInfo?.documentCount})` && (
							<Attachments />
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ModelTaskExpand;
