import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Drawer from "@mui/material/Drawer";
import RestoreIcon from "@mui/icons-material/Restore";
import CloseIcon from "@mui/icons-material/Close";
import SideBarElement from "./SideBarElement";
import { useDispatch } from "react-redux";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { CircularProgress } from "@mui/material";
import useInfiniteScrollWithoutCount from "hooks/useInfiniteScrollWithoutCount";

import { defaultPageSize } from "helpers/utils";
import TaskSubTable from "./TaskSubTable";

const useStyles = makeStyles()((theme) => ({
	container: {
		display: "flex",
		flexDirection: "column",
	},
	paper: {
		minWidth: 400,
		maxWidth: 500,
		overflowY: "hidden",
	},
	title: {
		padding: "10px",
		color: "#FFFFFF",
		backgroundColor: "#186CE9",
		display: "flex",
		justifyContent: "space-between",
	},
	titleWrapper: {
		display: "flex",
		alignItems: "center",
	},
	titleText: {
		fontSize: "22px",
		fontWeight: "500",
		marginLeft: "10px",
	},
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "28px",
		width: "28px",
		color: "#FFFFFF",
	},
	restoreBtn: {
		border: "none",
		backgroundColor: "#186CE9",
	},
	closeBtn: {
		border: "none",
		color: "#FFFFFF",
		backgroundColor: "transparent",
	},
	closeIcon: {
		"&:hover": {
			cursor: "pointer",
		},
	},
	loadingIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginTop: "10px",
	},
	historyBody: {
		overflowY: "auto",
		height: "100vh",
		paddingBottom: "50px",
	},
	historyBorder: {
		border: "1.5px solid",
		borderColor: "rgba(214, 212, 210,0.5)",
		width: "90%",
	},
	root: {},
}));

export default function HistoryBar({
	id,
	showhistorybar,
	dispatch,
	fetchdata,
	OnAddItemClick,
	hasSubTable = false,
	isQuestion = false,
	origin,
	statuses,
}) {
	const { classes, cx } = useStyles();
	const reduxDispatch = useDispatch();
	const [history, SetHistory] = useState([]);
	const [IsLoading, setLoading] = useState(false);
	const [scrollEvent, setScrollEvent] = useState(window);
	const [page, setPage] = useState(1);
	const [hasMore, sethasMore] = useState(true);

	const histroyBodyRef = useRef(null);

	const { loading, gotoTop, hasMoreRef } = useInfiniteScrollWithoutCount(
		async (pageSize) => await onPageChange(pageSize + 1),
		page,
		scrollEvent,
		"history-body-scroll"
	);

	const onPageChange = async (p) => {
		try {
			const response = await fetchdata(id, p, defaultPageSize());
			if (response.status) {
				setPage(p);
				const finalData = response.data.map((d) => {
					return {
						...d,
						newValues: d?.newValues ? JSON.parse(d.newValues) : null,
						oldValues: d?.oldValues ? JSON.parse(d.oldValues) : null,
					};
				});
				SetHistory((prev) => [...prev, ...finalData]);
				if (response.data.length === 0) {
					sethasMore(false);
				}
				return response.data;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			reduxDispatch(showError("Could not fetch data"));
			return err;
		}
	};

	useEffect(() => {
		if (fetchdata && showhistorybar) {
			setLoading(true);
			fetchdata(id, 1, defaultPageSize())
				.then((response) => {
					if (response.status) {
						hasMoreRef.current = true;
						sethasMore(() => true);
						SetHistory(response.data);
						setLoading(false);
						setPage(() => 1);
					}
				})
				.catch((err) => {
					reduxDispatch(showError("Could not fetch data"));
				});
		}
	}, [showhistorybar, reduxDispatch, id, fetchdata, hasMoreRef]);

	useEffect(
		() => {
			if (showhistorybar && histroyBodyRef.current) {
				// histroyBodyRef.current.addEventListener("scroll", (e) =>
				// 	handleScroll(e, "history-body-scroll", hasMore)
				// );
				setScrollEvent(histroyBodyRef.current);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[showhistorybar, histroyBodyRef.current]
	);

	return (
		<Drawer
			anchor="right"
			open={showhistorybar}
			SlideProps={{ unmountOnExit: true }}
			onClose={() => {
				// setPage(() => 1);
				dispatch({ type: "TOGGLE_HISTORYBAR" });
				reduxDispatch(setHistoryDrawerState(false));
			}}
			classes={{
				paper: classes.paper,
				root: classes.root,
			}}
		>
			<div className={classes.container}>
				<div className={classes.title}>
					<div className={classes.titleWrapper}>
						<button
							className={classes.restoreBtn}
							onClick={() => dispatch({ type: "TOGGLE_HISTORYBAR" })}
						>
							<RestoreIcon className={classes.restore} />
						</button>
						<span className={classes.titleText}>History</span>
					</div>

					<button
						onClick={() => {
							dispatch({ type: "TOGGLE_HISTORYBAR" });
							reduxDispatch(setHistoryDrawerState(false));
						}}
						className={classes.closeBtn}
					>
						<CloseIcon className={classes.closeIcon} fontSize="large" />
					</button>
				</div>

				<div
					className={classes.historyBody}
					id="history-body-scroll"
					ref={histroyBodyRef}
				>
					{IsLoading ? (
						<div className={classes.loadingIcon}>
							<CircularProgress />
						</div>
					) : (
						<>
							{history
								?.filter(
									(data) =>
										!isQuestion ||
										data?.propertyName !== "DecimalPlaces" ||
										(data?.propertyName === "DecimalPlaces" && data?.newValue)
								)
								.map((d) => {
									return {
										...d,
										auditType:
											d?.auditType === 2 && d?.propertyName === "IsDeleted"
												? 3
												: d?.auditType,
									};
								})
								.map((data) => (
									<>
										{hasSubTable && data.table !== 70 ? (
											<TaskSubTable
												IsLoading={IsLoading}
												setLoading={setLoading}
												key={data?.dateTime}
												data={data}
												OnAddItemClick={OnAddItemClick}
												origin={origin}
											/>
										) : (
											<SideBarElement
												IsLoading={IsLoading}
												setLoading={setLoading}
												key={data?.dateTime}
												data={data}
												OnAddItemClick={OnAddItemClick}
												origin={origin}
												statuses={statuses}
											/>
										)}
										<hr className={classes.historyBorder} />
									</>
								))}
							{loading && (
								<div className={classes.loadingIcon}>
									<CircularProgress />
								</div>
							)}
						</>
					)}

					{!hasMore && (
						<div
							style={{ textAlign: "center", padding: "16px 10px" }}
							className="flex justify-center"
						>
							<span
								className="link-color ml-md cursor-pointer"
								onClick={() => gotoTop()}
							>
								Go to top
							</span>
						</div>
					)}
				</div>
			</div>
		</Drawer>
	);
}
