import React, { useState } from "react";
import API from "helpers/api";
import SubcatStyle from "styles/application/SubcatStyle";
import ColourConstants from "helpers/colourConstants";
import { makeStyles, TextField } from "@material-ui/core";

const AS = SubcatStyle();
const defaultInputSchema = {
	name: "",
	description: "",
	plannerGroup: "",
	workCenter: "",
};
const defaultErrorSchema = {
	name: null,
	description: null,
	plannerGroup: null,
	workCenter: null,
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		alignItems: "center",
		width: "100%",
		marginBottom: 10,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: ColourConstants.commonBorder,
		borderRadius: 5,
		paddingLeft: 10,
		paddingTop: 12,
		paddingBottom: 12,
	},
}));
const NewFunctionalLocations = ({ editData, setLoading }) => {
	const classes = useStyles();
	const [input, setInput] = useState(defaultInputSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	return (
		<div>
			<div className={classes.container}>
				<TextField fullWidth name="name" label="Name" />
			</div>
			<div className={classes.container}>
				<TextField fullWidth name="description" label="Description" />
			</div>
			<div className={classes.container}>
				<TextField fullWidth name="plannerGroup" label="Planner Group" />
			</div>
			<div className={classes.container}>
				<TextField fullWidth name="workCenter" label="Work Center" />
			</div>
		</div>
	);
};

export default NewFunctionalLocations;
