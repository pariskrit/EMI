import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,
	Typography,
	Dialog,
	CircularProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useNavigate } from "react-router-dom";
import { appPath, modelsPath } from "helpers/routePaths";
import { isoDateWithoutTimeZone } from "helpers/utils";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles()((theme) => ({
	row: {
		cursor: "pointer",
		"&:hover": {
			background: "#d7d7d7",
		},
	},
	icon: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		margin: "0 5px 0px 5px",
		display: "flex",
		alignItems: "center",
	},
	cell: {
		display: "flex",
		width: "152px",
		alignItems: "center",
	},
}));
const VersionListTable = ({
	versions,
	open,
	closeHandler,
	isLoading,
	activeModelVersion,
}) => {
	const { classes, cx } = useStyles();
	const navigate = useNavigate();
	return (
		<Dialog
			open={open}
			onClose={closeHandler}
			className="medium-application-dailog"
		>
			<div style={{ margin: 20, minWidth: 500, minHeight: 300 }}>
				<Typography variant="h6">Versions</Typography>
				{isLoading ? (
					<div style={{ margin: "20px 0" }}>
						<CircularProgress />
					</div>
				) : (
					<Table>
						<TableHead>
							<TableRow>
								<TableCell style={{ whiteSpace: "nowrap" }}>
									Version Number
								</TableCell>
								<TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
								<TableCell style={{ whiteSpace: "nowrap" }}>
									Modified By
								</TableCell>
								<TableCell style={{ whiteSpace: "nowrap" }}>
									Modified Date
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{versions?.map((version, i) => (
								<TableRow
									key={i}
									className={classes.row}
									onClick={() =>
										navigate(`${appPath}${modelsPath}/${version?.id}`)
									}
								>
									<TableCell
										style={{
											color: "rgb(17, 100, 206)",
											cursor: "pointer",
										}}
									>
										{version?.version}
									</TableCell>
									<TableCell className={classes.cell}>
										<div
											className={`${classes.icon} flex`}
											style={{
												backgroundColor: !version?.isPublished
													? ColourConstants.orange
													: activeModelVersion === version?.version
													? ColourConstants.green
													: ColourConstants.red,
											}}
										></div>
										<p>{version?.statusName}</p>
									</TableCell>
									<TableCell>{version?.displayName}</TableCell>
									<TableCell>
										{/* {changeDateFormat(version.modifiedDateTime)} */}
										{isoDateWithoutTimeZone(version?.modifiedDateTime)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</Dialog>
	);
};

export default VersionListTable;
