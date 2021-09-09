import React, { useState, useEffect } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/DetailsPanel";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/ClientSiteTable";
import DeleteDialog from "components/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import EditAssetDialog from "./EditAssetDialog";
import { getSiteAssets } from "services/clients/sites/siteAssets";

const AC = ContentStyle();

const Assets = ({ data, count, siteId, isLoading }) => {
	const [assets, setAsset] = useState([]);
	const [modal, setModal] = useState({ delete: false, edit: false });
	const [assetId, setId] = useState(null);
	const [editData, setEditData] = useState({});
	const [total, setTotal] = useState(null);
	const [page, setPage] = useState({ pageNo: 1, perPage: 12 });
	const [searchText, setSearchText] = useState("");
	const [searchedAsset, setSearchAsset] = useState([]);

	useEffect(() => {
		setAsset(data);
	}, [data]);

	useEffect(() => {
		setTotal(+count);
	}, [count]);

	const handleEdit = (id) => {
		const edit = [...assets].find((x) => x.id === id);
		setEditData(edit);
		setModal((th) => ({ ...th, edit: true }));
	};

	const deleteSuccess = (id) => {
		const da = [...assets].filter((x) => x.id !== id);
		setAsset(da);
		setTotal(total - 1);
	};

	const handleEditData = (d) => {
		const newData = [...assets];
		let index = newData.findIndex((x) => x.id === d.id);
		newData[index] = d;
		setAsset(newData);
	};

	const handlePage = async (p, prevData) => {
		setPage({ pageNo: p, rowsPerPage: 12 });
		try {
			const response = await getSiteAssets(siteId, p);
			if (response.status) {
				debugger;
				setAsset([...prevData, ...response.data]);
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearchText(value);
		const filteredData = assets.filter((x) => {
			const regex = new RegExp(value, "gi");
			return x.name.match(regex) || x.description.match(regex);
		});
		setSearchAsset(filteredData);
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
				closeHandler={() => {
					setModal((th) => ({ ...th, edit: false }));
					setEditData({});
				}}
				editData={editData}
				handleEditData={handleEditData}
			/>
			<div>
				<div className="detailsContainer">
					<DetailsPanel
						header={"Assets"}
						dataCount={total}
						description="Create and manage assets that can be assigned in zone maintenance"
					/>

					<AC.SearchContainer>
						<AC.SearchInner className="applicationSearchBtn">
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput onChange={handleSearch} label="Search" />
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
				<ClientSiteTable
					data={searchText.length === 0 ? assets : searchedAsset}
					columns={["name", "description"]}
					headers={["Asset", "Description"]}
					onEdit={handleEdit}
					onDelete={(id) => {
						setModal((th) => ({ ...th, delete: true }));
						setId(id);
					}}
					setData={setAsset}
					page={page.pageNo}
					rowsPerPage={page.rowsPerPage}
					onPageChange={handlePage}
					count={total}
					isLoading={isLoading}
				/>
			</div>
		</>
	);
};

export default Assets;
