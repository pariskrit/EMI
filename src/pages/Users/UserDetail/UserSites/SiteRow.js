import React, { useEffect, useState } from "react";
import {
	Collapse,
	FormControlLabel,
	LinearProgress,
	TableCell,
	TableRow,
} from "@mui/material";
import TableStyle from "styles/application/TableStyle";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";

import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import DyanamicDropdown from "components/Elements/DyamicDropdown";
import IOSSwitch from "components/Elements/IOSSwitch";
import UserSiteApplicationListTable from "./siteApplicationListTable";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import {
	deleteClientUserSite,
	postClientUserSite,
} from "services/users/userSites";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import DialogPopup from "components/Elements/DialogPopup";

const AT = TableStyle();

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
}));

function SiteRow({ row, data, index, clientUserID, fetchUserSites }) {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	const [toogle, setToogle] = useState(false);
	const [status, setStatus] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState({});
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [openStatusChnageMessagePopup, setStatusChnageMessagePopup] = useState(
		false
	);

	useEffect(() => {
		if (row) {
			setStatus(row.clientUserSite === null ? false : true);
			setSelectedDepartment(
				row.clientUserSite === null
					? {}
					: {
							id: row.clientUserSite.id,
							name: row.clientUserSite.siteDepartmentName,
					  }
			);
			setToogle(row.clientUserSite === null ? false : true);
		}
	}, [row]);

	const handleChangeStatus = async (e, tg) => {
		if (tg && !selectedDepartment.id) {
			setStatusChnageMessagePopup(true);
			return;
		}
		setUpdatingStatus(true);
		if (tg) {
			try {
				const response = await postClientUserSite({
					clientUserID,
					siteID: row.id,
					siteDepartmentID: selectedDepartment.id,
				});
				if (response.status) {
					// setToogle(true);
					// setStatus(tg);
					await fetchUserSites();
				} else {
					setToogle(false);
					dispatch(showError(response?.data?.detail || "active status failed"));
				}
			} catch (error) {
				setToogle(false);
				dispatch(
					showError(error?.response?.data?.detail || "active status failed")
				);
			}
		} else {
			try {
				const response = await deleteClientUserSite(row.clientUserSite.id);
				if (response.status) {
					await fetchUserSites();
					// setToogle(false);
					// setStatus(tg);
				} else {
					setToogle(true);
					dispatch(showError(response?.data?.title || "active status failed"));
				}
			} catch (error) {
				setToogle(true);
				dispatch(
					showError(error?.response?.data?.detail || "active status failed")
				);
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
				message="Please select Department to activate the Site"
			/>
			<TableRow key={row.id}>
				<TableCell
					component="th"
					scope="row"
					className={cx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<AT.TableBodyText>{row["name"]}</AT.TableBodyText>
					</AT.CellContainer>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					className={cx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<DyanamicDropdown
							isServerSide={false}
							width="50%"
							dataHeader={[
								{ id: 1, name: "Department" },
								{ id: 2, name: "Location" },
							]}
							columns={[
								{ id: 1, name: "name" },
								{ id: 2, name: "description" },
							]}
							showHeader
							selectedValue={selectedDepartment}
							placeholder="Select Department"
							handleSort={handleSort}
							onChange={(val) => setSelectedDepartment(val)}
							selectdValueToshow="name"
							// isReadOnly={!status}
							// disabled={isUpdating?.operatingModeID}
							fetchData={() => getSiteDepartments(row.id)}
						/>
					</AT.CellContainer>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					className={cx(classes.dataCell, classes.nameRow, {
						[classes.lastCell]: index === data.length - 1,
					})}
				>
					<AT.CellContainer key={row.id}>
						<FormControlLabel
							className={classes.statusSwitch}
							control={
								<IOSSwitch
									currentStatus={status}
									onChange={(e) => handleChangeStatus(e, !toogle)}
									name="status"
								/>
							}
						/>
					</AT.CellContainer>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{
						paddingBottom: 0,
						paddingTop: 0,
					}}
					colSpan={18}
				>
					<Collapse in={toogle} timeout="auto" unmountOnExit>
						<UserSiteApplicationListTable
							data={row?.siteApps || []}
							clientUserSiteID={row?.clientUserSite?.id}
							fetchUserSites={fetchUserSites}
							columns={["name", "Position", "Active"]}
							headers={[
								{ id: 1, name: "Application", width: "20vw" },
								{
									width: "40vw",
									id: 2,
									name: `Position`,
								},
								{
									id: 3,
									name: `Active`,
									width: "10vw",
								},
							]}
						/>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default SiteRow;
