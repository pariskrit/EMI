import * as yup from "yup";
import React, { useState } from "react";
import { DialogContent } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { usersPath } from "helpers/routePaths";
import { makeStyles } from "@material-ui/core/styles";
import { addUserToList } from "services/users/usersList";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import EMICheckbox from "components/Elements/EMICheckbox";
import AccordionBox from "components/Layouts/AccordionBox";
import ClientNotes from "pages/Clients/ClientDetailScreen/Notes/ClientNotes";

const schema = yup.object({
	firstName: yup
		.string("This field must be a string")
		.required("This field is required"),
	lastName: yup
		.string("This field must be a string")
		.required("This field is required"),
	email: yup
		.string("This field must be a string")
		.required("This field is required")
		.email("Invalid email format"),
	password: yup
		.string("This field must be a string")
		.required("This field is required"),
});

const ADD = AddDialogStyle();
const defaultData = { firstName: "", lastName: "", email: "", password: "" };
const defaultError = {
	firstName: null,
	lastName: null,
	email: null,
	password: null,
};

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	createButton: {
		[media]: {
			width: "auto",
		},
	},
	labelText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "14px",
		marginBottom: "10px",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	inputText: {
		fontSize: 14,
	},
	inputContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		marginBottom: 20,
	},
});

const TaskDetails = ({
	open,
	handleClose,
	handleAddData,
	setSearchQuery,
	getError,
}) => {
	let history = useHistory();

	const classes = useStyles();
	const [input, setInput] = useState(defaultData);
	const [errors, setErrors] = useState(defaultError);
	const [loading, setLoading] = useState(false);

	const closeOverride = () => {
		handleClose();
		setInput(defaultData);
		setErrors(defaultError);
	};

	const handleCreateData = async () => {
		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await addUser();
				if (newData.success) {
					setLoading(false);
					closeOverride();
				} else {
					setErrors({ ...errors, ...newData.errors });
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
			closeOverride();
		}
	};

	const handleRedirect = (id) => {
		history.push(`${usersPath}/${id}`);
	};

	//Add
	const addUser = async () => {
		// Remove search
		setSearchQuery("");

		// Attempting to create client
		try {
			let data = {
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				password: input.password,
			};

			// Sending create POST to backend
			let result = await addUserToList(data);

			if (result.status) {
				//Adding new user
				handleAddData(data);

				handleRedirect(result.data);

				return { success: true };
			} else {
				if (result.data) {
					getError(result.data);
					return { success: false };
				} else {
					return { success: false, errors: { ...result.data.errors } };
				}
			}
		} catch (err) {
			throw new Error(err.response);
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (!loading) {
			if (e.keyCode === 13) {
				handleCreateData();
			}
		}
	};

	return (
		<DialogContent className={classes.dialogContent}>
			<div>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>Action</ADD.NameLabel>
						<DyanamicDropdown
							isServerSide={false}
							width="100%"
							placeholder="Select Action"
							dataHeader={[{ id: 1, name: "Actions" }]}
							columns={[{ id: 1, name: "Actions" }]}
							dataSource={[]}
							showHeader
							// selectedValue={dropDownValue.status}
							handleSort={handleSort}
							// onChange={(val) => handleChange("status", val)}
							selectdValueToshow="Actions"
						/>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<ADD.NameLabel>Roles</ADD.NameLabel>
						<DyanamicDropdown
							isServerSide={false}
							width="100%"
							placeholder="Select Roles"
							dataHeader={[{ id: 1, name: "Roless" }]}
							columns={[{ id: 1, name: "Roless" }]}
							dataSource={[]}
							showHeader
							// selectedValue={dropDownValue.status}
							handleSort={handleSort}
							// onChange={(val) => handleChange("status", val)}
							selectdValueToshow="Roless"
						/>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>
							Name<ADD.RequiredStar>*</ADD.RequiredStar>
						</ADD.NameLabel>
						<ADD.NameInput
							error={errors.email === null ? false : true}
							helperText={errors.email === null ? null : errors.email}
							fullWidth
							onChange={(e) => setInput({ ...input, email: e.target.value })}
							onKeyDown={handleEnterPress}
							variant="outlined"
						/>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<ADD.NameLabel>System</ADD.NameLabel>
						<DyanamicDropdown
							isServerSide={false}
							width="100%"
							placeholder="Select System"
							dataHeader={[{ id: 1, name: "System" }]}
							columns={[{ id: 1, name: "System" }]}
							dataSource={[]}
							showHeader
							// selectedValue={dropDownValue.status}
							handleSort={handleSort}
							// onChange={(val) => handleChange("status", val)}
							selectdValueToshow="System"
						/>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.NameLabel>Operating Mode</ADD.NameLabel>
						<DyanamicDropdown
							isServerSide={false}
							width="100%"
							placeholder="Select Operating Mode"
							dataHeader={[{ id: 1, name: "Operating Mode" }]}
							columns={[{ id: 1, name: "Operating Mode" }]}
							dataSource={[]}
							showHeader
							// selectedValue={dropDownValue.status}
							handleSort={handleSort}
							// onChange={(val) => handleChange("status", val)}
							selectdValueToshow="Operating Mode"
						/>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<ADD.NameLabel>Estimated Minutes</ADD.NameLabel>
						<ADD.NameInput
							error={errors.email === null ? false : true}
							helperText={errors.email === null ? null : errors.email}
							fullWidth
							onChange={(e) => setInput({ ...input, email: e.target.value })}
							onKeyDown={handleEnterPress}
							variant="outlined"
						/>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					<ADD.LeftInputContainer>
						<ADD.CheckboxLabel>
							<EMICheckbox
								state={input.publish}
								changeHandler={() => {
									setInput({
										...input,
										publish: !input.publish,
									});
								}}
							/>
							Saftey Critical?
						</ADD.CheckboxLabel>
					</ADD.LeftInputContainer>
					<ADD.RightInputContainer>
						<ADD.CheckboxLabel>
							<EMICheckbox
								state={input.publish}
								changeHandler={() => {
									setInput({
										...input,
										publish: !input.publish,
									});
								}}
							/>
							Cannot Be Skipped?
						</ADD.CheckboxLabel>
					</ADD.RightInputContainer>
				</ADD.InputContainer>
				<ADD.InputContainer>
					<ClientNotes clientId={1} getError={getError} />
				</ADD.InputContainer>
			</div>
		</DialogContent>
	);
};

export default TaskDetails;
