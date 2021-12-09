import React, { useState } from "react";
import clsx from "clsx";
import TableRow from "@material-ui/core/TableRow";
import { Box, Collapse, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

const AT = TableStyle();

const ModelTaskRow = ({
	classes,
	index,
	columns,
	setAnchorEl,
	anchorEl,
	setSelectedData,
	selectedData,
	data,
	row,
	handleEdit,
	handleDelete,
}) => {
	const [toggle, setToggle] = useState(false);
	return (
		<>
			<TableRow
				onClick={() => setToggle(!toggle)}
				style={{
					background: toggle ? " #307AD7" : "#FFFFFF",
					borderBottom: "hidden",
				}}
			>
				{columns.map((col, i, arr) => (
					<TableCell
						key={col}
						className={clsx(classes.dataCell, {
							[classes.lastCell]: index === data.length - 1,
						})}
					>
						<AT.CellContainer key={col}>
							<AT.TableBodyText>{`${row[col]}`}</AT.TableBodyText>

							{arr.length === i + 1 ? (
								<AT.DotMenu
									onClick={(e) => {
										e.stopPropagation();
										setAnchorEl(
											anchorEl === e.currentTarget ? null : e.currentTarget
										);
										setSelectedData(
											anchorEl === e.currentTarget ? null : index
										);
									}}
								>
									<AT.TableMenuButton>
										<MenuIcon style={{ background: toggle ? "#FFFFFF" : "" }} />
									</AT.TableMenuButton>

									<PopupMenu
										index={index}
										selectedData={selectedData}
										anchorEl={anchorEl}
										id={row.id}
										clickAwayHandler={() => {
											setAnchorEl(null);
											setSelectedData(null);
										}}
										menuData={[
											{
												name: "Edit",
												handler: handleEdit,
												isDelete: false,
											},
											{
												name: "Delete",
												handler: handleDelete,
												isDelete: true,
											},
										]}
									/>
								</AT.DotMenu>
							) : null}
						</AT.CellContainer>
					</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0, background: "#307AD7" }}
					colSpan={11}
				>
					<Collapse in={toggle} timeout="auto" unmountOnExit>
						<div style={{ background: "#FFFFFF" }}>
							<h1>Hello world</h1>
						</div>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default ModelTaskRow;
