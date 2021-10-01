import DefaultDialog from "components/Elements/DefaultDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { SiteContext } from "contexts/SiteApplicationContext";
import { defectStatusTypes } from "helpers/constants";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";

function DefectStatuses({ appId, setError }) {
	const {
		allData,
		searchQuery,
		searchedData,
		handleSearch,
		setAllData,
		setSearchData,
	} = useSearch();
	const [{ showAdd }, dispatch] = useContext(SiteContext);
	const [dataToEdit, setDataToEdit] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState(null);
	const [defaultId, setDefaultId] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [confirmDefault, setConfirmDefault] = useState([]);

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

	const onOpenDefaultDialog = (id) => {
		const { name } = allData.find((data) => data.id === id);
		setConfirmDefault([id, name]);
		setOpenDefaultDialog(true);
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

	const closeDefaultDialog = () => setOpenDefaultDialog(false);

	const handleDefaultUpdate = async () => {
		const result = await patchApplicationDetail(appId, [
			{
				op: "replace",
				path: "defaultDefectStatusID",
				value: confirmDefault[0],
			},
		]);

		if (result.status) {
			// Updating default state
			setDefaultId(confirmDefault[0]);
		} else {
			// setError(result.data.detail);
		}
	};

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={closeDefaultDialog}
				data={confirmDefault}
				entity="Default Status"
				handleDefaultUpdate={handleDefaultUpdate}
			/>
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
				setError={setError}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={closeEditDialog}
				data={dataToEdit}
				setError={setError}
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
					dataCount={allData.length}
					description="Create and manage Defect Statuses"
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
				searchedData={searchedData}
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
						handler: onOpenDefaultDialog,
						isDelete: false,
					},
				]}
			/>
		</>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (message) => dispatch(showError(message)),
	};
};

export default connect(null, mapDispatchToProps)(DefectStatuses);
