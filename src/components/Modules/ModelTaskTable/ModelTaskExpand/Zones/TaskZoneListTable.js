import React, { useCallback, useContext, useState } from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import clsx from "clsx";
import { ModelContext } from "contexts/ModelDetailContext";
import {
	getSiteAssetsForZones,
	patchModelTaskZone,
} from "services/models/modelDetails/modelTaskZones";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import ZoneRow from "./ZoneRow";

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

const useStyles = makeStyles({
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
});

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
}) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [modelState] = useContext(ModelContext);
	const [page, setPage] = useState(1);

	const {
		modelDetail: { modelType },
	} = modelState;

	const onPageChange = async (pageSize) => {
		setPage(pageSize);
		await fetchSiteAssest(siteAppId, pageSize, 10);
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
				]);
				if (response.status) {
					setOriginalZones(data);
				} else {
					dispatch(
						showError(response?.data?.title || "Could not add assest to zone")
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
							className={clsx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Selected
						</TableCell>
						<TableCell
							style={{ width: "auto" }}
							className={clsx(classes.nameRow, {
								[classes.tableHeadRow]: true,
							})}
						>
							Name
						</TableCell>
						{modelType === "F" ? (
							<TableCell
								style={{ width: "auto" }}
								className={clsx(classes.nameRow, {
									[classes.tableHeadRow]: true,
								})}
							>
								{customCaptions?.asset}
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
