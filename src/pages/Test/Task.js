import React, { useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ImageIcon from "@mui/icons-material/Image";
import BuildIcon from "@mui/icons-material/Build";
import API from "helpers/api";

function Task() {
	const fetchData = async (modelVersionId) => {
		try {
			const response = await API.get(
				"/api/ModelVersionTasks?modelVersionId=" + modelVersionId
			);
		} catch (error) {
			return;
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
