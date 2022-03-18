import React, { useCallback, useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { useParams } from "react-router-dom";
import { updateModel } from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import DropdownContainer from "components/Elements/DropdownContainer";

const inputDetails = [
	{ id: 1, label: "Make", name: "name" },
	{ id: 3, label: "Model", name: "modelName" },
	{ id: 6, label: "Type", type: "dropdown", name: "modelTypeID" },
	{ id: 4, label: "Serial Number Range", name: "serialNumberRange" },

	{ id: 5, label: "Developer Name", name: "displayName" },
];
function Details({ classes, data, customCaptions, isReadOnly, Ctxdispatch }) {
	const { id } = useParams();
	const [details, setDetails] = useState([]);
	const [oldDetails, setOldDetails] = useState([]);
	const [apiStatus, setApiStatus] = useState({});
	const [isInputChanged, setInputChanged] = useState(false);
	const [selectedDropdownInput, setSelectedDropdownInput] = useState({});

	const dispatch = useDispatch();

	const onInputChange = (e) => {
		setInputChanged({ [e.target.name]: true });
		setDetails([
			...details.map((detail) =>
				detail.name === e.target.name
					? { ...detail, value: e.target.value }
					: detail
			),
		]);
	};

	const onUpdateInput = async (e) => {
		const inputName = e.target.name;
		const value = e.target.value;

		if (!isInputChanged[inputName]) {
			return;
		}

		setApiStatus({ ...apiStatus, [inputName]: "updating" });
		const response = await updateModel(id, [
			{ op: "replace", path: inputName, value: e.target.value },
		]);

		if (!response.status) {
			dispatch(
				showError(
					response.data.detail ||
						response.data.errors.name[0] ||
						"Error: Could not update input"
				)
			);
			setDetails(oldDetails);
		} else {
			setOldDetails(details);
		}

		setApiStatus({ ...apiStatus, [inputName]: "idle" });

		if (inputName === "name" && response.status) {
			Ctxdispatch({
				type: "TAB_COUNT",
				payload: { countTab: "name", data: value },
			});
		}
		setInputChanged({});
	};

	const onEnterPress = (e) => {
		if (e.key === "Enter") {
			onUpdateInput(e);
		}
	};

	const onDropdownInputChange = async (name, type) => {
		setSelectedDropdownInput({ ...selectedDropdownInput, [name]: type });

		const response = await updateModel(id, [
			{ op: "replace", path: name, value: type.value },
		]);

		if (!response.status) {
			dispatch(showError("Error: Could not update input"));
		}
	};

	const modifyDropdownData = useCallback(
		(data) =>
			isReadOnly
				? []
				: data.map((type) => ({ label: type?.name, value: type.id })),
		[isReadOnly]
	);

	const modifyApiData = useCallback(
		(details, modelTypes) =>
			inputDetails.map((input) => ({
				...input,
				label: customCaptions[input.label.toLowerCase()] ?? input.label,
				value:
					input.name === "modelTypeID"
						? modifyDropdownData(modelTypes)
						: details[input?.name],
			})),
		[customCaptions, modifyDropdownData]
	);

	useEffect(() => {
		if (details.length === 0) {
			const { details, modelTypes } = data;
			const inputProps = modifyApiData(details, modelTypes);
			setDetails(inputProps);
			setOldDetails(inputProps);

			setSelectedDropdownInput({
				modelTypeID: {
					label: details.modelTypeName,
					value: details.modelTypeID,
				},
			});
		}
	}, [data, details, modifyApiData]);
	return (
		<AccordionBox title="Details">
			<div className={classes.inputContainer}>
				{details.map((input) =>
					input?.type === "dropdown" ? (
						<DropdownContainer
							key={input.id}
							label={input.label}
							name={input.name}
							options={input.value}
							onChange={onDropdownInputChange}
							selectedInputData={selectedDropdownInput[input.name]}
							isReadOnly={isReadOnly}
						/>
					) : (
						<TextFieldContainer
							key={input.id}
							label={input.label}
							name={input.name}
							value={input.value}
							onChange={onInputChange}
							onBlur={onUpdateInput}
							isFetching={apiStatus[input.name] === "updating"}
							isDisabled={isReadOnly}
							onKeyDown={onEnterPress}
						/>
					)
				)}
			</div>
		</AccordionBox>
	);
}

export default Details;
