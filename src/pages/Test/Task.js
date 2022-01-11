import React, { useEffect } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ImageIcon from "@material-ui/icons/Image";
import BuildIcon from "@material-ui/icons/Build";
import API from "helpers/api";

function Task() {
	const fetchData = async (modelVersionId) => {
		try {
			const response = await API.get(
				"/api/ModelVersionTasks?modelVersionId=" + modelVersionId
			);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchData(38);
	}, []);
	return (
		<div>
			<h2>Tasks(266)</h2>
			<p>Task assigned to this assest model.</p>
			{/*  */}
		</div>
	);
}

export default Task;
