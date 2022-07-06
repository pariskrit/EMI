import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";
import NavDetails from "components/Elements/NavDetails";
import Icon from "components/Elements/Icon";
import ActionButtonStyle from "styles/application/ActionButtonStyle";

const AT = ActionButtonStyle();

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

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

function Header({
	setOpenAddService,
	setImportCSV,
	setOpenMultipleChnageStatusPopup,
	dataLength,
	MultipleChangeStatusDisabled,
	customCaptions,
	selectedServices,
}) {
	// Init hooks
	const classes = useStyles();

	return (
		<div className={"topContainerCustomCaptions"}>
			<NavDetails
				status={false}
				lastSaved={""}
				staticCrumbs={[{ id: 1, name: `Services (${dataLength})`, url: "" }]}
				hideLastLogin
				hideLastSave
				hideVersion={true}
			/>
			<div className={classes.wrapper}>
				<div className={classes.buttons}>
					{MultipleChangeStatusDisabled && selectedServices.length > 0 ? (
						<HtmlTooltip
							title={`The status of your selected ${customCaptions.servicePlural} can not be changed as they are not the same status`}
						>
							<div>
								<AT.GeneralButton
									className={classes.importButton}
									onClick={() => setOpenMultipleChnageStatusPopup(true)}
									disabled={MultipleChangeStatusDisabled}
								>
									Change Status
								</AT.GeneralButton>
							</div>
						</HtmlTooltip>
					) : (
						<AT.GeneralButton
							className={classes.importButton}
							onClick={() => setOpenMultipleChnageStatusPopup(true)}
							disabled={MultipleChangeStatusDisabled}
						>
							Change Status
						</AT.GeneralButton>
					)}

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
					<Icon className={classes.restore} name="Restore" />
				</div>
			</div>
		</div>
	);
}

export default Header;
