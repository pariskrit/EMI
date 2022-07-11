import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NotesRow from "./NoteRow";
import ColourConstants from "helpers/colourConstants";
import TableStyle from "styles/application/TableStyle";

const AT = TableStyle();

const useStyles = makeStyles({
	tableHead: {
		backgroundColor: "#D2D2D9",
	},
	headerText: {
		fontSize: 21,
		marginTop: 10,
	},
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
});

const Notes = ({ data }) => {
	const classes = useStyles();
	return (
		<div>
			<Typography className={classes.headerText} component="h1" gutterBottom>
				<strong>Notes</strong>
			</Typography>
			<AT.TableContainer>
				<Table>
					<TableHead className={classes.tableHead}>
						<TableRow className={classes.tableHeadRow}>
							<TableCell
								className={classes.tableHeadRow}
								style={{ width: "300px" }}
							>
								Name
							</TableCell>
							<TableCell
								className={classes.tableHeadRow}
								style={{ width: "300px" }}
							>
								Date
							</TableCell>
							<TableCell className={classes.tableHeadRow}>Note</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.length > 0 ? (
							data.map((row) => (
								<NotesRow key={row.id} row={row} classes={classes} />
							))
						) : (
							<TableRow>
								<TableCell>No Records Found</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
};

export default Notes;
