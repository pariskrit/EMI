import React, { useState, useEffect } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/DetailsPanel";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/ClientSiteTable";
import DeleteDialog from "components/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import EditAssetDialog from "./EditAssetDialog";

const AC = ContentStyle();

const Assets = ({ fetchSiteAssets, data }) => {
	const [assets, setAsset] = useState([]);
	const [modal, setModal] = useState({ delete: false, edit: false });
	const [assetId, setId] = useState(null);
	const [editData, setEditData] = useState({});

	useEffect(() => {
		setAsset(data);
	}, [data]);

	const handleEdit = (id) => {
		const edit = [...assets].find((x) => x.id === id);
		setEditData(edit);
		setModal((th) => ({ ...th, edit: true }));
	};

	const deleteSuccess = (id) => {
		const da = [...assets].filter((x) => x.id !== id);
		setAsset(da);
	};

	const handleEditData = (d) => {
		const newData = [...assets];
		let index = newData.findIndex((x) => x.id === d.id);
		newData[index] = d;
		setAsset(newData);
	};

	return (
		<>
			<DeleteDialog
				entityName="Site Assets"
				open={modal.delete}
				deleteID={assetId}
				deleteEndpoint={`${BASE_API_PATH}SiteAssets`}
				handleRemoveData={deleteSuccess}
				closeHandler={() => setModal((th) => ({ ...th, delete: false }))}
			/>
			<EditAssetDialog
				open={modal.edit}
				closeHandler={() => setModal((th) => ({ ...th, edit: false }))}
				editData={editData}
				handleEditData={handleEditData}
				handleRemoveFunctional={() => console.log("Remove Functional")}
				handleAddFunctional={() => console.log("Add Functional")}
				handleUpdateFunctional={() => console.log("Update Functional")}
			/>
			<div>
				<AC.DetailsContainer>
					<DetailsPanel
						header={"Assets"}
						dataCount={123}
						description="Create and manage assets that can be assigned in zone maintenance"
					/>

					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput
										onChange={(e) => console.log(e.target.value)}
										label="Search"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</AC.DetailsContainer>
				<ClientSiteTable
					data={assets}
					columns={["name", "description"]}
					headers={["Asset", "Description"]}
					onEdit={(id) => handleEdit(id)}
					onDelete={(id) => {
						setModal((th) => ({ ...th, delete: true }));
						setId(id);
					}}
					setData={setAsset}
				/>
			</div>
		</>
	);
};

export default Assets;
