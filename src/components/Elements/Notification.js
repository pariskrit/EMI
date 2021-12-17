import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { NotificationAlerts } from "helpers/constants";

function Notification({ message, severity, show, handleClose, anchorOrigin }) {
	return (
		<>
			<Snackbar
				open={show}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={anchorOrigin}
			>
				<SnackbarContent
					message={message}
					style={{ backgroundColor: NotificationAlerts[severity] ?? "#E31212" }}
					action={
						<React.Fragment>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleClose}
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
	message: "",
	show: false,
	severity: "error",
};

Notification.propTypes = {
	anchorOrigin: PropTypes.object,
	message: PropTypes.string,
	show: PropTypes.bool,
	handleClose: PropTypes.func.isRequired,
	severity: PropTypes.string,
};

export default Notification;
