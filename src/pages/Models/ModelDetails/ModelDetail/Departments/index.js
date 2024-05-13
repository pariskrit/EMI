import React, { useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxInput from "components/Elements/CheckboxInput";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import {
	addModelDepartment,
	deleteModelDepartment,
} from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles()((theme) => ({
	contentContainer: {
		marginTop: -30,
	},
	italic: {
		marginBottom: 11,
	},
	inputText: {
		fontSize: 14,
	},

	tickInputContainer: {
		width: "100%",
	},
}));

function Departments({
	listOfDepartment,
	customCaptions,
	modelId = "",
	isReadOnly,
	isPublished,
	isDuplicate = false,
	onBlur = () => {},
	setRegisteredDepartments = () => {},
}) {
	const { classes, cx } = useStyles();
	const [tickInputLists, setTickInputLists] = useState([]);
	const [isDisabled, setIsDisabled] = useState({});

	const dispatch = useDispatch();

	const onTickInputClick = async (data) => {
		if (isReadOnly) {
			return;
		}

		let prevData = [...tickInputLists];

		setIsDisabled((prev) => ({ ...prev, [data.id]: true }));

		let response = data.checked
			? await deleteModelDepartment(data.deleteId)
			: await addModelDepartment({
					modelVersionId: modelId,
					siteDepartmentID: data.id,
			  });

		if (!response.status) {
			setTickInputLists(prevData);

			dispatch(showError(response?.data || "Could not check input box"));
		} else {
			setTickInputLists((prev) => [
				...prev.map((input) =>
					input.id === data.id
						? {
								...input,
								checked: input.checked ? false : true,
								deleteId: data.checked ? input.deleteId : response?.data,
						  }
						: input
				),
			]);
		}

		setIsDisabled((prev) => ({ ...prev, [data.id]: false }));
	};

	const onAvailableDepartmentsClick = (data) => {
		setTickInputLists((prev) => [
			...prev.map((input) =>
				input.id === data.id
					? {
							...input,
							checked: input.checked ? false : true,
					  }
					: input
			),
		]);
		setRegisteredDepartments((prev) => [
			...prev.map((input) =>
				input.id === data.id
					? {
							...input,
							checked: input.checked ? false : true,
					  }
					: input
			),
		]);
	};

	useEffect(() => {
		if (listOfDepartment && listOfDepartment.length) {
			setTickInputLists([
				...listOfDepartment.map((department) => ({
					id: department.modelDepartmentID || department.id,
					deleteId: department.id,
					checked: isDuplicate
						? !!department.id
						: modelId
						? !!department.id
						: false,
					label: department.name,
				})),
			]);
		}
		setRegisteredDepartments([
			...listOfDepartment.map((department) => ({
				id: department.modelDepartmentID || department.id,
				deleteId: department.id,
				checked: false,
				label: department.name,
			})),
		]);
	}, [listOfDepartment]);

	const pluralDepartmentsTitle =
		customCaptions["departmentPlural"] ?? "Departments";
	const pluralServicesTitle = customCaptions["servicePlural"] ?? "Services";

	return (
		<AccordionBox title={pluralDepartmentsTitle}>
			<div className={classes.contentContainer}>
				<p className={classes.italic}>
					<em>
						{pluralServicesTitle} can be registered for the following{" "}
						{pluralDepartmentsTitle}.
					</em>
				</p>
				{tickInputLists.map((detail, index) =>
					index === tickInputLists.length - 1 ? (
						<CheckboxInput
							key={detail.id}
							state={detail}
							handleCheck={
								modelId ? onTickInputClick : onAvailableDepartmentsClick
							}
							isDisabled={isPublished ? true : isDisabled[detail.id]}
							onBlur={onBlur}
						/>
					) : (
						<CheckboxInput
							key={detail.id}
							state={detail}
							handleCheck={
								modelId ? onTickInputClick : onAvailableDepartmentsClick
							}
							isDisabled={isPublished ? true : isDisabled[detail.id]}
						/>
					)
				)}
			</div>
		</AccordionBox>
	);
}

export default Departments;
