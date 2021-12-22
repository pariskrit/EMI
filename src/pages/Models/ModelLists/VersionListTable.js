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
	makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { modelsPath } from "helpers/routePaths";
import { changeDateFormat } from "helpers/utils";

const useStyles = makeStyles({
	row: {
		cursor: "pointer",
		"&:hover": {
			background: "#d7d7d7",
		},
	},
});
const VersionListTable = ({ versions, open, closeHandler, isLoading }) => {
	const style = useStyles();
	const history = useHistory();
	return (
		<Dialog open={open} onClose={closeHandler}>
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
								<TableCell style={{ whiteSpace: "nowrap" }}>
									IsPublished
								</TableCell>
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
									className={style.row}
									onClick={() => history.push(`${modelsPath}/${version.id}`)}
								>
									<TableCell>{version.version}</TableCell>
									<TableCell>{version.isPublished ? "Yes" : "No"}</TableCell>
									<TableCell>{version.displayName}</TableCell>
									<TableCell>
										{changeDateFormat(version.modifiedDateTime)}
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
