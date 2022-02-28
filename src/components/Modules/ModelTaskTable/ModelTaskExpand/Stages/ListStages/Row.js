import React, { useState } from "react";
import { TableRow, FormGroup, FormControlLabel } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";

const AT = TableStyle();

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
}) {
	const [state, setStates] = useState({
		selectedAsset: {
			name: x.siteAssetName,
			id: x.siteAssetID,
		},
		page: 1,
		selected: x.id !== null,
	});

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

	return (
		<TableRow>
			<AT.DataCell style={{ width: "5%" }}>
				<FormGroup style={{ paddingLeft: 10 }}>
					<FormControlLabel
						control={
							<EMICheckbox
								state={state.selected}
								changeHandler={handleSelected}
								disabled={modelAccess === "R"}
							/>
						}
						label={""}
					/>
				</FormGroup>
			</AT.DataCell>
			<AT.DataCell style={{ width: "15%" }}>
				<AT.CellContainer>
					<AT.TableBodyText>{x.name}</AT.TableBodyText>
				</AT.CellContainer>
			</AT.DataCell>

			{modelType === "F" && (
				<AT.DataCell style={{ width: "30%" }}>
					<DyanamicDropdown
						dataHeader={[
							{ id: 1, name: "Name" },
							{ id: 2, name: "Description" },
						]}
						columns={[
							{ id: 1, name: "name" },
							{ id: 2, name: "Description" },
						]}
						width="100%"
						selectedValue={state.selectedAsset}
						onChange={onAssetChange}
						dataSource={assets}
						selectdValueToshow="name"
						count={count}
						onPageChange={handleAssetDropPage}
						page={state.page}
						disabled={!state.selected || modelAccess === "R"}
					/>
				</AT.DataCell>
			)}
		</TableRow>
	);
}

export default Row;
