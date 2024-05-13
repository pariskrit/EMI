import React, { useState, useEffect, useRef, useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/Elements/DetailsPanel";
import { Grid, LinearProgress } from "@mui/material";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/Modules/ClientSiteTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import { BASE_API_PATH } from "helpers/constants";
import EditAssetDialog from "./EditAssetDialog";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import {
	defaultPageSize,
	fileDownload,
	getFileNameFromContentDispositonHeader,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getTasksWhereAssetUsed } from "services/reports/reports";

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

const useStyles = makeStyles()((theme) => ({
	loaderContent: {
		position: "sticky",
		top: 0,
	},
}));

const Assets = ({
	data,
	count,
	siteId,
	isLoading,
	fetchAsset,
	getError,
	isSiteUser,
	customCaptions,
	isReadOnly,
}) => {
	const { classes, cx } = useStyles();

	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);

	const [assets, setAsset] = useState([]);
	const [modal, setModal] = useState({ delete: false, edit: false });
	const [assetId, setId] = useState(null);
	const [editData, setEditData] = useState({});
	const [isDownloading, setIsDownloading] = useState(false);
	const [total, setTotal] = useState(null);
	const [page, setPage] = useState({ pageNo: 1, perPage: defaultPageSize() });
	const searchRef = useRef("");
	const dispatch = useDispatch();

	const handleSort = async (sortField, sortOrder) => {
		try {
			const response = await getSiteAssets(
				siteId,
				1,
				defaultPageSize(),
				searchRef.current,
				sortField,
				sortOrder
			);

			if (response.status) {
				setPage({ pageNo: 1, rowsPerPage: defaultPageSize() });
				setAsset([...response.data]);
			} else {
				throw new Error(response);
			}
		} catch (err) {
			dispatch(
				showError(`Failed to fetch ${customCaptions?.assetPlural || "assets"}.`)
			);
			return err;
		}
	};

	const fetchSiteAssets = async (searchText) => {
		try {
			const response = await getSiteAssets(
				siteId,
				1,
				defaultPageSize(),
				searchText,
				currentTableSort[0],
				currentTableSort[1]
			);

			if (response.status) {
				setAsset(response.data);
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			dispatch(
				showError(`Failed to fetch ${customCaptions?.assetPlural || "assets"}.`)
			);
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

	const handlePage = async (p, prevData, name) => {
		try {
			const response = await getSiteAssets(
				siteId,
				p,
				defaultPageSize(),
				searchRef.current,
				name?.sortField,
				name?.sortOrder
			);
			if (response.status) {
				setPage({ pageNo: p, rowsPerPage: defaultPageSize() });
				setAsset([...prevData, ...response.data]);
				response.data = [...prevData, ...response.data];
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			dispatch(
				showError(`Failed to fetch ${customCaptions?.assetPlural || "assets"}.`)
			);
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

	const downloadReportHandler = async (siteAssetId) => {
		setIsDownloading(true);
		try {
			const response = await getTasksWhereAssetUsed({ siteAssetId });
			if (response.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				fileDownload(response, fileName);
			} else {
				const res = JSON.parse(await response?.data.text());
				dispatch(
					showError(
						res?.detail || res.errors?.message || "Failed to download report."
					)
				);
			}
		} catch (err) {
			dispatch(showError("Failed to download report."));
		} finally {
			setIsDownloading(false);
		}
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
						header={isSiteUser ? customCaptions?.assetPlural : "Assets"}
						dataCount={total}
						description={`Create and manage ${
							isSiteUser ? customCaptions?.assetPlural : "assets"
						} that can be assigned`}
					/>

					<AC.SearchContainer>
						<AC.SearchInner className="applicationSearchBtn">
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput
										variant="standard"
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
				{isDownloading && (
					<div className={classes.loaderContent}>
						<LinearProgress />{" "}
					</div>
				)}

				<ClientSiteTable
					currentTableSort={currentTableSort}
					setCurrentTableSort={setCurrentTableSort}
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
					isReadOnly={isReadOnly}
					taskPluralCC={customCaptions?.taskPlural || "Tasks"}
					assetCC={customCaptions?.asset || "Asset"}
					downloadReportHandler={downloadReportHandler}
					isSiteUser={isSiteUser}
					handleSort={handleSort}
				/>
			</div>
		</>
	);
};

export default Assets;
