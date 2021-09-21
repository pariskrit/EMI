import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import API from "helpers/api";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import DeleteDialog from "components/Elements/DeleteDialog";
import DefaultDialog from "components/Elements/DefaultDialog";
import AddStatusDialog from "./AddDialog";
import EditStatusDialog from "./EditDialog";
import ModelStatusesTable from "./ModelStatusesTable";
import { showError } from "redux/common/actions";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();
const SiteAppModelStatuses = ({ state, dispatch, appId, getError }) => {
	const [data, setData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedData, setSearchedData] = useState([]);
	const [confirmDefault, setConfirmDefault] = useState([null, null]);
	const [defaultData, setDefaultData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState({
		edit: false,
		delete: false,
		default: false,
	});
	const [editData, setEditData] = useState({});
	const [deleteId, setDeleteId] = useState(null);

	const handleGetData = useCallback(async () => {
		setLoading(true);
		// Attempting to get data
		try {
			// Getting data from API
			let result = await API.get(`/api/modelstatuses?siteAppId=${appId}`);

			// if success, adding data to state
			if (result.status === 200) {
				setLoading(false);
				// Updating state
				result.data.forEach((d, index) => {
					d.isDefault = false;

					result.data[index] = d;
				});
				setData(result.data);

				return true;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			setLoading(false);
			console.log(err);
			return false;
		}
	}, [appId]);

	const onEditClick = (id) => {
		let index = data.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(data[index]);
			setModal((th) => ({ ...th, edit: true }));
		}
	};

	const onDeleteClick = (id) => {
		setModal((th) => ({ ...th, delete: true }));
		setDeleteId(id);
	};

	const onDefaultClick = (id, name) => {
		setConfirmDefault([id, name]);
		setModal((th) => ({ ...th, default: true }));
	};

	const handleAddData = (item) => {
		const newData = [...data];
		newData.push(item);
		setData(newData);
	};

	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});
		// Updating state
		setData(newData);
	};

	useEffect(() => {
		handleGetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchQuery(value);
		const filtered = data.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex);
		});
		setSearchedData(filtered);
	};

	const mainData = searchQuery.length === 0 ? data : searchedData;

	return (
		<div>
			<AddStatusDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "ADD_TOGGLE" })}
				applicationID={appId}
				handleAddData={handleAddData}
				getError={getError}
			/>
			<EditStatusDialog
				open={modal.edit}
				data={editData}
				closeHandler={() => setModal((th) => ({ ...th, edit: false }))}
				handleEditData={handleEditData}
				getError={getError}
			/>
			<DeleteDialog
				entityName="Model Status"
				open={modal.delete}
				closeHandler={() => {
					setDeleteId(null);
					setModal((th) => ({ ...th, delete: false }));
				}}
				deleteEndpoint="/api/modelstatuses"
				deleteID={deleteId}
				handleRemoveData={handleRemoveData}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Model Statuses"}
					dataCount={data.length}
					description="Create and manage Model Statuses"
				/>

				<div className="desktopSearchCustomCaptions">
					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<div className="flex">
									<Grid item>
										<SearchIcon
											style={{ marginTop: "20px", marginRight: "5px" }}
										/>
									</Grid>
									<Grid item>
										<AC.SearchInput
											value={searchQuery}
											onChange={handleSearch}
											label="Search Statuses"
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>

				<div className="mobileSearchCustomCaptions">
					<AC.SearchContainerMobile>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput
										value={searchQuery}
										onChange={(e) => {
											setSearchQuery(e.target.value);
										}}
										label="Search Statuses"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainerMobile>
				</div>
			</div>
			<ModelStatusesTable
				setData={setData}
				data={mainData}
				defaultID={defaultData}
				onEdit={onEditClick}
				onDelete={onDeleteClick}
				onDefault={onDefaultClick}
				searchQuery={searchQuery}
				isLoading={loading}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
});

export default connect(null, mapDispatchToProps)(SiteAppModelStatuses);
