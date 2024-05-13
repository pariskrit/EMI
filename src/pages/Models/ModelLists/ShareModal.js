import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import AddDialogStyle from "styles/application/AddDialogStyle";
import { isChrome } from "helpers/utils";
import Dropdown from "components/Elements/Dropdown";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showNotications } from "redux/notification/actions";
import { useDispatch } from "react-redux";

import {
	getModelImportsApplications,
	getModelImportsClientList,
	getModelImportsSites,
} from "services/models/modelList";

// Init styled components
const ADD = AddDialogStyle();

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		padding: "2px 0px",
		minWidth: "170px",
		// width: "auto",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	regionAndSite: null,
	client: null,
	application: null,
	type: null,
};
const defaultStateSchema = {
	client: {},
	regionAndSite: {},
	application: {},
};

function ShareModal({
	open,
	closeHandler,
	clientId,
	data,
	title,
	createProcessHandler,
	isSharableModel,
}) {
	// Init hooks
	const { classes } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [disableApplicationDropDown, setDisableApplicationDropDown] =
		useState(true);
	const [clientData, setClientData] = useState(defaultStateSchema);
	const [clientList, setClientList] = useState([]);
	const [siteList, setSiteList] = useState([]);
	const [applicationList, setApplicationList] = useState([]);
	const [siteData, setSiteData] = useState(defaultStateSchema);
	const [applicationData, setApplicationData] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [modelFocus, setModelFocus] = useState(true);
	const { site, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	//to get the id of currently logged in client
	const clientUserId = site?.clientID;

	const hideClient = isSharableModel === 1 || isSharableModel === 0;

	useEffect(() => {
		if (open) {
			setClientData(defaultStateSchema);
			setSiteData(defaultStateSchema);
			setApplicationData(defaultStateSchema);
			setClientList([]);
			setSiteList([]);
			setApplicationList([]);
			setErrors(defaultErrorSchema);
			setIsDisabled(true);
			const fetchClientList = async () => {
				const shareModels = await getModelImportsClientList();
				setClientList(
					shareModels?.data.map((list) => ({
						label: list.name,
						value: list.id,
					}))
				);
				if (shareModels?.data && shareModels?.data.length === 1) {
					setClientData({
						...clientData,
						client: {
							label: shareModels?.data[0]?.name,
							value: shareModels?.data[0]?.id,
						},
					});
				}
			};
			if (hideClient) {
				onImportSites(clientUserId);
			} else {
				fetchClientList();
			}
		}
	}, [open, hideClient, clientUserId]);

	useEffect(() => {
		setSiteList([]);
		setApplicationList([]);
		setSiteData(defaultStateSchema);
		setApplicationData(defaultStateSchema);
		setErrors(defaultErrorSchema);
		setIsDisabled(true);
		setDisableApplicationDropDown(true);
	}, [open]);

	const closeOverride = () => {
		setDisableApplicationDropDown(true);
		setIsDisabled(true);
		setClientData(defaultStateSchema);
		setSiteData(defaultStateSchema);
		setApplicationData(defaultStateSchema);
		setClientList([]);
		setSiteList([]);
		setApplicationList([]);
		setErrors(defaultErrorSchema);

		closeHandler();
	};

	const handleTransferShareModel = async () => {
		setIsUpdating(true);
		setIsDisabled(true);

		const payload = {
			modelVersionID: data.activeModelVersionID,
			destinationSiteAppID: applicationData.application.value,
		};

		const newData = await createProcessHandler(payload);
		if (newData?.status) {
			dispatch(
				showNotications({
					show: true,
					message: "Model Transferred.",
					severity: "success",
				})
			);
			closeOverride();
		} else {
			dispatch(
				showNotications({
					show: true,
					message: "Could not Transfer model.",
					severity: "error",
				})
			);
		}
		setIsUpdating(false);
		setIsDisabled(false);
	};

	//import functions
	async function onImportSites(id) {
		const localSiteData = await getModelImportsSites(id);

		if (localSiteData.data) {
			setSiteList(
				localSiteData?.data?.map((list) => ({
					label: list.name,
					value: list.siteID,
				}))
			);
		}

		if (open && localSiteData?.data && localSiteData?.data?.length === 1) {
			setSiteData((prevData) => ({
				...prevData,
				regionAndSite: {
					label: localSiteData?.data[0]?.name,
					value: localSiteData?.data[0]?.siteID,
				},
			}));

			handleSiteChange({
				label: localSiteData?.data[0]?.name,
				value: localSiteData?.data[0]?.siteID,
			});
		}
	}

	async function onImportApplication(value, modelType) {
		const applicationData = await getModelImportsApplications(value, modelType);

		if (!applicationData?.data?.length) {
			setErrors((prevData) => ({
				...prevData,
				application: {
					message: `There are no Applications that this model can be transferred to for this ${customCaptions.modelTemplate}.`,
				},
			}));
		}
		if (applicationData?.data?.length) {
			setApplicationList(
				applicationData?.data?.map((list) => ({
					label: list.appName,
					value: list.siteAppID,
				}))
			);
			setErrors(defaultErrorSchema);
			setDisableApplicationDropDown(false);
		}

		if (applicationData?.data && applicationData?.data?.length === 1) {
			setApplicationData((prevData) => ({
				...prevData,
				application: {
					label: applicationData?.data[0]?.appName,
					value: applicationData?.data[0]?.siteAppID,
				},
			}));
			handleApplicationChange({
				label: applicationData?.data[0]?.appName,
				value: applicationData?.data[0]?.siteAppID,
			});
		}
	}

	//onchange handlers
	const handleClientChange = (e) => {
		setSiteList([]);
		setApplicationList([]);
		setClientData({ ...clientData, client: e });
		setSiteData(defaultStateSchema);
		setApplicationData(defaultStateSchema);
		setErrors(defaultErrorSchema);
		setIsDisabled(true);
		setDisableApplicationDropDown(true);
		onImportSites(e.value);
	};

	const handleSiteChange = (e) => {
		setApplicationList([]);
		setApplicationData(defaultStateSchema);
		setSiteData({ ...siteData, regionAndSite: e });

		onImportApplication(e.value, data.modelTemplateType);
	};

	const handleApplicationChange = (e) => {
		setDisableApplicationDropDown(false);
		if (e.value) {
			setApplicationData({ ...applicationData, application: e });
			setIsDisabled(false);
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="medium-application-dailog"
				disableEnforceFocus={isChrome() ? modelFocus : false}
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								{title}
								{customCaptions?.modelTemplate ?? " Model"}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton
								onClick={closeOverride}
								variant="contained"
								onFocus={(e) => {
									setModelFocus(true);
								}}
							>
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={handleTransferShareModel}
								variant="contained"
								className={classes.createButton}
								disabled={
									isDisabled ||
									(!hideClient && Object.keys(clientData?.client).length <= 0)
								}
							>
								Transfer
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					{!hideClient && (
						<ADD.InputContainer>
							<ADD.FullWidthContainer>
								<ADD.NameLabel>
									{`Client`}
									<ADD.RequiredStar>*</ADD.RequiredStar>
								</ADD.NameLabel>
								<ErrorInputFieldWrapper
									errorMessage={errors.type === null ? null : errors.type}
								>
									<Dropdown
										options={clientList}
										selectedValue={clientData.client}
										onChange={handleClientChange}
										label=""
										placeholder={`Select ${
											customCaptions?.model ?? "Model"
										} Client`}
										required={true}
										width="100%"
										isError={errors.type === null ? false : true}
									/>
								</ErrorInputFieldWrapper>
							</ADD.FullWidthContainer>
						</ADD.InputContainer>
					)}
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>
								{`Region and Site`}
								<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.type === null ? null : errors.type}
							>
								<Dropdown
									options={siteList}
									selectedValue={
										!hideClient && Object.keys(clientData?.client).length <= 0
											? {}
											: siteData.regionAndSite
									}
									onChange={handleSiteChange}
									label=""
									placeholder={`Select ${
										customCaptions?.model ?? "Model"
									} Region and Site`}
									required={true}
									width="100%"
									isError={errors.type === null ? false : true}
									disabled={
										hideClient
											? false
											: Object.keys(clientData?.client).length <= 0
									}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>

					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							{errors.application === null ? (
								<>
									<ADD.NameLabel>
										{`Application`}
										<ADD.RequiredStar>*</ADD.RequiredStar>
									</ADD.NameLabel>
									<ErrorInputFieldWrapper
										errorMessage={
											errors.application === null
												? null
												: errors.application.message
										}
									>
										<Dropdown
											options={applicationList}
											selectedValue={
												!hideClient &&
												Object.keys(clientData?.client).length <= 0
													? {}
													: applicationData.application
											}
											onChange={handleApplicationChange}
											label=""
											placeholder={`Select ${
												customCaptions?.model ?? " Model"
											} Application`}
											required={true}
											width="100%"
											isError={errors.type === null ? false : true}
											disabled={
												disableApplicationDropDown ||
												(!hideClient &&
													Object.keys(clientData?.client).length <= 0)
											}
										/>
									</ErrorInputFieldWrapper>
								</>
							) : (
								<p className={classes.italic}>
									<em>{errors.application.message}</em>
								</p>
							)}
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ShareModal;
