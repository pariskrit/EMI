import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	FormGroup,
	FormControlLabel,
	Typography,
	CircularProgress,
	LinearProgress,
} from "@mui/material";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dropdown from "components/Elements/Dropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import {
	questionTimingOptions,
	questionTypeOptions,
} from "constants/modelDetail";
import {
	postModelQuestions,
	patchModelQuestions,
	postModelQuestionRole,
	deleteModelQuestionRole,
	postModelQuestionOption,
	deleteModelQuestionOption,
	patchModelQuestionOption,
} from "services/models/modelDetails/modelQuestions";
import { getModelStage } from "services/models/modelDetails/modelStages";
import { getModelZonesList } from "services/models/modelDetails/modelZones";
import { generateErrorState, handleValidateObj, isChrome } from "helpers/utils";
import DynamicDropdown from "components/Elements/DyamicDropdown";
import questionSchema from "./questionSchema";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import NewOption from "./NewOption";
import Options from "./Options";
import CurveButton from "components/Elements/CurveButton";

const ADD = AddDialogStyle();

const defaultError = {
	caption: null,
	type: null,
	timing: null,
	roles: null,
	isCompulsory: null,
	decimalPlaces: null,
	checkboxCaption: null,
	modelVersionStageID: null,
	modelVersionZoneID: null,
	options: null,
};
const initialInput = {
	caption: "",
	type: "",
	timing: "",
	roles: [],
	isCompulsory: false,
	decimalPlaces: "",
	checkboxCaption: "",
	modelVersionStageID: null,
	modelVersionZoneID: null,
	options: [],
};

