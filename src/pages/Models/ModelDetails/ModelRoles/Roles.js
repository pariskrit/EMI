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

const AC = ContentStyle();

function Roles({ modelId, state, dispatch, access, isMounted }) {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openEditModelRoleDialog, setopenEditModelRoleDialog] = useState(false);
	const [roleToEditData, setRoleToEditData] = useState(null);
	const [roleToEditId, setRoleToEditId] = useState(null);

	const reduxDispatch = useDispatch();

	const { position, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// search from model roles list
	const handleSearch = (searchtxt) => {
		if (searchtxt !== "") {
			const searchedList = data.filter((item) =>
				["name", "mappedRoleName"].some((col) => {
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
		setRoleToEditData({
			name: roleToEdit?.name,
			roleID: roleToEdit?.mappedRoleID,
		});
		setRoleToEditId({
			id: roleToEdit?.id,
			mappedRoleName: roleToEdit?.mappedRoleName,
		});
		setopenEditModelRoleDialog(true);
	};

	const handleRemoveData = (id) => {
		const newData = [...data.filter((d) => d.id !== id)];
		setData(newData);
		setFilteredData(newData);
	};

	const createModalRole = async (payload) => {
		return await addModelRole({ ...payload, ModelVersionID: modelId });
	};

	const PatchModelRole = async (payload) => {
		payload = [
			{ op: "replace", path: "roleID", value: payload?.roleID },
			{ op: "replace", path: "name", value: payload?.name },
		];
		return await editModelRole(roleToEditId?.id, payload);
	};

	return (
		<div>
			<AddModelRoleDialog
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				data={null}
				title={`Add ${customCaptions?.role}`}
				siteAppId={position?.siteAppID}
				createProcessHandler={createModalRole}
				fetchModelRoles={() => fetchModelRoles(false)}
				customCaptions={customCaptions}
			/>
			<AddModelRoleDialog
				open={openEditModelRoleDialog}
				closeHandler={() => setopenEditModelRoleDialog(false)}
				data={roleToEditData}
				title={`Edit ${customCaptions?.role}`}
				siteAppId={position?.siteAppID}
				fetchModelRoles={() => fetchModelRoles(false)}
				createProcessHandler={PatchModelRole}
				mappedRoleName={roleToEditId?.mappedRoleName}
				customCaptions={customCaptions}
			/>
			<DeleteDialog
				entityName={`Model ${customCaptions?.role}`}
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
							description={`Select ${customCaptions?.rolePlural} that are valid for ${customCaptions?.taskPlural} in this ${customCaptions?.asset} ${customCaptions?.model}`}
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
					<RoleListTable
						columns={["name", "mappedRoleName"]}
						headers={[
							{ id: 1, name: "Name" },
							{ id: 2, name: `Map To Service ${customCaptions?.role}` },
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
							if (access === "F") return true;
							if (access === "E") {
								if (x.name === "Edit") return true;
								else return false;
							}
							return false;
						})}
					/>
				</>
			)}
		</div>
	);
}

export default withMount(Roles);
