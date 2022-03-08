import React from "react";
import TableRow from "@material-ui/core/TableRow";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import PopupMenu from "components/Elements/PopupMenu";
import TableStyle from "styles/application/TableStyle";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

const AT = TableStyle();

const Row = ({
	index,
	provider,
	row,
	columns,
	setAnchorEl,
	setSelectedData,
	selectedData,
	anchorEl,
	menuData,
	isModelEditable,
}) => (
	<TableRow key={index} {...provider.draggableProps} ref={provider.innerRef}>
		{columns.map((col, i, arr) => (
			<AT.DataCell key={col.id} style={col?.style}>
				<AT.CellContainer key={col}>
					<AT.TableBodyText>
						{i === 0 ? (
							<span
								style={{
									display: "flex",
									flexDirection: "space-around",
									alignItems: "center",
									gap: 10,
								}}
							>
								{isModelEditable && (
									<span
										{...provider.dragHandleProps}
										ref={provider.innerRef}
										className="flex"
									>
										<DragIndicatorIcon />
									</span>
								)}

								<span style={{ marginTop: "2.5px" }}>{row[col.name]}</span>
							</span>
						) : (
							row[col.name]
						)}
					</AT.TableBodyText>

					{arr.length === i + 1
						? isModelEditable && (
								<AT.DotMenu
									onClick={(e) => {
										setAnchorEl(
											anchorEl === e.currentTarget ? null : e.currentTarget
										);
										setSelectedData(
											anchorEl === e.currentTarget ? null : index
										);
									}}
								>
									{menuData.length > 0 && (
										<AT.TableMenuButton>
											<MenuIcon />
										</AT.TableMenuButton>
									)}

									<PopupMenu
										index={index}
										selectedData={selectedData}
										anchorEl={anchorEl}
										id={row.id}
										clickAwayHandler={() => {
											setAnchorEl(null);
											setSelectedData(null);
										}}
										menuData={menuData}
									/>
								</AT.DotMenu>
						  )
						: null}
				</AT.CellContainer>
			</AT.DataCell>
		))}
	</TableRow>
);
export default React.memo(Row);