const AddEditModel = ({
	open,
	handleClose,
	questionDetail,
	title,
	modelId,
	getError,
	roleOptions,
	handleAddEditComplete,
	handleOptions,
	editMode,
	customCaptions,
}) => {
	// DEFINE STATES
	const [input, setInput] = useState(initialInput);
	const [errors, setErrors] = useState(defaultError);
	const [stageZoneOptions, setStageZoneOptions] = useState({
		loading: false,
		options: [],
	});
	const [loading, setLoading] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [loader, setLoader] = useState({ role: false, option: false });
	const [modelFocus, setModelFocus] = useState(true);

	const { rolePlural, stage, zone } = customCaptions;
	useEffect(() => {
		if (editMode) {
			const {
				caption,
				type,
				timing,
				roles,
				isCompulsory,
				modelVersionStageID,
				modelVersionZoneID,
				decimalPlaces,
				checkboxCaption,
				options,
			} = questionDetail;

			fetchStageOrZone(timing);

			setInput({
				caption,
				type,
				timing,
				roles: roles.map((x) => x.modelVersionRoleID),
				isCompulsory,
				modelVersionStageID,
				modelVersionZoneID,
				decimalPlaces,
				checkboxCaption,
				options: options.map((x) => x.name),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editMode]);

	useEffect(() => {
		if (roleOptions.length === 1 && !editMode) {
			setInput((prev) => ({
				...prev,
				roles: [roleOptions[0].id],
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// HANDLE FUNCTIONS

	const fetchStageOrZone = async (value) => {
		setStageZoneOptions({ loading: true, options: [] });
		try {
			let result;
			if (value === "S") {
				// api for model stage call
				result = await getModelStage(modelId);
			} else if (value === "Z") {
				// api for model zone call
				result = await getModelZonesList(modelId);
			} else {
				return;
			}
			if (result.status) {
				result = result.data.map((x) => ({ label: x.name, value: x.id }));
				setStageZoneOptions({ loading: false, options: result });
			} else {
				setStageZoneOptions({ loading: false, options: [] });
			}
		} catch (e) {
			return;
		}
	};

	const handleTiming = (val) => {
		const value = val.value;
		setInput((th) => ({ ...th, timing: value }));
		fetchStageOrZone(val.value);
	};

	const handlePost = async (data) => {
		data["modelVersionID"] = +modelId;
		setLoading(true);
		try {
			let result = await postModelQuestions(data);
			setLoading(false);
			if (result.status) {
				handleAddEditComplete(result.data);
				closeOverride();
			} else {
				if (result.data.title) getError(result.data.title);
				else getError(result.data || "Something went wrong");
			}
		} catch (e) {
			return;
		}
	};

	const handleEdit = async (data) => {
		delete data.roles;
		delete data.options;
		const main = Object.entries(data).map(([key, value]) => ({
			op: "replace",
			path: key,
			value: value,
		}));
		setLoading(true);
		try {
			const response = await patchModelQuestions(questionDetail.id, main);
			setLoading(false);
			if (response.status) {
				handleAddEditComplete(response.data);
				closeOverride();
			} else {
				if (response.data.detail) getError(response.data.detail);
				else getError(response.data.title);
			}
		} catch (e) {
			return;
		}
	};

	const handleSave = async () => {
		const data = { ...input };

		data["roles"] = input.roles.map((x) => ({ modelVersionRoleID: x }));
		data["options"] = input.options.map((x) => ({ name: x }));

		// Empty the object based on unrelated Type
		const ty = input.type;
		if (ty === "N") {
			// If type is number
			data["checkboxCaption"] = "";
			data["options"] = [];
		} else if (ty === "B") {
			// If type is checkbox
			data["decimalPlaces"] = "";
			data["options"] = [];
		} else if (ty === "O" || ty === "C") {
			// if type is checkbox list or dropdown
			data["checkboxCaption"] = "";
			data["decimalPlaces"] = "";
		} else {
			data["checkboxCaption"] = "";
			data["decimalPlaces"] = "";
			data["options"] = [];
		}

		const ti = input.timing;

		if (ti === "S") {
			data["modelVersionZoneID"] = null;
		} else if (ti === "Z") {
			data["modelVersionStageID"] = null;
		} else {
		}
		try {
			const localChecker = await handleValidateObj(
				questionSchema(input.type, input.timing),
				{
					...input,
					decimalPlaces: input.type === "N" ? input.decimalPlaces : null,
				}
			);

			if (!localChecker.some((el) => el.valid === false)) {
				setErrors(defaultError);
				if (editMode) {
					// If Edit Mode
					handleEdit(data);
				} else {
					// If Not Edit Mode
					handlePost(data);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
		} catch (e) {
			return;
		}
	};

	const postRole = async (roleData) => {
		setLoader((th) => ({ ...th, role: true }));
		try {
			let result = await postModelQuestionRole(roleData);
			if (result.status) {
				const role = roleOptions.find(
					(x) => x.id === roleData.ModelVersionRoleID
				);
				setLoader((th) => ({ ...th, role: false }));
				handleOptions({
					...questionDetail,
					roles: [
						...questionDetail.roles,
						{
							id: result.data,
							name: role.name,
							modelVersionRoleID: roleData.ModelVersionRoleID,
						},
					],
				});
				return true;
			} else {
			}
		} catch (e) {
			return;
		}
	};

	const deleteRole = async (id) => {
		setLoader((th) => ({ ...th, role: true }));
		try {
			let result = await deleteModelQuestionRole(id);
			if (result.status) {
				setLoader((th) => ({ ...th, role: false }));
				return true;
			} else {
			}
		} catch (e) {
			return;
		}
	};

	const handleRoles = (id) => {
		let roleIds = input.roles;
		const index = roleIds.indexOf(id);
		// If unchecked
		if (index > -1) {
			// If EditMode
			if (editMode) {
				const role = questionDetail.roles.find(
					(x) => x.modelVersionRoleID === id
				);
				deleteRole(role.id);
				handleOptions({
					...questionDetail,
					roles: questionDetail.roles.filter(
						(x) => x.modelVersionRoleID !== id
					),
				});
			}
			roleIds.splice(index, 1);
			// If checked
		} else {
			if (editMode) {
				postRole({
					ModelVersionQuestionID: questionDetail.id,
					ModelVersionRoleID: id,
				});
			}
			roleIds.push(id);
		}
		setInput((th) => ({ ...th, roles: roleIds }));
	};

	const postOption = async (data) => {
		setLoader((th) => ({ ...th, option: true }));
		try {
			let result = await postModelQuestionOption(data);
			if (result.status) {
				return result.data;
			} else {
				if (result.data.detail) getError(result.data.detail);
				else getError("Something went wrong");
			}
		} catch (e) {
			return;
		} finally {
			setLoader((th) => ({ ...th, option: false }));
		}
	};

	const deleteOption = async (id) => {
		setLoader((th) => ({ ...th, option: true }));
		try {
			let result = await deleteModelQuestionOption(id);
			if (result.status) {
				setLoader((th) => ({ ...th, option: false }));
				handleOptions({
					...questionDetail,
					roles: questionDetail.roles.filter(
						(x) => x.modelVersionRoleID !== id
					),
				});
			} else {
				setLoader((th) => ({ ...th, option: true }));
			}
		} catch (e) {
			return;
		}
	};

	const updateOption = async (id, data) => {
		setLoader((th) => ({ ...th, option: true }));
		try {
			let result = await patchModelQuestionOption(id, data);
			if (result.status) {
				setLoader((th) => ({ ...th, option: false }));
			} else {
				setLoader((th) => ({ ...th, option: true }));
			}
		} catch (e) {
			return;
		}
	};

	const handleAddOption = async (value) => {
		const opt = input.options;
		// Check if it is in editMode or not
		if (editMode) {
			const optData = {
				ModelVersionQuestionID: questionDetail.id,
				Name: value,
				RaiseDefect: true,
			};
			const res = await postOption(optData);
			if (res) {
				handleOptions({
					...questionDetail,
					options: [...questionDetail.options, { name: value, id: res }].sort(),
				});
			}
		}

		setInput((th) => ({ ...th, options: [value, ...opt].sort() }));
		setIsAdd(false);
	};

	const handleRemoveOption = async (index) => {
		const opt = input.options;
		if (editMode) {
			const { id } = questionDetail.options[index];
			await deleteOption(id);
			handleOptions({
				...questionDetail,
				options: questionDetail.options.filter((x) => x.id !== id),
			});
		}
		opt.splice(index, 1);
		setInput((th) => ({ ...th, options: opt }));
		return true;
	};

	const handleUpdateOption = async (index, text) => {
		const opt = input.options;
		if (editMode) {
			const { id } = questionDetail.options[index];
			await updateOption(id, [{ op: "replace", path: "name", value: text }]);
			handleOptions({
				...questionDetail,
				options: questionDetail.options.map((x) =>
					x.id === id ? { id, name: text } : x
				),
			});
		}
		opt[index] = text;
		setInput((th) => ({ ...th, options: opt }));
	};

	const closeOverride = () => {
		setInput({ ...initialInput, roles: [] });
		setErrors(defaultError);
		setStageZoneOptions({ loading: false, options: [] });
		handleClose();
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			style={{ minHeight: 500 }}
			className="large-application-dailog"
			disableEnforceFocus={isChrome() ? modelFocus : false}
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle id="alert-dialog-title">
					<ADD.HeaderText>
						{editMode ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>

				<ADD.ButtonContainer>
					<ADD.CancelButton
						onClick={closeOverride}
						variant="contained"
						onFocus={(e) => {
							setModelFocus(true);
						}}
					>
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleSave}>
						{editMode ? "Close" : "Add " + title}
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<ADD.DialogContent>
				{/* ROW 1 */}

				<ADD.InputContainer style={{ alignItems: "center" }}>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>
							Caption<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ErrorInputFieldWrapper errorMessage={errors.caption}>
							<ADD.NameInput
								error={errors.caption === null ? false : true}
								// helperText={errors.caption === null ? null : errors.caption}
								variant="outlined"
								size="medium"
								value={input.caption}
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, caption: e.target.value });
								}}
								style={{ width: "100%" }}
							/>
						</ErrorInputFieldWrapper>
					</ADD.LeftInputContainer>

					<ADD.RightInputContainer
						style={{ marginTop: errors.caption ? 0 : "9.25px", marginLeft: 16 }}
					>
						<FormGroup>
							<FormControlLabel
								control={
									<EMICheckbox
										state={input.isCompulsory}
										changeHandler={() => {
											setInput((th) => ({
												...th,
												isCompulsory: !th.isCompulsory,
											}));
										}}
									/>
								}
								label={<Typography>Compulsory</Typography>}
							/>
						</FormGroup>
					</ADD.RightInputContainer>
				</ADD.InputContainer>

				{/* ROW 2 */}

				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>
							Type<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ErrorInputFieldWrapper errorMessage={errors.type}>
							<Dropdown
								options={questionTypeOptions}
								selectedValue={questionTypeOptions.find(
									(x) => x.value === input.type
								)}
								width="99%"
								onChange={(val) =>
									setInput((th) => ({ ...th, type: val.value }))
								}
								isError={errors.type === null ? false : true}
							/>
						</ErrorInputFieldWrapper>
					</ADD.LeftInputContainer>

					<ADD.RightInputContainer>
						<ADD.NameLabel>
							Timing<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ErrorInputFieldWrapper errorMessage={errors.timing}>
							<Dropdown
								options={questionTimingOptions}
								selectedValue={questionTimingOptions.find(
									(x) => x.value === input.timing
								)}
								width="99%"
								onChange={handleTiming}
								isError={errors.timing === null ? false : true}
							/>
						</ErrorInputFieldWrapper>
					</ADD.RightInputContainer>
				</ADD.InputContainer>

				{/* ROW 3 */}

				<ADD.InputContainer>
					<ADD.LeftInputContainer
						onBlur={() => {
							setModelFocus(false);
						}}
					>
						{/* <ADD.NameLabel>
							Role<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel> */}
						<ErrorInputFieldWrapper errorMessage={errors.roles}>
							{loader.role ? <LinearProgress /> : null}
							<DynamicDropdown
								showHeader={false}
								label={rolePlural}
								required
								hasCheckBoxList={true}
								dataSource={roleOptions}
								columns={[{ name: "name", id: 1 }]}
								selectdValueToshow="name"
								isServerSide={false}
								width="99%"
								checklistChangeHandler={handleRoles}
								selectedValue={
									!editMode && roleOptions.length === 1
										? roleOptions[0].name
										: roleOptions
												.filter((x) => {
													if (
														input.roles.includes(x.id) ||
														input.roles.includes(x.modelVersionID)
													) {
														return true;
													} else {
														return false;
													}
												})
												.map((x) => x.name)
												.join(", ")
								}
								rolesChecklist={input.roles.map((x) => ({ id: x }))}
								isError={errors.roles === null ? false : true}
							/>
						</ErrorInputFieldWrapper>
					</ADD.LeftInputContainer>
					{/* Check if the timing is selected as Beginning of zone or Beginning of stage*/}
					{input.timing === "Z" || input.timing === "S" ? (
						<>
							<ADD.RightInputContainer>
								{stageZoneOptions.loading ? (
									<CircularProgress style={{ height: 20, width: 20 }} />
								) : (
									<>
										<ADD.NameLabel>
											{input.timing === "S" ? stage : zone}
											<ADD.RequiredStar>*</ADD.RequiredStar>
										</ADD.NameLabel>
										<ErrorInputFieldWrapper
											errorMessage={
												input.timing === "Z"
													? errors.modelVersionZoneID
													: errors.modelVersionStageID
											}
										>
											<Dropdown
												options={stageZoneOptions.options}
												selectedValue={stageZoneOptions.options.find((x) => {
													if (input.timing === "Z") {
														return x.value === input.modelVersionZoneID;
													} else {
														return x.value === input.modelVersionStageID;
													}
												})}
												width="99%"
												onChange={(val) => {
													setInput((th) => ({
														...th,
														modelVersionStageID:
															input.timing === "S" ? val.value : null,
														modelVersionZoneID:
															input.timing === "Z" ? val.value : null,
													}));
												}}
												isError={
													input.timing === "S"
														? errors.modelVersionStageID !== null
														: input.timing === "Z" &&
														  errors.modelVersionZoneID === null
														? false
														: true
												}
												onBlur={() => {
													setModelFocus(false);
												}}
											/>
										</ErrorInputFieldWrapper>
									</>
								)}
							</ADD.RightInputContainer>
						</>
					) : null}
				</ADD.InputContainer>

				{/* ROW 4 */}

				{input.type === "N" ||
				input.type === "B" ||
				input.type === "O" ||
				input.type === "C" ? (
					<ADD.InputContainer style={{ flexDirection: "column" }}>
						<ADD.NameLabel>
							{input.type === "N"
								? "Decimal Places"
								: input.type === "B"
								? "Checkbox Caption"
								: "List Options"}
							<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						{input.type === "N" || input.type === "B" ? (
							<ErrorInputFieldWrapper
								errorMessage={
									errors.decimalPlaces || errors.checkboxCaption !== null
										? errors.decimalPlaces || errors.checkboxCaption
										: null
								}
							>
								<ADD.NameInput
									style={{ width: "49.5%", paddingRight: 16 }}
									size="medium"
									error={
										errors.decimalPlaces || errors.checkboxCaption !== null
											? true
											: false
									}
									variant="outlined"
									type={input.type === "N" ? "number" : "string"}
									onChange={(e) => {
										const { value } = e.target;
										setInput((th) => ({
											...th,
											decimalPlaces: input.type === "N" ? value : "",
											checkboxCaption: input.type === "B" ? value : "",
										}));
									}}
									value={
										input.type === "N"
											? input.decimalPlaces
											: input.type === "B"
											? input.checkboxCaption
											: ""
									}
								/>
							</ErrorInputFieldWrapper>
						) : (
							<>
								<ErrorInputFieldWrapper errorMessage={errors.options}>
									{loader.option ? <LinearProgress /> : null}
									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											gridColumnGap: 37,
										}}
									>
										{isAdd ? (
											<NewOption
												addNewOption={handleAddOption}
												setIsAdd={setIsAdd}
											/>
										) : null}
										{input.options.map((x, i) => (
											<Options
												key={i}
												id={i}
												x={x}
												handleRemoveOption={handleRemoveOption}
												handleUpdateOption={handleUpdateOption}
											/>
										))}
									</div>
								</ErrorInputFieldWrapper>
								<CurveButton
									style={{ float: "left", width: 108 }}
									onClick={() => setIsAdd(true)}
									onBlur={() => {
										setModelFocus(false);
									}}
								>
									Add Option
								</CurveButton>
							</>
						)}
					</ADD.InputContainer>
				) : null}
			</ADD.DialogContent>
		</Dialog>
	);
};
export default AddEditModel;
