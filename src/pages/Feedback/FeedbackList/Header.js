import React from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import NavDetails from "components/Elements/NavDetails";
import Icon from "components/Elements/Icon";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { AccessTypes } from "helpers/constants";

const AT = ActionButtonStyle();

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
	},
}));

function Header({ setOpenAddFeedback, dataLength, feedbackCC }) {
	// Init hooks
	const { classes, cx } = useStyles();

	const { position } = sessionStorage.getItem("me")
		? JSON.parse(sessionStorage.getItem("me"))
		: {};

	return (
		<div className={"topContainerCustomCaptions"}>
			<NavDetails
				status={false}
				lastSaved={""}
				staticCrumbs={[
					{ id: 1, name: `${feedbackCC} (${dataLength})`, url: "" },
				]}
				hideLastLogin
				hideLastSave
				hideVersion={true}
			/>
			<div className={classes.wrapper}>
				{position?.feedbackAccess &&
					position?.feedbackAccess !== AccessTypes["Read-Only"] && (
						<div className={classes.buttons}>
							<AT.GeneralButton onClick={() => setOpenAddFeedback(true)}>
								Add New
							</AT.GeneralButton>
						</div>
					)}

				{/* <div className="restore">
					<Icon className={classes.restore} name="Restore" />
				</div> */}
			</div>
		</div>
	);
}

export default Header;
