import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ModelWrapper from "../commonModelHeader";
import AddNewModelTask from "./AddNewModelTask";
import Task from "./Task";
import { modelScreenNavigation } from "helpers/constants";
import { modelsPath } from "helpers/routePaths";

function ModelTasks() {
	const [openAddNewModal, setOpenAddNewModal] = useState(false);
	const history = useHistory();

	const { position } = JSON.parse(localStorage.getItem("me"));

	return (
		<div>
			<AddNewModelTask
				open={openAddNewModal}
				closeHandler={() => setOpenAddNewModal(false)}
				siteId={position?.siteAppID}
				data={null}
				title="Add Model Task"
				// createProcessHandler={createModal}
			/>
			<ModelWrapper
				current="Tasks"
				navigation={modelScreenNavigation({
					equipment: 2,
					stages: 3,
					zones: 5,
					intervals: 0,
					roles: 2,
					questions: 4,
					tasks: 5,
					safteyAlerts: 2,
				})}
				onNavClick={(url) => history.push(`${modelsPath}/24${url}`)}
				onClickAdd={() => {
					setOpenAddNewModal(true);
				}}
				showAdd
				showPasteTask
				ModelName="Caterpillar M12"
				Component={<Task />}
			/>
		</div>
	);
}

export default ModelTasks;
