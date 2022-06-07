import React, { useState, useEffect, useRef, useCallback } from "react";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/Modules/ClientSiteTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import EditAssetDialog from "./EditAssetDialog";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import { DefaultPageSize } from "helpers/constants";

const debounce = (func, delay) => {
	let timer;
	return function () {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

const AC = ContentStyle();

const Assets = ({
	data,
	count,
	siteId,
	isLoading,
	fetchAsset,
	getError,
	isSiteUser,
	customCaptions,
}) => {
	const [assets, setAsset] = useState([]);
	const [modal, setModal] = useState({ delete: false, edit: false });
	const [assetId, setId] = useState(null);
	const [editData, setEditData] = useState({});
	const [total, setTotal] = useState(null);
	const [page, setPage] = useState({ pageNo: 1, perPage: DefaultPageSize });
	const searchRef = useRef("");

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

	const handleSearch = useCallback(
		debounce((value) => {
			searchRef.current = value;
			fetchSiteAssets(value);
		}, 500),
		[]
	);

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
						header={isSiteUser ? customCaptions?.assetPlural : "Assets"}
						dataCount={total}
						description={`Create and manage ${
							isSiteUser ? customCaptions?.assetPlural : "assets"
						} that can be assigned in zone maintenance`}
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
										label={
											isSiteUser
												? `Search ${customCaptions?.assetPlural}`
												: "Search Assets"
										}
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
				<ClientSiteTable
					data={assets}
					columns={["name", "description"]}
					headers={[
						isSiteUser ? customCaptions?.asset : "Asset",
						"Description",
					]}
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
