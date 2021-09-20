import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import IOSSwitch from "components/Elements/IOSSwitch";
import { Link, useParams } from "react-router-dom";
import { siteApplicationDetailsPath } from "helpers/routePaths";

const Row = ({ row, classes, onDeleteApp, onChangeApp, showDeleteIcon }) => {
	const { clientId, id } = useParams();

	return (
		<TableRow>
			<TableCell>
				<Link to={`/clients/${clientId}/sites/${id}/applications/${row.id}`}>
					<span className={classes.appName}>{row.name}</span>
				</Link>
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
