import React, { useCallback, useContext, useState } from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ColourConstants from "helpers/colourConstants";

import { ModelContext } from "contexts/ModelDetailContext";
import {
	getSiteAssetsForZones,
	patchModelTaskZone,
} from "services/models/modelDetails/modelTaskZones";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import ZoneRow from "./ZoneRow";
import { updateModelTaskAssets } from "helpers/setModelTaskDom";

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

const useStyles = makeStyles()((theme) => ({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
		borderRightColor: "#979797",
		borderRightStyle: "solid",
		borderRightWidth: "1px",
	},
	nameRow: {
		width: "200px",
		height: "10px",
		lineHeight: "1rem",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 40,
	},
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
	},
}));

function TaskZoneListTable({
	data,
	handleSelectZone,
	siteAssset,
	fetchSiteAssest,
	siteAppId,
	setSiteAssest,
	assestCount,
	setZones,
	setOriginalZones,
	originalZones,
	customCaptions,
	isReadOnly,
	fetchSiteFromDropDown,
	fetchModelTaskZones,
	taskId,
}) {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	const [modelState] = useContext(ModelContext);
	const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });

	const {
		modelDetail: { modelType },
	} = modelState;

	const onPageChange = async (pageNo) => {
		setPage((prev) => ({ ...prev, pageNo }));
		await fetchSiteAssest(siteAppId, pageNo, page.pageSize);
	};

	const handleServierSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getSiteAssetsForZones(
					siteAppId,
					1,
					100,
					searchTxt
				);
				setSiteAssest(response.data);
			} else {
				onPageChange(1);
			}
		}, 500),
		[]
	);

	const onDropDownChange = async (zoneId, list) => {
		if (list) {
			setZones(
				data.map((z) =>
					z.id === zoneId
						? {
								...z,

								siteAssetID: list.id,
								siteAssetName: list.name,
						  }
						: z
				)
			);

			try {
				const response = await patchModelTaskZone(zoneId, [
					{ op: "replace", path: "siteAssetID", value: list.id },
					{ op: "replace", path: "SiteAssetReferenceID", value: null },
				]);
				if (response.status) {
					setOriginalZones(data);
					fetchModelTaskZones(false);
					updateModelTaskAssets(response?.data?.assets, taskId);
				} else {
					dispatch(
						showError(response?.data?.detail || "Could not add assest to zone")
					);
					setZones(originalZones);
				}
			} catch (error) {
				dispatch(
					showError(error?.response?.data || "Could not add assest to zone")
				);
				setZones(originalZones);
			}
		}
	};

	return (
		<div>
			<Table aria-label="Table" className={classes.table}>
				<AT.TableHead>
					<TableRow className={classes.tableHead}>
						<TableCell
							style={{ width: "78px" }}
							className={cx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Selected
						</TableCell>
						<TableCell
							style={{ width: "auto" }}
							className={cx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Name
						</TableCell>
						{modelType === "F" ? (
							<TableCell
								style={{ width: "auto" }}
								className={cx(classes.nameRow, {
									[classes.tableHeadRow]: true,
								})}
							>
								{customCaptions?.asset}
							</TableCell>
						) : null}
						{modelType === "F" ? (
							<TableCell
								style={{ width: "auto" }}
								className={cx(classes.nameRow, {
									[classes.tableHeadRow]: true,
								})}
							>
								{customCaptions?.assetReference}
							</TableCell>
						) : null}
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{data.length !== 0 ? (
						data.map((row) => (
							<ZoneRow
								key={row?.modelVersionZoneID}
								row={row}
								handleSelectZone={handleSelectZone}
								modelType={modelType}
								siteAssset={siteAssset}
								onPageChange={onPageChange}
								setSiteAssest={setSiteAssest}
								page={page}
								assestCount={assestCount}
								handleServierSideSearch={handleServierSideSearch}
								onDropDownChange={onDropDownChange}
								isReadOnly={isReadOnly}
								customCaptions={customCaptions}
								fetchSiteFromDropDown={fetchSiteFromDropDown}
								fetchModelTaskZones={fetchModelTaskZones}
							/>
						))
					) : (
						<TableRow>
							<TableCell>No Record Found</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default TaskZoneListTable;
