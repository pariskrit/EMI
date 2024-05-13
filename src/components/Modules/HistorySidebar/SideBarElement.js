import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useNavigate } from "react-router-dom";
import Icon from "components/Elements/Icon";
import {
	HistoryCaptions,
	HistoryCustomCaption,
	HistoryEntityCaptions,
	HistoryInfo,
	HistoryProperty,
	HistoryPropertyCode,
} from "helpers/constants";
import LinkText from "./LinkText";
import {
	historyFinalData,
	htmlToPlainText,
	isoDateWithoutTimeZone,
} from "helpers/utils";
import { getClientUserId } from "services/users/userSites";
import { CircularProgress } from "@mui/material";
import Roles from "helpers/roles";

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

function SideBarElement({
	data,
	OnAddItemClick,
	IsLoading,
	setLoading,
	origin,
	statuses,
}) {
	const { customCaptions, application } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	const { position, role } = JSON.parse(localStorage.getItem("me") || "{}");

	if (IsLoading) return <CircularProgress />;

	return (
		<div className={classes.Wrapper}>
			<div>
				{Icon({
					name: `${HistoryInfo[data.auditType].icon}`,
					height: "35px",
					width: "36px",
				})}
			</div>
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
							let userId = undefined;
							if (role === Roles.siteUser) {
								const userData = await getClientUserId(data?.userID);
								userId = userData?.data?.id;
							} else {
								userId = data?.userID;
							}

							setLoading(false);
							navigate(`/app/users/${userId}`);
						}}
					/>{" "}
					<span style={{ fontWeight: "bold" }}>
						{HistoryInfo[data.auditType]?.type}{" "}
					</span>
					<span>
						{HistoryEntityCaptions(customCaptions)?.[data.table] || ""}
					</span>
				</p>
				{data?.url ? (
					<img alt="history-detail" src={data.url} className={classes.image} />
				) : (
					<ul className={cx(classes.mainText, classes.list)}>
						{data.auditType === 2 ? (
							<>
								<li className={classes.link}>
									Changed:
									<span className={classes.editedText}>
										{HistoryCustomCaption(
											origin,
											customCaptions,
											application?.showParts
										)?.[data?.propertyName] || data?.propertyName}
									</span>
								</li>

								<li className={classes.link}>
									From:
									<span className={classes.editedText}>
										{data?.table === 70
											? htmlToPlainText(data?.oldValue)
											: historyFinalData({
													value: data?.oldValue,
													statuses,
													data,
													customCaptions,
													origin,
											  })}
									</span>
								</li>
								<li>
									To:{" "}
									<span className={classes.editedText}>
										{data?.table === 70
											? htmlToPlainText(data?.newValue)
											: historyFinalData({
													value: data?.newValue,
													statuses,
													data,
													customCaptions,
													origin,
											  })}
									</span>
								</li>
							</>
						) : (
							<li
								className={cx({
									[classes.linkText]: data.auditType === 1,
								})}
								onClick={() => {
									if (data.auditType !== 1) return;
									OnAddItemClick && OnAddItemClick(data?.keyValue);
								}}
							>
								{data.auditType === 3
									? data?.name
									: data?.newValue || data?.name}
							</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}

export default SideBarElement;
