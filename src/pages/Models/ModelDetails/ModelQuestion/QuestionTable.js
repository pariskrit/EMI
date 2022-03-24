import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";

const QuestionTable = ({
	data,
	handleDragEnd,
	menuData,
	isModelEditable,
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
			{ id: 1, name: "caption", style: { width: "20%" } },
			{ id: 2, name: "modelType", style: { width: "5%" } },
			{ id: 3, name: "modelTiming", style: { width: "10%" } },
			{ id: 4, name: "modelRoles", style: { width: "5%" } },
			{ id: 5, name: "compulsory", style: { width: "5%" } },
			{ id: 6, name: "additional", style: { width: "20%" } },
		]}
		handleDragEnd={handleDragEnd}
		menuData={menuData}
	/>
);
export default QuestionTable;
