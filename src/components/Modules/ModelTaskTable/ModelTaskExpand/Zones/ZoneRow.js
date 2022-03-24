import { TableCell, TableRow } from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import { handleSort } from "helpers/utils";
import React, { useState } from "react";

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
}) {
	const [selected, setSelected] = useState(false);

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
						onChange={(list) => onDropDownChange(row.id, list)}
						isReadOnly={isReadOnly || selected || row.id === null}
					/>
				</TableCell>
			) : null}
		</TableRow>
	);
}

export default ZoneRow;
