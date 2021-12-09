import React, { useState } from "react";
import Navigation from "./Navigation";
import { makeStyles } from "@material-ui/core/styles";
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
	},
	component: { width: "95%", margin: "auto" },
});

const ModelTaskExpand = () => {
	const classes = useStyles();
	const [current, setCurrent] = useState("Details");
	return (
		<div className={classes.main}>
			<Navigation
				current={current}
				navigation={[
					"Details",
					"Intervals",
					"Stages",
					"Zones",
					"Parts",
					"Lubricant",
					"Tools",
					"Permits",
					"Workbook",
					"Images",
					"Questions",
					"Attachments",
				]}
				onClick={(d) => setCurrent(d)}
			/>
			<div className={classes.component}>
				{current === "Details" && <Details />}
				{current === "Intervals" && <Intervals />}
				{current === "Stages" && <Stages />}
				{current === "Zones" && <Zones />}
				{current === "Parts" && <Parts />}
				{current === "Lubricant" && <Lubricant />}
				{current === "Tools" && <Tools />}
				{current === "Permits" && <Permits />}
				{current === "Workbook" && <WorkBook />}
				{current === "Images" && <Images />}
				{current === "Questions" && <Questions />}
				{current === "Attachments" && <Attachments />}
			</div>
		</div>
	);
};

export default ModelTaskExpand;
