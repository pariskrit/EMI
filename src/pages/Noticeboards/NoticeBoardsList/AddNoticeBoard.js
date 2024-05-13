import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { makeStyles } from "tss-react/mui";

import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleValidateObj,
	isoDateFormat,
} from "helpers/utils";
import { useDispatch } from "react-redux";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { showError } from "redux/common/actions";
import { defaultPageSize } from "helpers/utils";
import AttachmentUpload from "./AttachmentUpload";
import {
	deleteNoticeboardDepartment,
	getNoticeboardDepartment,
	getSiteDepartmentsInService,
	updateNoticeboardDepartment,
} from "services/services/serviceLists";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import {
	patchNoticeBoard,
	postNewNoticeBoardsFile,
} from "services/noticeboards/noticeBoardsList";
import CheckboxInput from "components/Elements/CheckboxInput";

// Init styled components
const ADD = AddDialogStyle();

// Yup validation schema
const schema = () =>
	yup.object({
		name: yup
			.string("This field must be a string")
			.required("This field is required"),
		description: yup.string("This field must be a string").nullable(),
		file: yup
			.mixed()
			.test("fileType", "File size limited to 6 MB", (value) => {
				return value
					? value.size < 6 * 1024 * 1024 || typeof value === "string"
					: true;
			})
			.nullable(),
		link: yup
			.string("This field must be a string")
			.when(["file"], (file, schema) =>
				!file ? schema.required("Either Document or Link is required.") : schema
			),

		siteDepartments: yup.array("This field must be a string").nullable(),
		expiryDate: yup.string("This field must be a string").nullable(),
	});

const useStyles = makeStyles()((theme) => ({
	dialogContent: {
		width: 500,
	},
	createButton: {
		width: "auto",
	},
	departmentTitle: {
		fontSize: "14px",
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		marginBottom: "5px",
	},
}));

// Default state schemas
const defaultErrorSchema = {
	name: null,
	description: null,
	file: null,
	link: null,
	siteDepartments: null,
	expiryDate: null,
};
const defaultStateSchema = {
	name: "",
	description: "",
	file: null,
	link: "",
	siteDepartments: [],
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
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [Focus, setFocus] = useState(false);
	const [departmentList, setDepartmentList] = useState([]);
	const [isDisabled, setIsDisabled] = useState({});

	const pluralDepartmentsTitle =
		customCaptions?.["departmentPlural"] ?? "Departments";

	useEffect(() => {
		if (data) {
			setInput({
				id: data?.id,
				name: data?.name,
				description: data?.description || "",
				file: data?.documentURL ? data?.name : null,
				link: data?.link || "",
				siteDepartments: [
					{
						id: data?.siteDepartments,
						name: data?.siteDepartmentName,
					},
				],
				expiryDate: data.expiryDate ? isoDateFormat(data.expiryDate + "Z") : "",
			});
		}
	}, [data]);
	const getCheckedDepartments = async (id) => {
		let response = await getNoticeboardDepartment(id);
		if (response.status) {
			let datas = response?.data.map((x) => ({
				...x,
				label: x?.name,
				deletedID: x?.id,
			}));

			let checkData = datas.map((x) => {
				if (x?.id) {
					return {
						...x,
						checked: true,
					};
				} else {
					return {
						...x,
						checked: false,
					};
				}
			});
			setDepartmentList(checkData);
		}
	};

	const handleDepartmentChecked = (val) => {
		let ids = input?.siteDepartments?.includes(val.id);
		if (!ids) {
			setInput((prev) => ({
				...prev,
				siteDepartments: [...prev.siteDepartments, val?.id],
			}));
		} else {
			setInput((prev) => ({
				...prev,
				siteDepartments: prev.siteDepartments?.filter((x) => x !== val.id),
			}));
		}
	};

	const handleEditDepartmentChecked = async (val) => {
		let prevData = [...departmentList];
		setIsDisabled((prev) => ({
			...prev,
			[val.noticeboardDepartmentID]: true,
		}));

		let response = val.checked
			? await deleteNoticeboardDepartment(val?.deletedID)
			: await updateNoticeboardDepartment({
					noticeboardID: input?.id,
					siteDepartmentID: val?.noticeboardDepartmentID,
			  });
		// let response = false;
		if (!response.status) {
			setInput(prevData);
			dispatch(showError(response?.data || "Could not check input box"));
		} else {
			fetchData();
			setInput((prev) => ({
				...prev,
			}));
			setDepartmentList((prev) => [
				...prev.map((data) =>
					data.noticeboardDepartmentID === val?.noticeboardDepartmentID
						? {
								...data,
								checked: data?.checked ? false : true,
								deletedID: val?.checked ? data?.deletedID : response?.data,
						  }
						: data
				),
			]);
		}
		setIsDisabled((prev) => ({
			...prev,
			[val.noticeboardDepartmentID]: false,
		}));
	};

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		setIsLoading(false);
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
			siteDepartments: input?.siteDepartments || null,
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
						pageSize: defaultPageSize(),
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
							newData?.data?.detail ||
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
		setIsLoading(true);
		if (name === "link") {
			setInput({ ...input, file: null });
		}

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
				setIsLoading(false);
			} else {
				dispatch(
					showError(
						response?.data?.detail ||
							"Failed to edit  " + customCaptions?.tutorial
					)
				);
				if (name !== "link")
					setInput((prev) => ({ ...prev, [name]: data[name] }));
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
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
					filename: e?.[0]?.name,
				});
				if (response.status) {
					try {
						await fetch(response.data.url, {
							method: "PUT",
							body: e?.[0],
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

	const fetchDepartmentList = async () => {
		let response = await getSiteDepartmentsInService(siteID);
		if (response.status) {
			let datas = response.data.map((x) => ({
				...x,
				label: x.name,
				deleteId: x.id,
			}));
			setDepartmentList(datas);
		}
	};

	// useEffect(() => {
	// 	fetchDepartmentList();
	// }, []);

	useEffect(() => {
		if (isEdit && open) {
			getCheckedDepartments(data?.id);
		} else {
			fetchDepartmentList();
		}
	}, [isEdit, open]);

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className="medium-application-dailog"
			>
				{isUpdating || isLoading ? <LinearProgress /> : null}

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
								onBlur={() => handleBlurField("link", input?.link)}
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
									onBlur={() => {
										setFocus(false);
										handleBlurField(
											"expiryDate",
											new Date(new Date(input?.expiryDate).getTime()).toJSON()
										);
									}}
									onFocus={() => setFocus(true)}
									isRequired={false}
									type={input?.expiryDate || Focus ? "datetime-local" : "text"}
									error={errors.expiryDate === null ? false : true}
								/>
							</ErrorInputFieldWrapper>
						</ADD.LeftInputContainer>
					</ADD.InputContainer>

					<div>
						<p className={classes.departmentTitle}>{pluralDepartmentsTitle}</p>
						<p>
							<em>
								{customCaptions.tutorialPlural ?? "Noticeboards"}
								&nbsp;will be displayed on Mobile Devices for the
								following&nbsp;
								{pluralDepartmentsTitle}.
							</em>
						</p>
						{departmentList.map((detail) => (
							<CheckboxInput
								key={detail?.noticeboardDepartmentID}
								state={detail}
								handleCheck={
									isEdit ? handleEditDepartmentChecked : handleDepartmentChecked
								}
								isDisabled={isDisabled[detail?.noticeboardDepartmentID]}
							/>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewNoticeBoardDetail;
