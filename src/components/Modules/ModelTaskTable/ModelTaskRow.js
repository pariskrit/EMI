import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import { Collapse, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as BlueMenuIcon } from "assets/icons/3dot-icon.svg";
import { ReactComponent as WhiteMenuIcon } from "assets/icons/3dot-white-icon.svg";
import ModelTaskExpand from "./ModelTaskExpand";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const AT = TableStyle();

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

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
	component: Component,
}) => {
	const [toggle, setToggle] = useState(false);
	const toolTipColumn = ["Intervals", "Zones", "Stages"];
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
						className={classes.dataCell}
						style={{ padding: "7px 10px" }}
					>
						<AT.CellContainer key={col}>
							<AT.TableBodyText style={{ color: toggle ? "#FFFFFF" : "" }}>
								{toolTipColumn.includes(col) ? (
									<HtmlTooltip title={row[col]}>
										<p className="max-two-line"> {row[col]}</p>
									</HtmlTooltip>
								) : (
									row[col]
								)}
							</AT.TableBodyText>

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
												name: "Duplicate",
												handler: handleEdit,
												isDelete: false,
											},
											{
												name: "Copy",
												handler: handleEdit,
												isDelete: false,
											},
											{
												name: "Copy Task Questions",
												handler: handleEdit,
												isDelete: false,
											},
											{
												name: "Switch To Service Layout",
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
					colSpan={18}
				>
					<Collapse in={toggle} timeout="auto" unmountOnExit>
						<Component />
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default ModelTaskRow;
