import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";
import { useSearch } from "hooks/useSearch";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import AddEditDialog from "./AddEditDialog";
import { getFeedbackStatuses } from "services/clients/sites/siteApplications/feedbackStatuses";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import FeedbackStatusTypes from "helpers/feedbackStatusTypes";
import DefaultDialog from "components/Elements/DefaultDialog";
import API from "helpers/api";

const SiteAppFeedbackStatuses = ({
	state,
	dispatch,
	appId,
	getError,
	header,
}) => {
	const {
		allData,
		setAllData,
		handleSearch,
		searchedData,
		searchQuery,
		setSearchData,
	} = useSearch();
	const [loading, setLoading] = useState(false);
	const [model, setModel] = useState({
		default: false,
		edit: false,
		delete: false,
	});
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [deleteId, setDeleteId] = useState(false);
	const [editData, setEditData] = useState({});
	const [defaultId, setDefaultId] = useState(null);
	const [is404, setIs404] = useState(false);

	const handleGetData = useCallback(async () => {
		setLoading(true);
		// Attempting to get data
		try {
			// Getting data from API
			let result = await getFeedbackStatuses(appId);
			let res = await getSiteApplicationDetail(appId);
			// if success, adding data to state
			if (result.status) {
				setLoading(false);

				setDefaultId(res?.data?.defaultFeedbackStatusID);
				setAllData(
					result?.data?.map((x) => ({
						...x,
						statusType: FeedbackStatusTypes[x?.type],
					}))
				);

				return true;
			} else {
				setIs404(true);
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			setLoading(false);
			console.log(err);
			return false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId]);

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddData = (item) => {
		const newData = [...allData];
		newData.push(item);
		setAllData(newData);
	};

	const handleDefaultDialogOpen = (id, name) => {
		setConfirmDefault([id, name]);
		setModel((th) => ({ ...th, default: true }));
	};

	const handleDefaultUpdate = async () => {
		// Attempting to update default
		try {
			// Patching change to API
			const result = await API.patch(`/api/siteapps/${appId}`, [
				{
					op: "replace",
					path: "defaultFeedbackStatusID",
					value: confirmDefault[0],
				},
			]);

			// If success, updating default in state
			if (result.status === 200) {
				// Updating default state
				setDefaultId(confirmDefault[0]);

				return true;
			} else {
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

			return false;
		}
	};

	// Edit Item Handler
	const handleEditDialogOpen = (id) => {
		dispatch({ type: "ADD_TOGGLE" });
		const requireData = [...allData].find(function (item) {
			return item.id === id;
		});
		setEditData(requireData);
		setModel((th) => ({ ...th, edit: true }));
	};
	const handleEditData = (d) => {
		const newData = [...allData];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setAllData(newData);
	};
	const handleAddEditDialogClose = () => {
		dispatch({ type: "ADD_TOGGLE" });
		setModel((th) => ({ ...th, edit: false }));
		setEditData({});
	};

	// Remove or delete Item Handler
	const handleDeleteDialogOpen = (id) => {
		setDeleteId(id);
		setModel((th) => ({ ...th, delete: true }));
	};
	const handleDeleteDialogClose = () => {
		setModel((th) => ({ ...th, delete: false }));
		setDeleteId(false);
	};
	const handleRemoveData = (id) => {
		const newData = [...allData].filter(function (item) {
			return item.id !== id;
		});
		// Updating state
		setAllData(newData);
		setModel((th) => ({ ...th, delete: false }));
		setDeleteId(null);
	};

	if (is404 === false) {
		return (
			<div>
				<DefaultDialog
					open={model.default}
					closeHandler={() => setModel((th) => ({ ...th, default: false }))}
					data={confirmDefault}
					entity="Feedback Status"
					handleDefaultUpdate={handleDefaultUpdate}
				/>
				<AddEditDialog
					open={state.showAdd}
					editMode={model.edit}
					closeHandler={handleAddEditDialogClose}
					data={editData}
					handleAddData={handleAddData}
					handleEditData={handleEditData}
					applicationID={appId}
					getError={getError}
				/>
				<DeleteDialog
					entityName="Feedback Statuses"
					open={model.delete}
					closeHandler={handleDeleteDialogClose}
					deleteEndpoint={`${BASE_API_PATH}feedbackstatuses`}
					deleteID={deleteId}
					handleRemoveData={handleRemoveData}
				/>
				<div className="detailsContainer">
					<DetailsPanel
						header={header}
						dataCount={allData.length}
						description="Create and manage Model Statuses"
					/>

					<SearchField
						searchQuery={searchQuery}
						setSearchQuery={handleSearch}
						header="Feedback Statuses"
					/>

					<MobileSearchField
						searchQuery={searchQuery}
						setSearchQuery={handleSearch}
						header="Feedback Statuses"
					/>
				</div>
				<CommonApplicationTable
					defaultID={defaultId}
					data={allData}
					columns={["name", "statusType"]}
					headers={["Name", "Type"]}
					setData={setAllData}
					setSearch={setSearchData}
					searchedData={searchedData}
					searchQuery={searchQuery}
					isLoading={loading}
					menuData={[
						{
							name: "Edit",
							handler: handleEditDialogOpen,
							isDelete: false,
						},
						{
							name: "Delete",
							handler: handleDeleteDialogOpen,
							isDelete: true,
						},
						{
							name: "Make Default Status",
							handler: handleDefaultDialogOpen,
							isDelete: false,
						},
					]}
				/>
			</div>
		);
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppFeedbackStatuses);
