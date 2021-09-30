import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/Elements/IOSSwitch";
import {
	applicationListPath,
	clientsPath,
	siteAppDetailPath,
} from "helpers/routePaths";
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

	return (
		<TableRow>
			<TableCell>
				{redirect ? (
					<Link
						to={`${clientsPath}/${clientId}/sites/${id}${applicationListPath}/${
							row.id + siteAppDetailPath
						}`}
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
					<IOSSwitch onChange={onChangeApp} currentStatus={row.isActive} />{" "}
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
