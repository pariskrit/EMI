/* eslint-disable no-unused-expressions */
import React, { useState, useContext } from "react";
import TableRow from "@material-ui/core/TableRow";
import { Collapse, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as BlueMenuIcon } from "assets/icons/3dot-icon.svg";
import { ReactComponent as WhiteMenuIcon } from "assets/icons/3dot-white-icon.svg";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { modelServiceLayout, modelsPath } from "helpers/routePaths";
import ModelTaskExpand from "./ModelTaskExpand";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSingleModelTask } from "services/models/modelDetails/modelTasks";
import useDidMountEffect from "hooks/useDidMountEffect";
import ErrorIcon from "@material-ui/icons/Error";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { ModelContext } from "contexts/ModelDetailContext";

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
	handleDelete,
	modelId,
	handleDuplicate,
	handleCopy,
	handleCopyTaskQuestion,
	customCaptions,
	access,
	isMounted,
}) => {
	const [toggle, setToggle] = useState(false);
	const [singleTask, setSingleTask] = useState({});
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const [, CtxDispatch] = useContext(TaskContext);
	const [, ModelCtxDispatch] = useContext(ModelContext);

	const toolTipColumn = ["intervals", "zones", "stages", "roles"];

	const history = useHistory();

	const onHandleTableExpand = async (tg, rowId) => {
		setToggle(tg);

		// call single task detail api only if expand is true
		if (tg) {
			!isMounted.aborted && setLoading(true);
			try {
				const response = await getSingleModelTask(rowId);
				if (response.status) {
					if (!isMounted.aborted) {
						setSingleTask(response.data[0]);
						CtxDispatch({ type: "SET_TASK_DETAIL", payload: response.data[0] });
						ModelCtxDispatch({
							type: "TASK_DETAIL",
							payload: response.data[0],
						});
					}
				} else {
					dispatch(showError(response?.data?.title || "something went wrong"));
				}
			} catch (error) {
				dispatch(showError(error?.response?.data || "something went wrong"));
			} finally {
				!isMounted.aborted && setLoading(false);
			}
		}
	};

	useDidMountEffect(() => {
		if (toggle) {
			document
				.querySelectorAll(`#taskExpandable${row.id}  > td > div > img`)
				?.forEach((i) => {
					i.classList.add("white-filter");
				});
		} else {
			// eslint-disable-next-line no-unused-expressions
			document
				.querySelectorAll(`#taskExpandable${row.id}  > td > div > img`)
				?.forEach((i) => {
					i.classList.remove("white-filter");
				});
		}
	}, [toggle]);

	return (
		<>
			<TableRow
				onClick={() => onHandleTableExpand(!toggle, row?.id)}
				style={{
					background: toggle ? " #307AD7" : "#FFFFFF",
					borderBottom: "hidden",
					color: toggle ? "#FFFFFF" : "",
				}}
				id={`taskExpandable${row.id}`}
			>
				{columns.map((col, i, arr) => (
					<TableCell
						key={col}
						className={classes.dataCell}
						style={{
							padding: "7px 10px",
							maxWidth: "200px",
							color: toggle ? "#FFFFFF" : "",
						}}
						id={`dataCell${col}`}
					>
						<AT.CellContainer key={col}>
							{/* <AT.TableBodyText style={{ color: toggle ? "#FFFFFF" : "" }}> */}
							{toolTipColumn.includes(col) ? (
								<HtmlTooltip title={row[col]}>
									<p
										className="max-two-line"
										style={{ color: toggle ? "#FFFFFF" : "" }}
									>
										{" "}
										{row[col]}
									</p>
								</HtmlTooltip>
							) : col === "errors" ? (
								row[col] === "" ? (
									""
								) : (
									<ErrorIcon style={{ color: toggle ? "#FFFFFF" : "red" }} />
								)
							) : (
								row[col]
							)}
							{/* </AT.TableBodyText> */}

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
									{access === "F" || access === "E" ? (
										<AT.TableMenuButton>
											{toggle ? <WhiteMenuIcon /> : <BlueMenuIcon />}
										</AT.TableMenuButton>
									) : null}

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
												handler: () => onHandleTableExpand(!toggle, row?.id),
												isDelete: false,
											},
											{
												name: "Duplicate",
												handler: () => handleDuplicate(row),
												isDelete: false,
											},
											{
												name: "Copy",
												handler: () => handleCopy(row.id),
												isDelete: false,
											},
											{
												name: `Copy ${customCaptions?.task} ${customCaptions?.questionPlural}`,
												handler: () => handleCopyTaskQuestion(row.id),
												isDelete: false,
											},
											{
												name: "Switch To Service Layout",
												handler: () =>
													history.push(
														`${modelsPath}/${modelId}${modelServiceLayout}`,
														{ state: { ModelVersionTaskID: row.id } }
													),
												isDelete: false,
											},
											{
												name: "Delete",
												handler: () => handleDelete(row.id),
												isDelete: true,
											},
										].filter((x) => {
											if (access === "F") return true;
											if (access === "E") {
												if (x.name === "Edit") return true;
												else return false;
											}
											return false;
										})}
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
						<ModelTaskExpand
							customCaptions={customCaptions}
							taskInfo={singleTask}
							taskLoading={loading}
							access={access}
						/>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default withMount(ModelTaskRow);
