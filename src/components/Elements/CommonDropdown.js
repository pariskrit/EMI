import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Fade, Menu, MenuItem } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { ReactComponent as ArrowIcon } from "assets/icons/arrowIcon.svg";

const useStyles = makeStyles()((theme) => ({
	mainContainer: {
		display: "flex",
	},
	icon: {
		"&:hover": {
			cursor: "pointer",
		},
	},
	arrowContainer: {
		display: "flex",
		alignItems: "center",
		marginTop: "1rem",
	},
}));

const CommonDropdown = ({
	iconSrc,
	isDownloading,
	dataSource,
	dynamicAction,
}) => {
	const { classes, cx } = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const openDropdown = Boolean(anchorEl);

	const handleOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			{isDownloading ? (
				<CircularProgress />
			) : (
				<div className={classes.mainContainer} onClick={handleOpen}>
					<img
						alt="Print"
						src={iconSrc}
						style={{ marginRight: "5px", width: "30px", height: "auto" }}
						className={classes.printIcon}
					/>

					<div className={classes.arrowContainer}>
						<ArrowIcon
							className="arrow-down"
							style={{ width: "8px", height: "8px" }}
						/>
					</div>
				</div>
			)}

			<Menu
				id="print-menu"
				getContentAnchorEl={null}
				anchorEl={anchorEl}
				open={openDropdown}
				onClose={handleClose}
				TransitionComponent={Fade}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				{dataSource.map((report) => (
					<MenuItem onClick={() => dynamicAction(report, handleClose)}>
						{report?.name}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

export default CommonDropdown;
