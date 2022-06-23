import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showError } from "redux/common/actions";
import { DefaultPageSize } from "helpers/constants";
import AttachmentUpload from "./AttachmentUpload";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import {
	patchNoticeBoard,
	postNewNoticeBoardsFile,
} from "services/noticeboards/noticeBoardsList";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = () =>
	yup.object({
		name: yup
			.string("This field must be a string")
			.required("This field is required"),
		description: yup.string("This field must be a string").nullable(),
		file: yup.mixed().test("fileType", "File size limited to 6 MB", (value) => {
			return value.size < 6 * 1024 * 1024 || typeof value === "string";
		}),
		link: yup.string("This field must be string"),

		siteDepartmentID: yup.string("This field must be a string").nullable(),
		expiryDate: yup.string("This field must be a string").nullable(),
	});

const useStyles = makeStyles({
	dialogContent: {
		width: 500,
	},
	createButton: {
		// width: "auto",
	},
});

// Default state schemas
const defaultErrorSchema = {
	name: null,
	description: null,
	file: null,
	link: null,
	siteDepartmentID: null,
	expiryDate: null,
};
const defaultStateSchema = {
	name: "",
	description: "",
	file: null,
	link: "",
	siteDepartmentID: {},
	expiryDate: "",
};

function AddNewNoticeBoardDetail({
	open,
	closeHandler,
	siteAppId,
	title,
	createProcessHandler,
	customCaptions,
	setSearchQuery,
	fetchData,
	setDataForFetchingNoticeBoard,
	siteID,
	data,
	isEdit = false,
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);

	useEffect(() => {
		if (data) {
			setInput({
				name: data.name,
				description: data.description,
				file: data.documentURL ? data.name : null,
				link: data.link,
				siteDepartmentID: {
					id: data.siteDepartmentID,
					name: data.siteDepartmentName,
				},
				expiryDate: data.expiryDate
					? dayjs(data.expiryDate + "Z").format("YYYY-MM-DDTHH:mm:ss")
					: "",
			});
		}
	}, [data]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		closeHandler();
	};

	const handleCreateProcess = async () => {
		// clear search data
		setSearchQuery("");

		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input
		const cleanInput = {
			...input,
			siteDepartmentID: input?.siteDepartmentID?.id || null,
			expiryDate: input?.expiryDate
				? new Date(new Date(input?.expiryDate).getTime()).toJSON()
				: null,
		};

		try {
			const localChecker = await handleValidateObj(
				schema(input?.modelID?.modelTemplateType),
				cleanInput
			);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const payload = {
					...cleanInput,
					siteAppId: siteAppId,
				};

				const newData = await createProcessHandler(payload);

				if (newData.status === true) {
					setDataForFetchingNoticeBoard({
						pageNumber: 1,
						pageSize: DefaultPageSize,
						search: "",
						sortField: "",
						sort: "",
					});
					await fetchData();
					setIsUpdating(false);
					closeOverride();
				} else {
					setIsUpdating(false);

					dispatch(
						showError(
							newData.data.detail ||
								"Failed to add new " + customCaptions?.tutorial
						)
					);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			console.log(err);
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });

			dispatch(showError("Failed to add new " + customCaptions?.tutorial));
		}
	};

	// API call to patch the changes of fields after editng
	const handleBlurField = async (name, value) => {
		let response;

		// if open in add mode return
		if (!isEdit) return;

		// if name is empty reset to old name and return
		if (name === "name" && !value) {
			setInput((prev) => ({ ...prev, name: data.name }));
			return;
		}

		if (value === data[name]) return;
		setIsUpdating(true);

		try {
			response =
				name === "link"
					? await patchNoticeBoard(data.id, [
							{ op: "replace", path: name, value: value },
							{ op: "replace", path: "documentKey", value: null },
					  ])
					: await patchNoticeBoard(data.id, [
							{ op: "replace", path: name, value: value },
					  ]);
			if (response.status) {
				await fetchData();
				setIsUpdating(false);
			} else {
				dispatch(
					showError(
						response.data.detail ||
							"Failed to edit  " + customCaptions?.tutorial
					)
				);
				setInput((prev) => ({ ...prev, [name]: data[name] }));
			}
		} catch (error) {
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDropDocument = async (e) => {
		setInput({
			...input,
			file: e[0],
			link: "",
		});
		if (isEdit) {
			setIsUpdating(true);
			let response;
			try {
				response = await postNewNoticeBoardsFile({
					filename: e[0].name,
				});
				if (response.status) {
					try {
						await fetch(response.data.url, {
							method: "PUT",
							body: e[0],
						});
						await patchNoticeBoard(data.id, [
							{ op: "replace", path: "documentKey", value: response.data.key },
							{ op: "replace", path: "link", value: null },
						]);
						await fetchData();
					} catch (error) {}
				} else {
					dispatch(
						showError(
							response.data.detail ||
								"Failed to add new " + customCaptions?.tutorial
						)
					);
				}
			} catch (error) {
				dispatch(showError("Failed to add new " + customCaptions?.tutorial));
			} finally {
				setIsUpdating(false);
			}
		}
	};

	const handleKeydownPress = (e, name, value) => {
		if (e.keyCode === 13) {
			if (isEdit) handleBlurField(name, value);
			else handleCreateProcess();
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
			>
				{isUpdating ? <LinearProgress /> : null}

				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>{title}</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeOverride} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={!isEdit ? handleCreateProcess : closeOverride}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{isEdit ? "Save" : title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								value={input.name}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
								}}
								onBlur={() => handleBlurField("name", input.name)}
								onKeyDown={(e) => handleKeydownPress(e, "name", input.name)}
								variant="outlined"
								fullWidth
								autoFocus
							/>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ADD.NameLabel>Description</ADD.NameLabel>
							<ADD.NameInput
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
								value={input.description}
								onChange={(e) => {
									setInput({ ...input, description: e.target.value });
								}}
								onBlur={() => handleBlurField("description", input.description)}
								onKeyDown={handleKeydownPress}
								variant="outlined"
								fullWidth
							/>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>Document</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.file === null ? null : errors.file}
							>
								<AttachmentUpload
									onDrop={handleDropDocument}
									file={input.file}
									removeImage={() => setInput({ ...input, file: null })}
								/>
							</ErrorInputFieldWrapper>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.FullWidthContainer style={{ paddingRight: 0 }}>
							<ADD.NameLabel>Link</ADD.NameLabel>
							<ADD.NameInput
								error={errors.link === null ? false : true}
								helperText={errors.link === null ? null : errors.link}
								value={input.link}
								onChange={(e) => {
									setInput({ ...input, link: e.target.value, file: null });
								}}
								onBlur={() => handleBlurField("link", input.link)}
								onKeyDown={handleKeydownPress}
								variant="outlined"
								fullWidth
							/>
						</ADD.FullWidthContainer>
					</ADD.InputContainer>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.expiryDate === null ? null : errors.expiryDate
								}
							>
								<TextFieldContainer
									label={"Expiry Date"}
									name={"expiryDate"}
									value={input.expiryDate}
									onChange={(e) => {
										setInput({ ...input, expiryDate: e.target.value });
									}}
									onBlur={() =>
										handleBlurField(
											"expiryDate",
											new Date(new Date(input?.expiryDate).getTime()).toJSON()
										)
									}
									isRequired={false}
									type="datetime-local"
									placeholder="Select Date"
									error={errors.expiryDate === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
						<ADD.RightInputContainer>
							<ErrorInputFieldWrapper
								errorMessage={
									errors.siteDepartmentID === null
										? null
										: errors.siteDepartmentID
								}
							>
								<DyanamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={"Select " + customCaptions?.department}
									dataHeader={[{ id: 1, name: customCaptions?.department }]}
									columns={[{ id: 1, name: "name" }]}
									selectedValue={{
										...input["siteDepartmentID"],
									}}
									handleSort={handleSort}
									onChange={(val) => {
										setInput({
											...input,
											siteDepartmentID: val,
										});
										if (isEdit) {
											handleBlurField("siteDepartmentID", val.id);
										}
									}}
									selectdValueToshow={"name"}
									label={customCaptions?.department}
									isError={errors.siteDepartmentID === null ? false : true}
									fetchData={() => getSiteDepartmentsInService(siteID)}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewNoticeBoardDetail;
