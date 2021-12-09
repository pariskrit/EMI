import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import { Collapse, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as BlueMenuIcon } from "assets/icons/3dot-icon.svg";
import { ReactComponent as WhiteMenuIcon } from "assets/icons/3dot-white-icon.svg";
import ModelTaskExpand from "./ModelTaskExpand";

const AT = TableStyle();

const ModelTaskRow = ({
	classes,
	index,
	columns,
	setAnchorEl,
	anchorEl,
	setSelectedData,
	selectedData,
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
					<TableCell key={col} className={classes.dataCell}>
						<AT.CellContainer key={col}>
							<AT.TableBodyText
								style={{ color: toggle ? "#FFFFFF" : "" }}
							>{`${row[col]}`}</AT.TableBodyText>

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
										{toggle ? <WhiteMenuIcon /> : <BlueMenuIcon />}
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
						<ModelTaskExpand />
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default ModelTaskRow;
