import { makeStyles } from "tss-react/mui";
import RestoreIcon from "@mui/icons-material/Restore";
import NavDetails from "components/Elements/NavDetails";
import NavButtons from "components/Elements/NavButtons";
import PropTypes from "prop-types";
import React from "react";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { modelsPath } from "helpers/routePaths";
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

const ModelWrapper = ({
	lastSaved,
	onClickAdd,
	showAdd,
	current,
	onNavClick,
	Component,
	navigation,
	ModelName,
	showSave,
	showPasteTask,
	showChangeStatus,
	showSaveChanges,
	onClickSave,
	onCLickedSaveChanges,
	onClickPasteTask,
	onClickShowChangeStatus,
}) => {
	const { classes, cx } = useStyles();
	const importButton = {
		"&.MuiButton-root": {
			backgroundColor: "#ED8738",
		},
	};

	return (
		<div className="container">
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={lastSaved}
					staticCrumbs={[
						{ id: 1, name: "Models", url: modelsPath },
						{ id: 2, name: ModelName },
					]}
				/>
				<div
					className={
						showAdd ||
						showSave ||
						showPasteTask ||
						showSaveChanges ||
						showChangeStatus
							? classes.wrapper
							: ""
					}
				>
					<div className={classes.buttons}>
						{showPasteTask && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickPasteTask}
								className={classes.importButton}
							>
								Paste Task
							</AT.GeneralButton>
						)}
						{showChangeStatus && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickShowChangeStatus}
								className={classes.importButton}
							>
								Change Status
							</AT.GeneralButton>
						)}
						{showSaveChanges && (
							<AT.GeneralButton onClick={onCLickedSaveChanges}>
								Save Changes
							</AT.GeneralButton>
						)}
						{showAdd && (
							<AT.GeneralButton onClick={onClickAdd}>Add New</AT.GeneralButton>
						)}
						{showSave && (
							<AT.GeneralButton onClick={onClickSave}>Save</AT.GeneralButton>
						)}
					</div>
					<div className="restore">
						<RestoreIcon className={classes.restore} />
					</div>
				</div>
			</div>

			<NavButtons
				navigation={navigation}
				current={current}
				onClick={onNavClick}
			/>
			{Component}
		</div>
	);
};

ModelWrapper.defaultProps = {
	crumbs: ["Parent", "Child", "so on.."],
	status: "",
	lastSaved: "",
	showAdd: false,
	showSave: false,
	showPasteTask: false,
	showSaveChanges: false,
	showChangeStatus: false,
	current: "Details",
	onClickAdd: () => {},
	onClickSave: () => {},
	onCLickedSaveChanges: () => {},
	onClickPasteTask: () => {},
	onClickShowChangeStatus: () => {},
	onNavClick: () => {},
	Component: () => <div>Provide Component</div>,
};

ModelWrapper.propTypes = {
	crumbs: PropTypes.array,
	status: PropTypes.string,
	lastSaved: PropTypes.string,
	onClickAdd: PropTypes.func,
	onClickSave: PropTypes.func,
	onCLickedSaveChanges: PropTypes.func,
	onClickPasteTask: PropTypes.func,
	onClickShowChangeStatus: PropTypes.func,
	onNavClick: PropTypes.func,
	showAdd: PropTypes.bool,
	Component: PropTypes.elementType,
	ModelName: PropTypes.string.isRequired,
	showSave: PropTypes.bool,
	showChangeStatus: PropTypes.bool,
	showPasteTask: PropTypes.bool,
	showSaveChanges: PropTypes.bool,
};

export default ModelWrapper;
