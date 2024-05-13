import React, { useState, useContext } from "react";
import { makeStyles } from "tss-react/mui";
import {
	fileDownload,
	getFileNameFromContentDispositonHeader,
} from "helpers/utils";
import { modelDetailsServiceTabReports } from "constants/ReportTypes";
import {
	getModelTasksExcel,
	partsByTask,
	partsSummary,
	serviceSheet,
	toolsByTask,
	toolsSummary,
} from "services/reports/reports";
import { ModelContext } from "contexts/ModelDetailContext";
import PrintIcon from "assets/printer.svg";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import CommonDropdown from "components/Elements/CommonDropdown";

const useStyles = makeStyles()((theme) => ({
	mainContainer: {
		display: "flex",
		gap: "1rem",
	},
	dropdownContainer: {
		width: "16rem",
	},
}));

const ReportDropdowns = ({ customCaptions }) => {
	const reduxDispatch = useDispatch();

	const ModelCtx = useContext(ModelContext);
	const { classes, cx } = useStyles();
	const [isDownloading, setIsDownloading] = useState(false);

	const modelDelayServiceReports = [
		{
			id: "1",
			name: `${customCaptions?.toolPlural || "Tools"} Summary`,
			reportType: modelDetailsServiceTabReports?.toolsSummary,
		},
		{
			id: "2",
			name: `${customCaptions?.partPlural || "Parts"}  Summary`,
			reportType: modelDetailsServiceTabReports?.partsSummary,
		},
		{
			id: "3",
			name: `${customCaptions?.partPlural || "Parts"} by ${
				customCaptions?.task || "Task"
			}`,
			reportType: modelDetailsServiceTabReports?.partsByTask,
		},
		{
			id: "4",
			name: `${customCaptions?.toolPlural || "Tools"} by ${
				customCaptions?.task || "Task"
			}`,
			reportType: modelDetailsServiceTabReports?.toolsByTask,
		},
		{
			id: "5",
			name: `${customCaptions?.service || "Service"} Sheet `,
			reportType: modelDetailsServiceTabReports?.serviceSheet,
		},
		{
			id: "6",
			name: `${customCaptions?.taskPlural || "Tasks"} Excel `,
			reportType: modelDetailsServiceTabReports?.tasksExcel,
		},
	];

	const payload = ModelCtx?.[0]?.serviceLayoutDetails;

	const downloadReportHandler = async (reportToBeDownloaded, handleClose) => {
		if (Object.keys(reportToBeDownloaded)?.length < 1) {
			return;
		}
		handleClose();
		try {
			setIsDownloading(true);
			let response;
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.toolsSummary
			) {
				response = await toolsSummary(payload);
			}
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.toolsByTask
			) {
				response = await toolsByTask(payload);
			}
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.partsSummary
			) {
				response = await partsSummary(payload);
			}
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.partsByTask
			) {
				response = await partsByTask(payload);
			}
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.serviceSheet
			) {
				response = await serviceSheet(payload);
			}
			if (
				reportToBeDownloaded.reportType ===
				modelDetailsServiceTabReports?.tasksExcel
			) {
				response = await getModelTasksExcel(payload);
			}
			if (response?.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				setIsDownloading(false);
				fileDownload(response, fileName);
			} else {
				const res = JSON.parse(await response?.data.text());
				const keyArr = Object.keys(res.errors);
				let errMsg =
					keyArr.includes("modelVersionIntervalID") &&
					keyArr.includes("modelVersionRoleID")
						? `The ${customCaptions.interval} and ${customCaptions.role} value ' ' is invalid. `
						: keyArr.includes("modelVersionRoleID")
						? `The  ${customCaptions.role} value ' ' is invalid.`
						: keyArr.includes("modelVersionIntervalID")
						? `The ${customCaptions.interval} value ' ' is invalid.`
						: undefined;
				setIsDownloading(false);
				reduxDispatch(
					showError(
						res?.detail ||
							res?.errors?.message ||
							errMsg ||
							"Failed to download report"
					)
				);
			}
		} catch (err) {
			setIsDownloading(false);
			reduxDispatch(showError("Failed to download report."));
		}
	};

	return (
		<div className={classes.mainContainer}>
			<CommonDropdown
				iconSrc={PrintIcon}
				isDownloading={isDownloading}
				dataSource={modelDelayServiceReports}
				dynamicAction={downloadReportHandler}
			/>
		</div>
	);
};

export default ReportDropdowns;
