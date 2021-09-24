import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { SiteContext } from "contexts/SiteApplicationContext";
import { defectStatusTypes } from "helpers/constants";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";

function DefectStatuses({ appId }) {
	const {
		allData,
		searchQuery,
		handleSearch,
		setAllData,
		setSearchData,
	} = useSearch();
	const [{ showAdd }, dispatch] = useContext(SiteContext);
	const [dataToEdit, setDataToEdit] = useState({});
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [defaultId, setDefaultId] = useState(null);

	const addData = (newData) => setAllData([...allData, newData]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const onOpenEditDialog = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		setDataToEdit(allData[index]);
		setOpenEditDialog(true);
	};

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	const handleEditData = (editedData) => {
		const newList = [...allData];
		const index = newList.findIndex((data) => data.id === editedData.id);
		newList.splice(index, 1, editedData);
		setAllData(newList);
	};

	const closeAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const closeEditDialog = () => setOpenEditDialog(false);

	const fetchDefectStatuses = async () => {
		const result = await getDefectStatuses(appId);
		const res = await getSiteApplicationDetail(appId);
		setDefaultId(res.data.defaultDefectStatusID);
		setAllData([
			...result.data.map((res) => ({
				...res,
				type: defectStatusTypes.find((type) => type.value === res.type)[
					"label"
				],
			})),
		]);
		setLoading(false);
	};

	useEffect(() => {
		fetchDefectStatuses();
	}, []);

	return (
		<>
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={closeEditDialog}
				data={dataToEdit}
				handleEditData={handleEditData}
			/>
			<DeleteDialog
				entityName="Defect Status"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/defectstatuses"
				handleRemoveData={handleRemoveData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Defect Statuses"}
					dataCount={2}
					description="Create and manage Operating Modes"
				/>
				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>
			<CommonApplicationTable
				data={allData}
				columns={["name", "type"]}
				headers={["Name", "Type"]}
				setSearch={setSearchData}
				searchQuery={searchQuery}
				isLoading={isLoading}
				defaultID={defaultId}
				menuData={[
					{
						name: "Edit",
						handler: onOpenEditDialog,
						isDelete: false,
					},
					{
						name: "Delete",
						handler: onOpenDeleteDialog,
						isDelete: true,
					},
					{
						name: "Make Default",
						isDelete: false,
					},
				]}
			/>
		</>
	);
}

export default DefectStatuses;
