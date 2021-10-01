import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { SiteContext } from "contexts/SiteApplicationContext";
import { positionAccessTypes } from "helpers/constants";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import AddEditDialog from "./AddEditDialog";
import { Apis } from "services/api";

function DefectStatuses({ appId, setError }) {
	const {
		allData,
		searchQuery,
		handleSearch,
		setAllData,
		setSearchData,
		searchedData,
	} = useSearch();
	const [{ showAdd }, dispatch] = useContext(SiteContext);
	const [dataToEdit, setDataToEdit] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const addData = (newData) =>
		setAllData([
			...allData,
			{
				...newData,
				modelAccess: positionAccessTypes[newData.modelAccess],
				serviceAccess: positionAccessTypes[newData.serviceAccess],
				defectAccess: positionAccessTypes[newData.defectAccess],
				defectExportAccess: positionAccessTypes[newData.defectExportAccess],
				noticeboardAccess: positionAccessTypes[newData.noticeboardAccess],
				feedbackAccess: positionAccessTypes[newData.feedbackAccess],
				userAccess: positionAccessTypes[newData.userAccess],
				analyticsAccess: positionAccessTypes[newData.analyticsAccess],
				settingsAccess: positionAccessTypes[newData.settingsAccess],
			},
		]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const onOpenEditDialog = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		setDataToEdit(allData[index]);
		setIsEdit(true);
		dispatch({ type: "ADD_TOGGLE" });
	};

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	const handleEditData = (editedData) => {
		const newList = [...allData];
		const index = newList.findIndex((data) => data.id === editedData.id);
		newList.splice(index, 1, editedData);
		setAllData(newList);
	};

	const closeAddModal = () => {
		dispatch({ type: "ADD_TOGGLE" });
		setDataToEdit({});
		setIsEdit(false);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const fetchPositions = async () => {
		const result = await getPositions(appId);
		setLoading(false);

		if (result.status) {
			setAllData([
				...result.data.map((res) => ({
					...res,
					analyticsAccess: positionAccessTypes[res.analyticsAccess],
					defectAccess: positionAccessTypes[res.defectAccess],
					defectExportAccess: positionAccessTypes[res.defectExportAccess],
					feedbackAccess: positionAccessTypes[res.feedbackAccess],
					modelAccess: positionAccessTypes[res.modelAccess],
					noticeboardAccess: positionAccessTypes[res.noticeboardAccess],
					serviceAccess: positionAccessTypes[res.serviceAccess],
					settingsAccess: positionAccessTypes[res.settingsAccess],
					userAccess: positionAccessTypes[res.userAccess],
				})),
			]);
		} else {
			setError("Please login again");
		}
	};

	useEffect(() => {
		fetchPositions();
	}, []);

	return (
		<>
			<DeleteDialog
				entityName="Position"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteId}
				deleteEndpoint={Apis.positions}
				handleRemoveData={handleRemoveData}
			/>
			<AddEditDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
				dataToEdit={dataToEdit}
				handleEditData={handleEditData}
				setError={setError}
				isEdit={isEdit}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Positions"}
					dataCount={allData.length}
					description="Create and manage Positions"
				/>
				<SearchField searchQuery={searchQuery} setSearchQuery={handleSearch} />
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
				/>
			</div>
			<CommonApplicationTable
				data={allData}
				setData={setAllData}
				columns={[
					"name",
					"modelAccess",
					"serviceAccess",
					"defectAccess",
					"defectExportAccess",
					"noticeboardAccess",
					"feedbackAccess",
					"userAccess",
					"analyticsAccess",
					"settingsAccess",
				]}
				headers={[
					"Name",
					"Assets Models",
					"Services",
					"Defects",
					"Defect Exports",
					"Notice Boards",
					"Feedback",
					"Users",
					"Reporting",
					"Settings",
				]}
				setSearch={setSearchData}
				searchQuery={searchQuery}
				searchedData={searchedData}
				isLoading={isLoading}
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
