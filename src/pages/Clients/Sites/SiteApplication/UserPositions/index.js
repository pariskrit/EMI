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
import TabTitle from "components/Elements/TabTitle";
import { DefaultPageOptions } from "helpers/constants";

function DefectStatuses({ appId, setError }) {
	const {
		allData,
		searchQuery,
		handleSearch,
		setAllData,
		setSearchData,
		searchedData,
	} = useSearch();
	const [
		{
			showAdd,
			details: { data },
			defaultCustomCaptionsData,
			isReadOnly,
		},
		dispatch,
	] = useContext(SiteContext);

	const defaultOptions = DefaultPageOptions(defaultCustomCaptionsData);

	const [dataToEdit, setDataToEdit] = useState({});
	const [isLoading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const addData = (newData) => fetchPositions();

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

	const handleEditData = () => {
		// const newList = [...allData];
		// const index = newList.findIndex((data) => data.id === editedData.id);
		// newList.splice(index, 1, editedData);
		// setAllData(newList);
		fetchPositions();
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

		if (!result.status) {
			dispatch(
				showError(
					`Failed to fetch ${data?.application?.name} ${defaultCustomCaptionsData?.positionPlural}.`
				)
			);
		} else {
			setAllData([
				...result?.data?.map((res) => ({
					...res,
					analyticsAccess: positionAccessTypes[res.analyticsAccess],
					defectAccess: positionAccessTypes[res.defectAccess],
					defectExportAccess: positionAccessTypes[res.defectExportAccess],
					feedbackAccess: positionAccessTypes[res.feedbackAccess],
					assetAccess: positionAccessTypes[res.assetAccess],
					modelAccess: positionAccessTypes[res.modelAccess],
					noticeboardAccess: positionAccessTypes[res.noticeboardAccess],
					serviceAccess: positionAccessTypes[res.serviceAccess],
					settingsAccess: positionAccessTypes[res.settingsAccess],
					userAccess: positionAccessTypes[res.userAccess],
				})),
			]);
		}
	};

	useEffect(() => {
		fetchPositions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<TabTitle
				title={`${data.application.name} ${defaultCustomCaptionsData?.positionPlural}`}
			/>
			<DeleteDialog
				entityName={data?.positionCC || defaultCustomCaptionsData?.position}
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
				header={data?.positionCC || defaultCustomCaptionsData?.position}
				customCaptions={defaultCustomCaptionsData}
				defaultOptions={defaultOptions}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={
						data?.positionPluralCC || defaultCustomCaptionsData?.positionPlural
					}
					dataCount={allData.length}
					description={`Create and manage ${
						data?.positionPluralCC || defaultCustomCaptionsData?.positionPlural
					}`}
				/>
				<SearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
					header={
						data?.positionPluralCC || defaultCustomCaptionsData?.positionPlural
					}
				/>
				<MobileSearchField
					searchQuery={searchQuery}
					setSearchQuery={handleSearch}
					header={
						data?.positionPluralCC || defaultCustomCaptionsData?.positionPlural
					}
				/>
			</div>
			<CommonApplicationTable
				defaultCustomCaptionsData={defaultCustomCaptionsData}
				data={allData}
				setData={setAllData}
				isReadOnly={isReadOnly}
				columns={[
					"name",
					"defaultPage",
					"modelAccess",
					"allowPublish",
					"assetAccess",
					"serviceAccess",
					"defectAccess",
					"noticeboardAccess",
					"feedbackAccess",
					"userAccess",
					"analyticsAccess",
					"settingsAccess",
				]}
				headers={[
					"Name",
					"Default Page",
					defaultCustomCaptionsData?.modelTemplatePlural,
					"Allow Publish",
					defaultCustomCaptionsData?.assetPlural,
					defaultCustomCaptionsData?.servicePlural,
					defaultCustomCaptionsData?.defectPlural,
					defaultCustomCaptionsData?.tutorialPlural,
					defaultCustomCaptionsData?.feedbackPlural,
					defaultCustomCaptionsData?.userPlural,
					"Analytics",
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
