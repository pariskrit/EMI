import React from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import { showNotications } from "redux/notification/actions";

function NotificationAlerts(severity) {
	switch (severity) {
		case "success":
			return { color: "#24BA78", icon: <CheckCircleIcon /> };
		case "error":
			return { color: "#E31212", icon: <ErrorIcon /> };
		case "info":
			return { color: "#307AD6", icon: <InfoIcon /> };
		case "warning":
			return { color: "#ED8738", icon: <WarningIcon /> };

		default:
			return { color: "#E31212", icon: <ErrorIcon /> };
	}
}

function Notification({ anchorOrigin }) {
	// react-redux hooks to get state and dispatch actions
	const {
		notification: { show, message, severity },
	} = useSelector((state) => state.notificaton, shallowEqual);
	const dispatch = useDispatch();

	// close Notification when clicked outside notification
	const handleCloseNotification = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(
			showNotications({ show: false, message: message, severity: severity })
		);
	};
	return (
		<>
			<Snackbar
				open={show}
				autoHideDuration={2000}
				onClose={handleCloseNotification}
				anchorOrigin={anchorOrigin}
			>
				<SnackbarContent
					message={
						<span
							style={{ display: "flex", alignItems: "center", gap: "15px" }}
						>
							{NotificationAlerts(severity).icon}
							{message}
						</span>
					}
					style={{
						backgroundColor: NotificationAlerts(severity).color,
					}}
					action={
						<React.Fragment>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleCloseNotification}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
			</Snackbar>
		</>
	);
}

Notification.defaultProps = {
	anchorOrigin: { vertical: "top", horizontal: "right" },
	// message: "",
	// show: false,
	// severity: "error",
};

Notification.propTypes = {
	anchorOrigin: PropTypes.object,
};

export default Notification;
