import { TableCell, TableRow } from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import { handleSort } from "helpers/utils";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSiteAssetReferences } from "services/clients/sites/siteAssets";
import { patchModelTaskZone } from "services/models/modelDetails/modelTaskZones";

function ZoneRow({
	row,
	handleSelectZone,
	modelType,
	siteAssset,
	onPageChange,
	setSiteAssest,
	page,
	assestCount,
	handleServierSideSearch,
	onDropDownChange,
	isReadOnly,
	customCaptions,
	fetchSiteFromDropDown,
	fetchModelTaskZones,
}) {
	const [selected, setSelected] = useState(false);
	const [SiteAssetRefrenceData, setSiteAssetRefrenceData] = useState([]);
	const dispatch = useDispatch();

	const changeRefrenceSiteAsset = async (assetReference) => {
		try {
			const response = await patchModelTaskZone(row.id, [
				{
					op: "replace",
					path: "SiteAssetReferenceID",
					value: assetReference.id,
				},
			]);
			if (response.status) {
				fetchModelTaskZones(false);
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
		<TableRow style={{ height: "100%" }}>
			<TableCell
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: modelType !== "F" ? "100%" : 113,
				}}
			>
				<EMICheckbox
					state={row?.id ? true : false}
					changeHandler={(e) =>
						handleSelectZone(row.modelVersionZoneID, setSelected)
					}
					disabled={selected || isReadOnly}
				/>
			</TableCell>
			<TableCell>{row.name}</TableCell>
			{modelType === "F" ? (
				<TableCell>
					<DyanamicDropdown
						dataSource={siteAssset}
						columns={[
							{ name: "name", id: 1 },
							{ name: "description", id: 2 },
						]}
						dataHeader={[
							{ name: "Name", id: 1 },
							{ name: "Description", id: 2 },
						]}
						showHeader
						onPageChange={onPageChange}
						isServerSide
						handleServerSideSort={(field, method) =>
							handleSort(siteAssset, setSiteAssest, field, method)
						}
						page={page}
						count={assestCount}
						handleServierSideSearch={handleServierSideSearch}
						selectedValue={
							row.siteAssetID
								? { id: row.siteAssetID, name: row.siteAssetName }
								: {}
						}
						placeholder={`Select ${customCaptions?.asset}
						`}
						selectdValueToshow="name"
						showClear
						onChange={(list) => {
							onDropDownChange(row.id, list);
							setSiteAssetRefrenceData([]);
						}}
						isReadOnly={isReadOnly || selected || row.id === null}
						fetchData={() =>
							fetchSiteFromDropDown(
								row.defaultSiteAssetFilter !== null
									? row.defaultSiteAssetFilter
									: ""
							)
						}
						PreloadedSearch={row.defaultSiteAssetFilter}
						cacheDropDownData={false}
					/>
				</TableCell>
			) : null}
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
							id: row.SiteAssetReferenceID,
							name: row.siteAssetReferenceName,
						}}
						placeholder={`Select ${customCaptions?.assetReference}`}
						selectdValueToshow="name"
						showClear
						onChange={(list) => changeRefrenceSiteAsset(list)}
						isReadOnly={
							isReadOnly ||
							selected ||
							row.id === null ||
							row.siteAssetID === null
						}
						fetchData={() => getSiteAssetReferences(row.siteAssetID)}
					/>
				</TableCell>
			) : null}
		</TableRow>
	);
}

export default ZoneRow;
