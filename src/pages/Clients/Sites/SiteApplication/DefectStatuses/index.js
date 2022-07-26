import React, { useEffect, useState } from "react";
import DefaultDialog from "components/Elements/DefaultDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { defectStatusTypes } from "helpers/constants";
import { useSearch } from "hooks/useSearch";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import { patchApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import TabTitle from "components/Elements/TabTitle";

function DefectStatuses({ appId, setError, state, dispatch }) {
	const {
		allData,
		searchQuery,
		searchedData,
		handleSearch,
		setAllData,
		setSearchData,
	} = useSearch();

	const [dataToEdit, setDataToEdit] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState(null);
	const [defaultId, setDefaultId] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
	const [confirmDefault, setConfirmDefault] = useState([]);

	const {
		showAdd,
		details: { data },
		defaultCustomCaptionsData: { defectStatus, defectStatusPlural },
	} = state;

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
			dispatch({ type: "SET_SITE_APP_DETAIL", payload: result });
		} else {
			// setError(result.data.detail);
		}
	};

	const fetchDefectStatuses = async () => {
		setDefaultId(state.details.data?.defaultDefectStatusID);
		const result = await getDefectStatuses(appId);

		if (!result.status) {
			console.log("error login again");
		} else {
			setAllData([
				...result?.data?.map((res) => ({
					...res,
					type: defectStatusTypes.find((type) => type.value === res.type)
						?.label,
				})),
			]);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchDefectStatuses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<TabTitle title={`${data.application.name} ${defectStatusPlural}`} />
			<DefaultDialog
				open={openDefaultDialog}
				closeHandler={closeDefaultDialog}
				data={confirmDefault}
				entity={data?.defectStatusCC || defectStatus}
				handleDefaultUpdate={handleDefaultUpdate}
			/>
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
				setError={setError}
				header={data?.defectStatusCC || defectStatus}
			/>
			<EditDialog
				open={openEditDialog}
				closeHandler={closeEditDialog}
				data={dataToEdit}
				setError={setError}
				handleEditData={handleEditData}
				header={data?.defectStatusCC || defectStatus}
			/>
			<DeleteDialog
				entityName={`${data?.defectStatusCC || defectStatus}`}
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint="/api/defectstatuses"
				handleRemoveData={handleRemoveData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={`${data?.defectStatusPluralCC || defectStatusPlural}`}
					dataCount={allData.length}
					description={`Create and manage ${
						data?.defectStatusPluralCC || defectStatusPlural
					}`}
				/>
				<SearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
					header={`${data?.defectStatusPluralCC || defectStatusPlural}`}
				/>
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
					header={`${data?.defectStatusPluralCC || defectStatusPlural}`}
				/>
			</div>
			<CommonApplicationTable
				data={allData}
				setData={setAllData}
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
