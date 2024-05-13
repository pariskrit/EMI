import { TableCell, TableRow } from "@mui/material";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/Elements/IOSSwitch";
import { READONLY_ACCESS } from "constants/AccessTypes/AccessTypes";
import { RESELLER_ID } from "constants/UserConstants/indes";
import roles from "helpers/roles";
import {
	appPath,
	applicationPath,
	clientsPath,
	siteAppDetailPath,
} from "helpers/routePaths";
import { getLocalStorageData } from "helpers/utils";
import React from "react";
import { Link, useParams } from "react-router-dom";

const Row = ({
	row,
	classes,
	onDeleteApp,
	onChangeApp,
	showDeleteIcon,
	redirect,
}) => {
	const { clientId, id } = useParams();

	const { position, siteAppID, adminType, role } = getLocalStorageData("me");

	return (
		<TableRow>
			<TableCell>
				{redirect ? (
					<Link
						to={`${appPath}${clientsPath}/${clientId}/sites/${id}${applicationPath}/${row.id}/${siteAppDetailPath}`}
					>
						<span className={classes.appName}>{row.name}</span>
					</Link>
				) : (
					<span>{row.name}</span>
				)}
			</TableCell>
			{showDeleteIcon && <TableCell>{row.totalSites}</TableCell>}
			<TableCell
				style={{
					paddingLeft: 90,
					width: "245px",
				}}
			>
				<div className="flex">
					<IOSSwitch
						color={true}
						onChange={onChangeApp}
						currentStatus={row.isActive}
						disable={
							(siteAppID && position.settingsAccess === READONLY_ACCESS) ||
							adminType === RESELLER_ID ||
							role === roles.clientAdmin
						}
					/>
					&nbsp;
					{!row.isActive && showDeleteIcon ? (
						<DeleteIcon className={classes.deleteIcon} onClick={onDeleteApp} />
					) : (
						<div style={{ width: "32px" }}></div>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
};

export default Row;
