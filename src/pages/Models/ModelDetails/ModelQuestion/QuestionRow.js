/* eslint-disable no-unused-expressions */
import React, { useState, memo, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import { TableCell } from "@mui/material";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "tss-react/mui";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import withMount from "components/HOC/withMount";
import { QuestionColumn } from "constants/modelDetails";

const AT = TableStyle();

const QuestioRow = ({ row, classes, index, data, menuData }) => {
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const useStyles = makeStyles()((theme) => ({}));
	const { cx } = useStyles();
	const questionRow = useMemo(() => {
		return (
			<>
				<TableRow key={row.id} id={`row${row?.id}`} className="rowEl">
					{QuestionColumn.map(({ name: col }, i, arr) => (
						<TableCell
							key={col}
							scope="row"
							className={cx(classes.dataCell, classes.nameRow, {
								[classes.lastCell]: index === data.length - 1,
							})}
						>
							<AT.CellContainer key={col}>
								<AT.TableBodyText>{row[col]}</AT.TableBodyText>
								{arr.length === i + 1 ? (
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
											isLast={index === data.length - 1}
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
								) : null}
							</AT.CellContainer>
						</TableCell>
					))}
				</TableRow>
			</>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [row, anchorEl, selectedData, index, data, menuData]);

	return <>{questionRow}</>;
};

export default memo(withMount(QuestioRow));
