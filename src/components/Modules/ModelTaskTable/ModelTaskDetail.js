import React, { useState } from "react";
import Navigation from "./Navigation";
import { useStyles } from "./styles";

const ModelTaskDetail = () => {
	const classes = useStyles();
	const [current, setCurrent] = useState("Details");
	return (
		<div className={classes.main}>
			<Navigation
				current={current}
				navigation={["Details", "Intervals"]}
				onClick={(d) => setCurrent(d)}
			/>
		</div>
	);
};

export default ModelTaskDetail;
