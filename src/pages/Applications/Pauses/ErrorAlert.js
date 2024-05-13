import React, { useState } from "react";
import Alert from "@mui/lab/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

const ErrorAlert = ({ errorMessage }) => {
	// Init state
	const [open, setOpen] = useState(true);

	return (
		<Collapse in={open}>
			<Alert
				severity="error"
				action={
					<IconButton
						aria-label="close"
						color="inherit"
						size="small"
						onClick={() => {
							setOpen(false);
						}}
					>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				}
			>
				{errorMessage}
			</Alert>
		</Collapse>
	);
};

export default ErrorAlert;
