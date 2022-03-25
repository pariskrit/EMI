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
			headers={["Caption", "Type", "Compulsory", "Additional Options"]}
			columns={[
				{ id: 1, name: "caption", style: { width: "25vw" } },
				{ id: 2, name: "questionType", style: { width: "10vw" } },
				{ id: 3, name: "compulsory", style: { width: "5vw" } },
				{ id: 4, name: "additional", style: { width: "60vw" } },
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
