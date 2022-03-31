import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";

const QuestionTable = ({
	data,
	handleDragEnd,
	menuData,
	isModelEditable,
	disableDnd,
	rolePlural,
}) => (
	<DragAndDropTable
		data={data}
		isModelEditable={isModelEditable}
		headers={[
			"Caption",
			"Type",
			"Timing",
			rolePlural,
			"Compulsory",
			"Additional Options",
		]}
		columns={[
			{ id: 1, name: "caption", style: { width: "20vw" } },
			{ id: 2, name: "modelType", style: { width: "10vw" } },
			{ id: 3, name: "modelTiming", style: { width: "15vw" } },
			{ id: 4, name: "modelRoles", style: { width: "17vw" } },
			{ id: 5, name: "compulsory", style: { width: "8vw" } },
			{ id: 6, name: "additional", style: { width: "30vw" } },
		]}
		handleDragEnd={handleDragEnd}
		disableDnd={disableDnd}
		menuData={menuData}
	/>
);
export default QuestionTable;
