import React, { useState, useCallback, useContext } from "react";
import { TableRow, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import { getSiteAssets } from "services/clients/sites/siteAssets";
import { ModelContext } from "contexts/ModelDetailContext";

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
}) {
	const [state, setStates] = useState({
		selectedAsset: {
			name: x.siteAssetName,
			id: x.siteAssetID,
		},
		page: 1,
		selected: x.id !== null,
	});
	const [modelState] = useContext(ModelContext);
	const [searchCount, setSearchCount] = useState(null);

	const setState = (da) => setStates((th) => ({ ...th, ...da }));

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

	const handleAssetDropPage = (p, prevData) => {
		pageChange({ pNo: p, pSize: 10, search: "" }, prevData);
		setState({ page: p });
	};

	const handleSelected = () => {
		const toggle = !state.selected;
		setState({ selected: toggle });
		if (toggle) {
			postSelected();
		} else {
			deleteSelected();
		}
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
					disabled={modelAccess === "R" || modelState?.modelDetail?.isPublished}
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
						onChange={onAssetChange}
						showClear
						showHeader
						dataSource={assets}
						selectdValueToshow="name"
						count={searchCount || count}
						onPageChange={handleAssetDropPage}
						page={state.page}
						isReadOnly={
							!state.selected ||
							modelAccess === "R" ||
							modelState?.modelDetail?.isPublished
						}
						handleServierSideSearch={handleServierSideSearch}
						isServerSide
						fetchData={fetchFromDropDwn}
					/>
				</TableCell>
			)}
		</TableRow>
	);
}

export default Row;
