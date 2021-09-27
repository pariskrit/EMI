import DeleteDialog from "components/Elements/DeleteDialog";
import DetailsPanel from "components/Elements/DetailsPanel";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import SearchField from "components/Elements/SearchField/SearchField";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import { SiteContext } from "contexts/SiteApplicationContext";
import { positionTypes } from "helpers/constants";
import { useSearch } from "hooks/useSearch";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import AddDialog from "./AddDialog";
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
	const [defaultId, setDefaultId] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const addData = (newData) => setAllData([...allData, newData]);

	const onOpenDeleteDialog = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const onOpenEditDialog = (id) => {
		let index = allData.findIndex((el) => el.id === id);

		setDataToEdit(allData[index]);
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

	const closeAddModal = () => dispatch({ type: "ADD_TOGGLE" });

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const fetchPositions = async () => {
		const result = await getPositions(appId);
		setLoading(false);

		const getType = (value) =>
			positionTypes.find((type) => type.value === value).label;

		setAllData([
			...result.data.map((res) => ({
				...res,
				analyticsAccess: getType(res.analyticsAccess),
				defectAccess: getType(res.defectAccess),
				defectExportAccess: getType(res.defectExportAccess),
				feedbackAccess: getType(res.feedbackAccess),
				modelAccess: getType(res.modelAccess),
				noticeboardAccess: getType(res.noticeboardAccess),
				serviceAccess: getType(res.serviceAccess),
				settingsAccess: getType(res.settingsAccess),
				userAccess: getType(res.userAccess),
			})),
		]);
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
			<AddDialog
				open={showAdd}
				closeHandler={closeAddModal}
				applicationID={appId}
				handleAddData={addData}
				dataToEdit={dataToEdit}
				setError={setError}
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
