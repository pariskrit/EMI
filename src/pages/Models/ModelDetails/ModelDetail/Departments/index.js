import React, { useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxInput from "components/Elements/CheckboxInput";
import { makeStyles } from "@material-ui/core/styles";
import {
	addModelDepartment,
	deleteModelDepartment,
} from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles((theme) => ({
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
	modelId,
	isReadOnly,
}) {
	const classes = useStyles();
	const [tickInputLists, setTickInputLists] = useState([]);
	const dispatch = useDispatch();

	const onTickInputClick = async (data) => {
		if (isReadOnly) {
			return;
		}

		let prevData = [...tickInputLists];

		setTickInputLists([
			...tickInputLists.map((input) =>
				input.id === data.id
					? { ...input, checked: input.checked ? false : true }
					: input
			),
		]);

		let response = data.checked
			? await deleteModelDepartment(data.deleteId)
			: await addModelDepartment({
					modelID: modelId,
					siteDepartmentID: data.id,
			  });

		if (!response.status) {
			setTickInputLists(prevData);

			dispatch(showError(response.data || "Could not check input box"));
		}
	};

	useEffect(() => {
		if (listOfDepartment && listOfDepartment.length) {
			setTickInputLists([
				...listOfDepartment.map((department) => ({
					id: department.modelDepartmentID,
					deleteId: department.id,
					checked: !!department.id,
					label: department.name,
				})),
			]);
		}
	}, [listOfDepartment]);

	const pluralDepartmentsTitle =
		customCaptions["departmentPlural"] ?? "Departments";

	return (
		<AccordionBox title={pluralDepartmentsTitle}>
			<div className={classes.contentContainer}>
				<p className={classes.italic}>
					<em>
						Bill Thompson has access to Services of the following{" "}
						{pluralDepartmentsTitle}
					</em>
				</p>
				{tickInputLists.map((detail) => (
					<CheckboxInput
						key={detail.id}
						state={detail}
						handleCheck={onTickInputClick}
					/>
				))}
			</div>
		</AccordionBox>
	);
}

export default Departments;
