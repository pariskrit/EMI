import ContentStyle from "styles/application/ContentStyle";
import { CircularProgress, Grid } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import React, { useEffect, useState } from "react";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import RoleListTable from "./RoleListTable";
import {
	addModelRole,
	editModelRole,
	getModelRolesList,
} from "services/models/modelDetails/modelRoles";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";
import AddModelRoleDialog from "./AddModelRoleDialog";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import withMount from "components/HOC/withMount";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import TabTitle from "components/Elements/TabTitle";

const AC = ContentStyle();

function Roles({
	modelId,
	state,
	dispatch,
	access,
	isMounted,
	modelDefaultId,
}) {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditModelRoleDialog, setopenEditModelRoleDialog] = useState(false);
	const [roleToEditData, setRoleToEditData] = useState(null);
	const [roleToEditId, setRoleToEditId] = useState(null);

	const reduxDispatch = useDispatch();

	const { position, customCaptions, application } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// search from model roles list
	const handleSearch = (searchtxt) => {
		if (searchtxt !== "") {
			const searchedList = data.filter((item) =>
				["name", "mappedRoleName", "siteDepartmentName"].some((col) => {
					return item[col]?.match(new RegExp(searchtxt, "gi"));
				})
			);
			setFilteredData(searchedList);
		} else {
			setFilteredData(data);
		}
	};

	// fetch model role list
	const fetchModelRoles = async (loads) => {
		!isMounted.aborted && loads && setLoading(true);
		try {
			const response = await getModelRolesList(modelId);
			if (response.status) {
				if (!isMounted.aborted) {
					setData(response.data);
					setFilteredData(response.data);
				}
				dispatch({
					type: "TAB_COUNT",
					payload: { countTab: "roleCount", data: response.data.length },
				});
			} else {
				reduxDispatch(showError(response?.title || "something went wrong"));
			}
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		} finally {
			!isMounted.aborted && loads && setLoading(false);
		}
	};

	useEffect(() => {
		fetchModelRoles(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// open delete dialogue
	const handleDeteleDialogOpen = (roleIdTodelete) => {
		setDeleteID(roleIdTodelete);
		setOpenDeleteDialog(true);
	};

	//open edit dialogue
	const handleEditDialogOpen = (roleToEdit) => {
		roleToEdit = filteredData?.find((x) => x.id === roleToEdit);
		console.log("fdsfsdfds", roleToEdit);
		setRoleToEditData({
			name: roleToEdit?.name,
			roleID: roleToEdit?.mappedRoleID,
			siteDepartmentID: roleToEdit?.siteDepartmentID,
		});
		setRoleToEditId({
			id: roleToEdit?.id,
			mappedRoleName: roleToEdit?.mappedRoleName,
			siteDepartmentName: roleToEdit?.siteDepartmentName,
		});
		setopenEditModelRoleDialog(true);
	};

	const handleRemoveData = (id) => {
		const newData = [...data.filter((d) => d.id !== id)];
		setData(newData);
		setFilteredData(newData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "roleCount", data: newData.length },
		});
	};

	const createModalRole = async (payload) => {
		return await addModelRole({ ...payload, ModelVersionID: modelId });
	};

	const PatchModelRole = async (payload) => {
		payload = [
			{ op: "replace", path: "roleID", value: payload?.roleID },
			{ op: "replace", path: "name", value: payload?.name },
			{
				op: "replace",
				path: "siteDepartmentID",
				value: payload?.siteDepartmentID,
			},
		];
		return await editModelRole(roleToEditId?.id, payload);
	};

	return (
		<div>
			<TabTitle
				title={`${state?.modelDetail?.name} ${state?.modelDetail?.modelName} ${customCaptions.role} | ${application.name}`}
			/>
			<AddModelRoleDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				data={null}
				title={`Add ${customCaptions?.role}`}
				siteAppId={position?.siteAppID}
				createProcessHandler={createModalRole}
				fetchModelRoles={() => fetchModelRoles(false)}
				customCaptions={customCaptions}
				modelId={modelId}
			/>
			<AddModelRoleDialog
				open={openEditModelRoleDialog}
				closeHandler={() => setopenEditModelRoleDialog(false)}
				data={roleToEditData}
				title={`Edit ${customCaptions?.role}`}
				showSave
				siteAppId={position?.siteAppID}
				fetchModelRoles={() => fetchModelRoles(false)}
				createProcessHandler={PatchModelRole}
				mappedRoleName={roleToEditId?.mappedRoleName}
				mappedDepartmentName={roleToEditId?.siteDepartmentName}
				customCaptions={customCaptions}
				modelId={modelId}
			/>
			<DeleteDialog
				entityName={`${customCaptions?.role}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={Apis.ModelRoles}
				handleRemoveData={handleRemoveData}
			/>
			{loading ? (
				<CircularProgress />
			) : (
				<>
					<div className="detailsContainer">
						<DetailsPanel
							header={`${customCaptions?.rolePlural}`}
							dataCount={data.length}
							description={`${customCaptions?.rolePlural} that are used for this ${customCaptions?.modelTemplate}`}
						/>
						<AC.SearchContainer>
							<AC.SearchInner className="applicationSearchBtn">
								<Grid container spacing={1} alignItems="flex-end">
									<Grid item>
										<SearchIcon />
									</Grid>
									<Grid item>
										<AC.SearchInput
											onChange={(e) => handleSearch(e.target.value)}
											label="Search"
										/>
									</Grid>
								</Grid>
							</AC.SearchInner>
						</AC.SearchContainer>
					</div>
					<AutoFitContentInScreen containsTable>
						<RoleListTable
							columns={["name", "mappedRoleName", "siteDepartmentName"]}
							headers={[
								{ id: 1, name: "Name" },
								{
									id: 2,
									name: `Map To ${customCaptions?.service} ${customCaptions?.role}`,
								},
								{
									id: 3,
									name: `${customCaptions.department}`,
								},
							]}
							data={filteredData}
							setData={setFilteredData}
							menuData={[
								{
									name: "Edit",
									handler: handleEditDialogOpen,
									isDelete: false,
								},
								{
									name: "Delete",
									handler: handleDeteleDialogOpen,
									isDelete: true,
								},
							].filter((x) => {
								if (state?.modelDetail?.isPublished) return false;

								if (access === "F") return true;
								if (access === "E") {
									if (x.name === "Edit") return true;
									else return false;
								}
								return false;
							})}
						/>
					</AutoFitContentInScreen>
				</>
			)}
		</div>
	);
}

export default withMount(Roles);
