import React, { useState } from "react";
import TableStyle from "styles/application/TableStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import clsx from "clsx";
import ImageViewer from "components/Elements/ImageViewer";

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
	imageRow: {
		display: "flex",
	},
});

function ServiceDefectsTable({ data, headers, columns, customCaptions }) {
	const classes = useStyles();

	const [openImageViewer, setOpenImageViewer] = useState(false);
	const [imagetoView, setImageToview] = useState("");

	return (
		<>
			<ImageViewer
				open={openImageViewer}
				onClose={() => setOpenImageViewer(false)}
				imgSource={imagetoView}
			/>
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
																						cursor: "pointer",
																						objectFit: "contain",
																					}}
																					src={img.thumbnailURL}
																					alt=""
																					onClick={() => {
																						setImageToview(img.imageURL);
																						setOpenImageViewer(true);
																					}}
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
		</>
	);
}

export default ServiceDefectsTable;
