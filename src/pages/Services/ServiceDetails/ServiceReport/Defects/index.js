import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import clsx from "clsx";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles({
	tableHead: {
		backgroundColor: ColourConstants.tableBackground,
	},
	headerText: {
		fontSize: 21,
		marginTop: 10,
	},
	first: {
		fontWeight: 500,
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
const AT = TableStyle();

const Defects = ({ headers, customCaptions, data, columns }) => {
	const classes = useStyles();
	return (
		<div>
			<Typography className={classes.headerText} component="h1" gutterBottom>
				<strong>
					{customCaptions.service} {customCaptions?.defect}
				</strong>
			</Typography>
			<AT.TableContainer>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header) => (
								<TableCell
									key={header.id}
									style={{ width: header?.width || "auto" }}
									className={clsx(classes.nameRow, {
										[classes.tableHeadRow]: true,
									})}
								>
									<AT.CellContainer className="flex justify-between">
										{header.name}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{data.length !== 0 ? (
							data.map((row) => (
								<React.Fragment key={row.id}>
									<TableRow>
										{columns.map((col, i) => (
											<TableCell key={i}>{row[col]}</TableCell>
										))}
									</TableRow>
									{row.images?.length > 0 && (
										<TableRow>
											<TableCell colSpan={8}>
												<AT.TableContainer
													style={{ maxWidth: "90vw", overflowX: "auto" }}
												>
													<Table aria-label="Table">
														<AT.TableHead>
															<TableRow className={classes.tableHead}>
																<TableCell
																	style={{
																		width: "auto",
																		paddingLeft: "20px",
																	}}
																	className={clsx(classes.nameRow, {
																		[classes.tableHeadRow]: true,
																	})}
																>
																	<AT.CellContainer className="flex justify-between">
																		{customCaptions?.defect} Images
																	</AT.CellContainer>
																</TableCell>
															</TableRow>
														</AT.TableHead>
														<TableBody>
															<TableRow>
																<div
																	style={{
																		display: "flex",
																		gap: 30,
																		padding: "20px",
																	}}
																>
																	{row.images.length !== 0
																		? row.images?.map((img) => (
																				<img
																					key={img.id}
																					style={{
																						width: 150,
																						height: 150,
																						// cursor: "pointer",
																						objectFit: "contain",
																					}}
																					src={img.thumbnailURL}
																					alt=""
																				/>
																		  ))
																		: "No any Images"}{" "}
																</div>
															</TableRow>
														</TableBody>
													</Table>
												</AT.TableContainer>
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>
							))
						) : (
							<TableRow>
								{headers.map((head, i) => {
									if (i === 0) {
										return <TableCell key={head.id}>No Record Found</TableCell>;
									} else {
										return <TableCell key={head.id}></TableCell>;
									}
								})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
};

export default Defects;
