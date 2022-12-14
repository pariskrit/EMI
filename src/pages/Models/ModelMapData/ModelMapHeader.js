import React from "react";
import clsx from "clsx";
import {
	createTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import NavDetails from "components/Elements/NavDetails";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { modelsPath } from "helpers/routePaths";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import DeleteDialog from "components/Elements/DeleteDialog";
import { importModelMapData } from "services/models/modelMap";
import role from "helpers/roles";
import RoleWrapper from "components/Modules/RoleWrapper";
import AccessWrapper from "components/Modules/AccessWrapper";

const successColor = "#24BA78";
const errorColor = "#E21313";

const AT = ActionButtonStyle();

const theme = createTheme({
	overrides: {
		// Accordion override is making the accordion title static vs. default dynamic
		MuiAccordionSummary: {
			root: {
				height: 48,
				"&$expanded": {
					height: 48,
					minHeight: 48,
				},
			},
		},
	},
});
const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	main: {
		display: "flex",
		justifyContent: "space-between",
	},
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
		alignItems: "center",
		[media]: {
			marginLeft: "0px",
		},
	},
	wrapper: {
		display: "flex",
		[media]: {
			marginTop: "10px",
			marginBottom: "10px",
			justifyContent: "space-between",
			zIndex: 1,
		},
	},
	errorText: {
		fontWeight: "bold",
		color: errorColor,
	},
	successText: {
		fontWeight: "bold",
		color: successColor,
	},
	errorBlock: {
		width: "100%",
		background: "rgb(234 192 192 / 50%)",
		display: "flex",
		alignItems: "center",
		padding: 15,
		border: `1px solid ${errorColor}`,
		marginTop: 9,
	},
	successCircle: {
		height: "0.7em",
		width: "0.7em",
		color: successColor,
	},
});
const ModelMapHeader = ({
	name,
	errors,
	getError,
	history,
	modelId,
	fetchData,
	access,
}) => {
	const classes = useStyles();
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const total = Object.values(errors).reduce((a, c) => a + c.total, 0);
	const resolved = Object.values(errors).reduce((a, c) => a + c.resolved, 0);

	const handleImport = async () => {
		setLoading(true);
		try {
			const res = await importModelMapData(modelId);
			if (res.status) {
				history.push(modelsPath + "/" + res.data.modelVersionID);
			} else {
				if (res?.data?.detail) {
					getError(res?.data?.detail || "Completion of model import failed");
					setLoading(false);
				} else {
					getError("Completion of model import failed");
					setLoading(false);
				}
			}
		} catch (e) {
			getError("Completion of model import failed");
			setLoading(false);
			return;
		}
	};

	const deleteSuccess = () => {
		history.push(modelsPath);
	};

	const handleDelete = () => {
		setOpen(true);
	};

	return (
		<ThemeProvider theme={theme}>
			<DeleteDialog
				entityName="Imported Model"
				open={open}
				deleteID={modelId}
				deleteEndpoint="/api/modelimports"
				handleRemoveData={deleteSuccess}
				closeHandler={() => setOpen(false)}
				pushSomeWhere={true}
			/>
			<div className={classes.main}>
				<div>
					<NavDetails
						status={null}
						staticCrumbs={[
							{ id: 1, name: "Models", url: modelsPath },
							{ id: 2, name },
						]}
						history={false}
					/>
					<span style={{ display: "flex", alignItems: "center" }}>
						<CheckCircleIcon className={classes.successCircle} /> &nbsp;Data
						Imported Successfully
					</span>
				</div>
				<div className={classes.wrapper}>
					<div className={classes.buttons}>
						{total > 0 && (
							<span
								style={{ marginRight: 10 }}
								className={clsx({
									[classes.successText]: total === resolved,
									[classes.errorText]: total !== resolved,
								})}
							>
								Errors Resolved {resolved}/{total}
							</span>
						)}
						<AccessWrapper access={access}>
							<AT.GeneralButton
								onClick={handleDelete}
								className={classes.importButton}
							>
								Delete
							</AT.GeneralButton>
						</AccessWrapper>
						<RoleWrapper roles={[role.clientAdmin]}>
							<AT.GeneralButton
								onClick={handleImport}
								disabled={total !== resolved || loading}
							>
								{loading ? "Completing ...." : "Complete"}
							</AT.GeneralButton>
						</RoleWrapper>
					</div>
				</div>
			</div>
			{total !== resolved && (
				<div className={classes.errorBlock}>
					<span style={{ marginRight: 10 }}>
						<ErrorOutlinedIcon style={{ color: errorColor }} />
					</span>

					<div style={{ display: "flex", flexDirection: "column" }}>
						<span className={classes.errorText}>Errors Identified</span>
						<span>
							There are <strong>{total - resolved} errors</strong> identified in
							the imported data. To complete importing this model please address
							these errors below.
						</span>
					</div>
				</div>
			)}
		</ThemeProvider>
	);
};

export default ModelMapHeader;
