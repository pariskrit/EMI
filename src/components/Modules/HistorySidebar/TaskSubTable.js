import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { useNavigate } from "react-router-dom";
import Icon from "components/Elements/Icon";

import {
	HistoryCaptions,
	HistoryCustomCaption,
	HistoryEntityCaptions,
	SubTableModelTask,
} from "helpers/constants";
import LinkText from "./LinkText";
import { historyFinalData, isoDateWithoutTimeZone } from "helpers/utils";
import { getClientUserId } from "services/users/userSites";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles()((theme) => ({
	Wrapper: {
		padding: "15px",
		display: "flex",
	},
	iconContainer: {
		marginTop: "10px",
	},
	textContainer: {
		padding: "0px",
		marginLeft: "8px",
	},
	dateText: {
		fontStyle: "italic",
		color: "#808080",
		fontSize: "16px",
	},
	rm: {
		margin: 0,
		padding: 0,
	},
	mainText: {
		fontSize: "16px",
	},
	titleText: {
		padding: 0,
		margin: "5px 0px 0px 0px",
	},
	list: {
		padding: "5px 0px 0px 25px",
		margin: "0px",
	},
	linkText: {
		textDecoration: "underline #1880e8",
		marginTop: "8px",
		textDecorationThickness: "2px",
		color: "#1880e8",
		"&:hover": {
			cursor: "pointer",
		},
	},
	editedText: {
		fontWeight: "400",
	},
	link: {
		marginBottom: "3px",
	},
	image: {
		marginTop: "10px",
		display: "block",
		marginRight: "auto",
		height: "60px",
		width: "60px",
		objectFit: "contain",
	},
}));

function TaskSubTable({ data, OnAddItemClick, IsLoading, setLoading, origin }) {
	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	const { position, customCaptions, application } = JSON.parse(
		localStorage.getItem("me") || "{}"
	);

	if (IsLoading) return <CircularProgress />;

	return (
		<div className={classes.Wrapper}>
			<div style={{ height: "35px", width: "36px" }}></div>
			<div className={classes.textContainer}>
				<p className={cx(classes.dateText, classes.rm)}>
					{isoDateWithoutTimeZone(data?.dateTime + "Z")}
				</p>
				<p className={cx(classes.mainText, classes.titleText)}>
					<LinkText
						isLink={position?.userAccess !== "N"}
						text={data?.user}
						onClick={async () => {
							setLoading(true);
							const userData = await getClientUserId(data?.userID);
							setLoading(false);
							navigate(`/app/users/${userData?.data?.id}`);
						}}
					/>
					<span style={{ fontWeight: "bold" }}> modified </span>
					<span>{HistoryEntityCaptions(customCaptions)?.[data.table]}</span>
				</p>
				{data?.url ? (
					<img alt="history-detail" src={data.url} className={classes.image} />
				) : (
					<ul className={cx(classes.mainText, classes.list)}>
						{data.auditType === 2 ? (
							<>
								<li className={classes.link}>
									Edited{" "}
									{SubTableModelTask(customCaptions)?.[data?.table] ||
										customCaptions["interval"]}{" "}
									<span className={classes.linkText} onClick={() => {}}>
										{data?.objectName}
									</span>
								</li>
								<li className={classes.link}>
									Changed:{" "}
									<span className={classes.editedText}>
										{HistoryCustomCaption(
											origin,
											customCaptions,
											application?.showParts
										)[data?.propertyName] || data?.propertyName}
									</span>
								</li>

								<li className={classes.link}>
									From:{" "}
									<span className={classes.editedText}>
										{historyFinalData({
											value: data?.oldValue,
											data,
											customCaptions,
											origin,
										})}
									</span>
								</li>
								<li>
									To:{" "}
									<span className={classes.editedText}>
										{historyFinalData({
											value: data?.newValue,
											data,
											customCaptions,
											origin,
										})}
									</span>
								</li>
							</>
						) : (
							<li>
								{data.auditType === 3 ? (
									<>
										Deleted{" "}
										{SubTableModelTask(customCaptions)?.[data?.table] ||
											customCaptions["interval"]}{" "}
										<span className={classes.linkText} onClick={() => {}}>
											{data?.objectName}
										</span>{" "}
									</>
								) : (
									<>
										Added{" "}
										{SubTableModelTask(customCaptions)?.[data?.table] ||
											customCaptions["interval"]}{" "}
										<span className={classes.linkText} onClick={() => {}}>
											{data?.objectName}
										</span>{" "}
									</>
								)}
							</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}

export default TaskSubTable;
