import React, { useState, useCallback, useContext, useEffect } from "react";
import { TableRow, TableCell } from "@mui/material";
import TableStyle from "styles/application/TableStyle";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import {
	getSiteAssetReferences,
	getSiteAssets,
} from "services/clients/sites/siteAssets";
import { ModelContext } from "contexts/ModelDetailContext";
import { handleSort } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { patchTaskStages } from "services/models/modelDetails/modelservicelayout";

const AT = TableStyle();

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

function Row({
	x,
	assets,
	count,
	postStage,
	deleteStage,
	patchStage,
	pageChange,
	modelType,
	modelAccess,
	customCaption,
	setStages,
	siteId,
	fetchFromDropDwn,
	page,
	setPage,
	fetchTaskStages,
}) {
	const dispatch = useDispatch();

	const [state, setStates] = useState({
		selectedAsset: {
			name: x.siteAssetName,
			id: x.siteAssetID,
		},
		selected: x.id !== null,
	});
	const [modelState] = useContext(ModelContext);
	const [searchCount, setSearchCount] = useState(null);
	const [updating, setUpdating] = useState(false);
	const [SiteAssetRefrenceData, setSiteAssetRefrenceData] = useState([]);

	const setState = (da) => setStates((th) => ({ ...th, ...da }));

	useEffect(() => {
		if (x) {
			setStates((prev) => ({
				...prev,
				selectedAsset: {
					name: x.siteAssetName,
					id: x.siteAssetID,
				},
			}));
		}
	}, [x]);

	const patchAsset = async (asset) => {
		try {
			let res = await patchStage(x.id, asset);
			if (res.success) {
				return true;
			} else {
				// if failed to patch, it will set to previous asset
				setState({ selectedAsset: res.data });
			}
		} catch (e) {
			return;
		}
	};

	const failedResponse = (res) => {
		setState({ selected: res.data });
	};

	const postSelected = async () => {
		try {
			let res = await postStage({
				ModelVersionStageID: x.modelVersionStageID,
				SiteAssetID: state.selectedAsset.id,
			});
			if (res.success) {
				return true;
			} else {
				setState({ selected: !state.selected });
				failedResponse(res);
			}
		} catch (e) {
			return;
		}
	};

	const deleteSelected = async () => {
		try {
			let res = await deleteStage(x.id);
			if (res.success) {
				return true;
			} else {
				setState({ selected: !state.selected });
				failedResponse(res);
			}
		} catch (e) {
			return;
		}
	};

	const onAssetChange = (asset) => {
		setState({ selectedAsset: { name: asset.name, id: asset.id } });
		patchAsset(asset);
	};

	const handleAssetDropPage = async (p, prevData) => {
		setPage((prev) => ({ ...prev, pageNo: p }));
		await pageChange({ pNo: p, pSize: 10, search: "" }, prevData);
	};

	const handleSelected = async () => {
		setUpdating(true);
		const toggle = !state.selected;
		setState({ selected: toggle });
		if (toggle) {
			await postSelected();
		} else {
			await deleteSelected();
		}
		setUpdating(false);
	};

	const handleServierSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getSiteAssets(siteId, 1, 100, searchTxt);

				setStages((prev) => ({ ...prev, assets: response.data }));
				setSearchCount(1);
			} else {
				setSearchCount(null);
				handleAssetDropPage(1, assets);
			}
		}, 500),
		[]
	);

	const changeRefrenceSiteAsset = async (assetReference) => {
		try {
			const response = await patchTaskStages(x.id, [
				{
					op: "replace",
					path: "SiteAssetReferenceID",
					value: assetReference.id,
				},
			]);
			if (response.status) {
				fetchTaskStages();
			} else {
				dispatch(
					showError(
						response?.data?.detail || "Could not assign site asset reference"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.detail || "Could not assign site asset reference"
				)
			);
		}
	};

	return (
		<TableRow>
			<TableCell
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: modelType !== "F" ? "100%" : 113,
				}}
			>
				<EMICheckbox
					state={state.selected}
					changeHandler={handleSelected}
					disabled={
						modelAccess === "R" ||
						modelState?.modelDetail?.isPublished ||
						updating
					}
				/>
			</TableCell>
			<TableCell>
				<AT.CellContainer>
					<AT.TableBodyText>{x.name}</AT.TableBodyText>
				</AT.CellContainer>
			</TableCell>

			{modelType === "F" && (
				<TableCell>
					<DyanamicDropdown
						dataHeader={[
							{ id: 1, name: "Name" },
							{ id: 2, name: "Description" },
						]}
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "description" },
						]}
						placeholder={`Select ${customCaption.asset}`}
						selectedValue={state.selectedAsset}
						onChange={(val) => {
							onAssetChange(val);
							setSiteAssetRefrenceData([]);
						}}
						showClear
						showHeader
						dataSource={assets}
						selectdValueToshow="name"
						count={searchCount || count}
						onPageChange={handleAssetDropPage}
						page={page}
						isReadOnly={
							!state.selected ||
							modelAccess === "R" ||
							modelState?.modelDetail?.isPublished
						}
						handleServierSideSearch={handleServierSideSearch}
						isServerSide
						fetchData={() =>
							fetchFromDropDwn(
								x.defaultSiteAssetFilter !== null
									? x.defaultSiteAssetFilter
									: ""
							)
						}
						PreloadedSearch={x.defaultSiteAssetFilter}
						cacheDropDownData={false}
					/>
				</TableCell>
			)}
			{modelType === "F" ? (
				<TableCell>
					<DyanamicDropdown
						dataSource={SiteAssetRefrenceData}
						columns={[
							{ name: "name", id: 1 },
							{ name: "description", id: 2 },
						]}
						dataHeader={[
							{ name: "Name", id: 1 },
							{ name: "Description", id: 2 },
						]}
						showHeader
						handleSort={handleSort}
						selectedValue={{
							id: x.SiteAssetReferenceID,
							name: x.siteAssetReferenceName,
						}}
						placeholder={`Select ${customCaption?.assetReference}`}
						selectdValueToshow="name"
						showClear
						onChange={(list) => changeRefrenceSiteAsset(list)}
						isReadOnly={
							// isReadOnly ||
							// selected ||
							x.id === null || x.siteAssetID === null
						}
						fetchData={() => getSiteAssetReferences(x.siteAssetID)}
					/>
				</TableCell>
			) : null}
		</TableRow>
	);
}

export default Row;
