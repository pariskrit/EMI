import React, { useState, useEffect, useRef } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/Modules/ClientSiteTable";
import DeleteDialog from "components/Modules/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import EditAssetDialog from "./EditAssetDialog";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import { DefaultPageSize } from "helpers/constants";
//import useDidMountEffect from "hooks/useDidMountEffect";

const AC = ContentStyle();

const Assets = ({
	data,
	count,
	siteId,
	isLoading,
	searchedData,
	fetchAsset,
	getError,
}) => {
	const [assets, setAsset] = useState([]);
	const [modal, setModal] = useState({ delete: false, edit: false });
	const [assetId, setId] = useState(null);
	const [editData, setEditData] = useState({});
	const [total, setTotal] = useState(null);
	const [page, setPage] = useState({ pageNo: 1, perPage: DefaultPageSize });
	//const [searchText, setSearchText] = useState("");
	const searchRef = useRef("");

	// useDidMountEffect(() => {
	// 	const fetchSiteAssets = async () => {
	// 		try {
	// 			const response = await getSiteAssets(siteId, page.pageNo, searchText);

	// 			if (response.status) {
	// 				setAsset(response.data);
	// 				return response;
	// 			} else {
	// 				throw new Error(response);
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			return err;
	// 		}
	// 	};

	// 	fetchSiteAssets();
	// }, [page, searchText]);

	const fetchSiteAssets = async (searchText) => {
		try {
			const response = await getSiteAssets(
				siteId,
				1,
				DefaultPageSize,
				searchText
			);

			if (response.status) {
				setAsset(response.data);
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

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

	const deleteSuccess = async () => {
		await fetchAsset(1);
		setModal((th) => ({ ...th, edit: false }));
		setEditData({});
	};

	const handleEditData = async () => {
		await fetchAsset(1);
		setModal((th) => ({ ...th, edit: false }));
		setEditData({});
	};

	const handlePage = async (p, prevData) => {
		try {
			const response = await getSiteAssets(
				siteId,
				p,
				DefaultPageSize,
				searchRef.current
			);
			if (response.status) {
				setPage({ pageNo: p, rowsPerPage: DefaultPageSize });
				setAsset([...prevData, ...response.data]);
				response.data = [...prevData, ...response.data];
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
		//setSearchText(value);
		searchRef.current = value;
		fetchSiteAssets(value);
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
				getError={getError}
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
					data={assets}
					columns={["name", "description"]}
					headers={["Asset", "Description"]}
					onEdit={handleEdit}
					onDelete={(id) => {
						setModal((th) => ({ ...th, delete: true }));
						setId(id);
					}}
					setData={setAsset}
					page={page.pageNo}
					rowsPerPage={assets.length}
					onPageChange={handlePage}
					count={total}
					isLoading={isLoading}
					searchText={searchRef.current}
				/>
			</div>
		</>
	);
};

export default Assets;
