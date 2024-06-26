import React from "react";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import { ModelContext } from "contexts/ModelDetailContext";
import { useContext } from "react";

function ListTable({
	service,
	data,
	handleEdit,
	handleDelete,
	handleDuplicate,
	handleCopy,
	handleServiceLayout,
	handleDragEnd,
	access,
	disable,
}) {
	const [state] = useContext(ModelContext);

	return (
		<DragAndDropTable
			data={data}
			isModelEditable={access === "F" || access === "E"}
			disableDnd={access === "R" || disable}
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
					name: `Switch To ${service} Layout`,
					handler: handleServiceLayout,
					isDelete: false,
				},
				{
					name: "Delete",
					handler: handleDelete,
					isDelete: true,
				},
			].filter((x) => {
				if (state?.modelDetail?.isPublished) {
					return (
						x?.name === "Copy" || x?.name === `Switch To ${service} Layout`
					);
				}
				if (disable) return false;
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
