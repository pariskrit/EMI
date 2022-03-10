import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";

function ListTable({
	data,
	handleEdit,
	handleDelete,
	handleDuplicate,
	handleCopy,
	handleServiceLayout,
	handleDragEnd,
	access,
}) {
	return (
		<DragAndDropTable
			data={data}
			isModelEditable={access === "F" || access === "E"}
			headers={[
				"Question Caption",
				"Question Type",
				"Compulsory",
				"Additional Options",
			]}
			columns={[
				{ id: 1, name: "caption", style: { width: "25%" } },
				{ id: 2, name: "questionType", style: { width: "10%" } },
				{ id: 3, name: "compulsory", style: { width: "5%" } },
				{ id: 4, name: "additional", style: { width: "35%" } },
			]}
			handleDragEnd={handleDragEnd}
			menuData={[
				{
					name: "Edit",
					handler: handleEdit,
					isDelete: false,
				},
				{
					name: "Duplicate",
					handler: handleDuplicate,
					isDelete: false,
				},
				{
					name: "Copy",
					handler: handleCopy,
					isDelete: false,
				},
				{
					name: "Switch To Service Layout",
					handler: handleServiceLayout,
					isDelete: false,
				},
				{
					name: "Delete",
					handler: handleDelete,
					isDelete: true,
				},
			].filter((x) => {
				if (access === "F") return true;
				if (access === "E") {
					if (x.name === "Edit") return true;
					else return false;
				}
				return false;
			})}
		/>
	);
}
export default ListTable;
