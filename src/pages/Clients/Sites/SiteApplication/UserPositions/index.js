import DefaultDialog from "components/Elements/DefaultDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { SiteContext } from "contexts/SiteApplicationContext";
import { defectStatusTypes, positionTypes } from "helpers/constants";
import PositionAccessTypes from "helpers/positionAccessTypes";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import {
	getSiteApplicationDetail,
	patchApplicationDetail,
} from "services/clients/sites/siteApplications/siteApplicationDetails";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
// import AddDialog from "./AddDialog";
// import EditDialog from "./EditDialog";

function DefectStatuses({ appId, setError }) {
	const {
		allData,
		searchQuery,
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

	const fetchPositions = async () => {
		const result = await getPositions(appId);
		setLoading(false);

		setAllData([
			...result.data.map((res) => ({
				...res,
				analyticsAccess: PositionAccessTypes[res.analyticsAccess],
				defectAccess: PositionAccessTypes[res.defectAccess],
				defectExportAccess: PositionAccessTypes[res.defectExportAccess],
				feedbackAccess: PositionAccessTypes[res.feedbackAccess],
				modelAccess: PositionAccessTypes[res.modelAccess],
				noticeboardAccess: PositionAccessTypes[res.noticeboardAccess],
				serviceAccess: PositionAccessTypes[res.serviceAccess],
				settingsAccess: PositionAccessTypes[res.settingsAccess],
				userAccess: PositionAccessTypes[res.userAccess],
			})),
		]);
	};

	useEffect(() => {
		fetchPositions();
	}, []);

	return (
		<>
			{/* <DefaultDialog
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
			/> */}
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
