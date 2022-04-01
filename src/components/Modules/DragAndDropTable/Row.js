import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import reorder from "assets/reorder.png";
import PopupMenu from "components/Elements/PopupMenu";
import TableStyle from "styles/application/TableStyle";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

const AT = TableStyle();

const Row = ({ index, provider, row, columns, menuData, isModelEditable }) => {
	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	return (
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
									<span
										{...provider.dragHandleProps}
										ref={provider.innerRef}
										className="flex"
									>
										<img src={reorder} alt="" height={18} width={18} />
									</span>

									<span style={{ marginTop: "2.5px", marginLeft: "10px" }}>
										{row[col.name]}
									</span>
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
};
export default React.memo(Row);
