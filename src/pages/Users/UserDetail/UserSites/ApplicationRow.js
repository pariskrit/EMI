import React, { useEffect, useState } from "react";
import {
	FormControlLabel,
	LinearProgress,
	TableCell,
	TableRow,
} from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import IOSSwitch from "components/Elements/IOSSwitch";
import { getPositions } from "services/clients/sites/siteApplications/userPositions";
import {
	postClientUserSiteApps,
	updateClientUserSiteAppsStatus,
} from "services/users/userSites";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import DialogPopup from "components/Elements/DialogPopup";

const AT = TableStyle();

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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
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
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

function ApplicationRow({
	row,
	data,
	index,
	clientUserSiteID,
	fetchUserSites,
}) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [status, setStatus] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [position, setPosition] = useState({});
	const [openStatusChnageMessagePopup, setStatusChnageMessagePopup] = useState(
		false
	);

	useEffect(() => {
		if (row) {
			setStatus(
				row.clientUserSiteApps && row.clientUserSiteApps?.[0]?.active === true
					? true
					: false
			);
			setPosition(
				row.clientUserSiteApps
					? {
							id: row.clientUserSiteApps?.[0]?.positionID,
							name: row.clientUserSiteApps?.[0]?.positionName,
					  }
					: {}
			);
		}
	}, [row]);

	const handleChangeStatus = async (e, tg) => {
		if (
			!row.clientUserSiteApps ||
			row.clientUserSiteApps === null ||
			row.clientUserSiteApps.length === 0
		) {
			if (!position.id) {
				setStatusChnageMessagePopup(true);
				return;
			}
			try {
				setUpdatingStatus(true);

				const response = await postClientUserSiteApps({
					clientUserSiteID: +clientUserSiteID,
					siteAppID: row.id,
					positionID: position.id,
					allowAllModels: true,
				});
				if (response.status) {
					await fetchUserSites();
				} else {
					dispatch(showError(response?.data?.detail || "active status failed"));
				}
			} catch (error) {
				dispatch(showError(error?.data?.detail || "active status failed"));
			}
		} else {
			try {
				setUpdatingStatus(true);

				const response = await updateClientUserSiteAppsStatus(
					row.clientUserSiteApps?.[0].id,
					[{ op: "replace", path: "active", value: tg }]
				);
				if (response.status) {
					await fetchUserSites();
				} else {
					dispatch(showError(response?.data?.detail || "active status failed"));
				}
			} catch (error) {
				dispatch(showError(error?.data?.detail || "active status failed"));
			}
		}
		setUpdatingStatus(false);
	};

	return (
		<>
			{updatingStatus && <LinearProgress className={classes.loading} />}
			<DialogPopup
				open={openStatusChnageMessagePopup}
				closeHandler={() => setStatusChnageMessagePopup(false)}
				message="Please select Position to activate the Application"
			/>
			<TableRow key={row.id}>
				<TableCell
					component="th"
					scope="row"
					className={clsx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<img src={row?.logoURL} alt="" height={30} width={"auto"} />
					</AT.CellContainer>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					className={clsx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<DyanamicDropdown
							isServerSide={false}
							width="50%"
							// dataHeader={[{ id: 1, name: "Operating Mode" }]}
							columns={[{ id: 1, name: "name" }]}
							// dataSource={dropDownDatas?.operatingModes}
							// showHeader
							selectedValue={position}
							placeholder="Select Position"
							handleSort={handleSort}
							onChange={(val) => setPosition(val)}
							selectdValueToshow="name"
							// isReadOnly={isReadOnly || isPublished}
							// disabled={isUpdating?.operatingModeID}
							// label={"Department"}
							fetchData={() => getPositions(row.id)}
						/>
					</AT.CellContainer>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					className={clsx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<FormControlLabel
							className={classes.statusSwitch}
							control={
								<IOSSwitch
									currentStatus={status}
									onChange={(e) => handleChangeStatus(e, !status)}
									name="status"
								/>
							}
							// label={
							// 	true ? (
							// 		<Typography
							// 			className={classes.activeStatusSwitchText}
							// 		>
							// 			Active
							// 		</Typography>
							// 	) : (
							// 		<Typography
							// 			className={classes.inactiveStatusSwitchText}
							// 		>
							// 			Inactive
							// 		</Typography>
							// 	)
							// }
						/>
					</AT.CellContainer>
				</TableCell>
			</TableRow>
		</>
	);
}

export default ApplicationRow;
