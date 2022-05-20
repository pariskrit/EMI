import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavDetails from "components/Elements/NavDetails";
import Icon from "components/Elements/Icon";
import ActionButtonStyle from "styles/application/ActionButtonStyle";

const AT = ActionButtonStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
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
});

function Header({ setOpenAddService, setImportCSV, dataLength }) {
	// Init hooks
	const classes = useStyles();

	return (
		<div className={"topContainerCustomCaptions"}>
			<NavDetails
				status={false}
				lastSaved={""}
				staticCrumbs={[{ id: 1, name: `Services (${dataLength})`, url: "" }]}
				hideLastLogin
				hideVersion={true}
			/>
			<div className={classes.wrapper}>
				<div className={classes.buttons}>
					<AT.GeneralButton
						className={classes.importButton}
						onClick={() => setImportCSV(true)}
					>
						Import from CSV
					</AT.GeneralButton>

					<AT.GeneralButton onClick={() => setOpenAddService(true)}>
						Add New
					</AT.GeneralButton>
				</div>
				<div className="restore">
					<Icon className={classes.restore} />
				</div>
			</div>
		</div>
	);
}

export default Header;
