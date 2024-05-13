import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import NavDetails from "components/Elements/NavDetails";
import PrintIcon from "assets/printer.svg";
import { defectReportTypes } from "constants/ReportTypes";
import {
	getDefectPartsByWorkOrder,
	getDefectsByRisk,
	getDefectsByStatus,
	getDefectsSummary,
} from "services/reports/reports";
import {
	fileDownload,
	getFileNameFromContentDispositonHeader,
} from "helpers/utils";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
} from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import CommonDropdown from "components/Elements/CommonDropdown";

const ADD = AddDialogStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: "0px",
			flexDirection: "column",
			marginBottom: "10px",
			gap: "10px",
		},
	},
	wrapper: {
		display: "flex",
		[media]: {
			marginTop: "10px",
			justifyContent: "space-between",
			flexDirection: "column",
		},
		gap: "2rem",
	},
	dropdownContainer: {
		width: "22rem",
		marginTop: "-4px",
	},
}));

function Header({
	dataLength,
	defectsCC,
	fromDate,
	toDate,
	customCaptions,
	chips,
	page,
	currentTableSort,
	pageSize,
}) {
	// Init hooks
	const { classes, cx } = useStyles();
	const reduxDispatch = useDispatch();
	const [workOrderPopup, setWorkOrderPopup] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isWorkOrderDownloading, setIsWorkOrderDownloading] = useState(false);
	const [workOrder, setWorkOrder] = useState("");

	const closePopup = () => {
		setWorkOrder("");
		setWorkOrderPopup(false);
	};
	const payload = {
		fromDate,
		toDate,
		chips,
		pageNumber: page,
		sortField: currentTableSort[0],
		sortOrder: currentTableSort[1],
		pageSize,
	};

	const defectReports = [
		{
			id: "1",
			name: `${customCaptions.defect || "Defect"} ${
				customCaptions.partPlural || "Parts"
			} by ${customCaptions.defectWorkOrder || "Work Order"}`,
			reportType: defectReportTypes?.PARTSBYWORKORDER,
		},
		{
			id: "2",
			name: `${customCaptions.defectPlural || "Defects"} Report`,
			reportType: defectReportTypes?.DEFECTSSUMMARY,
		},
		{
			id: "3",
			name: `${customCaptions.defectPlural || "Defects"} by Status`,
			reportType: defectReportTypes?.DEFECTSBYSTATUS,
		},
		{
			id: "4",
			name: `${customCaptions.defectPlural || "Defects"} by Risk`,
			reportType: defectReportTypes?.DEFECTSBYRISK,
		},
	];

	const downloadReportHandler = async (reportToBeDownloaded, handleClose) => {
		if (Object.keys(reportToBeDownloaded)?.length < 1) {
			return;
		}
		handleClose();
		try {
			if (
				reportToBeDownloaded.reportType === defectReportTypes?.PARTSBYWORKORDER
			) {
				setWorkOrderPopup(true);
				return;
			}
			setIsDownloading(true);
			let response;

			if (
				reportToBeDownloaded.reportType === defectReportTypes?.DEFECTSSUMMARY
			) {
				response = await getDefectsSummary(payload);
			} else if (
				reportToBeDownloaded.reportType === defectReportTypes?.DEFECTSBYSTATUS
			) {
				response = await getDefectsByStatus(payload);
			} else if (
				reportToBeDownloaded.reportType === defectReportTypes?.DEFECTSBYRISK
			) {
				response = await getDefectsByRisk(payload);
			}

			if (response?.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				fileDownload(response, fileName);
				setIsDownloading(false);
			} else {
				const res = JSON.parse(await response.data.text());
				setIsDownloading(false);
				reduxDispatch(
					showError(
						res?.detail || res.errors?.message || "Failed to download report."
					)
				);
			}
		} catch (err) {
			setIsDownloading(false);
			reduxDispatch(showError("Failed to download report."));
		}
	};

	const downloadPartsByWorkOrderReport = async () => {
		try {
			setIsWorkOrderDownloading(true);
			const response = await getDefectPartsByWorkOrder({ workOrder });
			if (response?.status) {
				const fileName = getFileNameFromContentDispositonHeader(response);
				fileDownload(response, fileName);
				setIsWorkOrderDownloading(false);
				setWorkOrderPopup(false);
			} else {
				const res = JSON.parse(await response?.data.text());
				reduxDispatch(
					showError(
						res?.detail || res.errors?.message || "Failed to download report."
					)
				);
			}
		} catch (err) {
			reduxDispatch(showError("Failed to download report."));
		} finally {
			setIsWorkOrderDownloading(false);
			setWorkOrderPopup(false);
		}
	};

	return (
		<div className={"topContainerCustomCaptions"}>
			<NavDetails
				status={false}
				lastSaved={""}
				staticCrumbs={[
					{ id: 1, name: `${defectsCC} (${dataLength})`, url: "" },
				]}
				hideLastLogin
				hideLastSave
				hideVersion={true}
			/>
			<Dialog
				open={workOrderPopup}
				onClose={closePopup}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{isWorkOrderDownloading ? <LinearProgress /> : null}
				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Enter Work Order</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<ADD.CancelButton onClick={closePopup} variant="contained">
							Cancel
						</ADD.CancelButton>
						<ADD.ConfirmButton
							onClick={downloadPartsByWorkOrderReport}
							variant="contained"
							className={classes.createButton}
							disabled={isWorkOrderDownloading}
						>
							Download
						</ADD.ConfirmButton>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>
				<DialogContent className={classes.dialogContent}>
					<TextField
						sx={{
							"& .MuiInputBase-input.Mui-disabled": {
								WebkitTextFillColor: "#000000",
							},
						}}
						label="Work Order"
						fullWidth
						multiline
						onChange={(e) => setWorkOrder(e.target.value)}
					/>
				</DialogContent>
			</Dialog>
			<div className={classes.wrapper}>
				{/* {isDownloading ? (
					<CircularProgress />
				) : (
					<img
						alt="Print"
						src={PrintIcon}
						style={{ marginRight: "5px", width: "30px", height: "50px" }}
						className={classes.printIcon}
						onClick={handlePrintClick}
					/>
				)}

				<Menu
					id="print-menu"
					anchorEl={anchorEl}
					open={openDropdown}
					onClose={handleClose}
					TransitionComponent={Fade}
				>
					{defectReports.map((report) => (
						<MenuItem onClick={() => downloadReportHandler(report)}>
							{report?.name}
						</MenuItem>
					))}
				</Menu> */}

				<CommonDropdown
					iconSrc={PrintIcon}
					isDownloading={isDownloading}
					dataSource={defectReports}
					dynamicAction={downloadReportHandler}
				/>

				{/* <div className="restore">
					<Icon className={classes.restore} name="Restore" />
				</div> */}
			</div>
		</div>
	);
}

export default Header;
