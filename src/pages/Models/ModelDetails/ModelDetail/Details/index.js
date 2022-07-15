import React, { useCallback, useEffect, useState } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { useParams } from "react-router-dom";
import { updateModel } from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import DropdownContainer from "components/Elements/DropdownContainer";
import { convertDateToUTC } from "helpers/utils";
import { materialUiDate } from "helpers/date";
import withMount from "components/HOC/withMount";

const inputDetails = [
	{ id: 1, label: "Make", name: "name" },
	{ id: 3, label: "Model", name: "modelName" },
	{ id: 6, label: "Type", type: "dropdown", name: "modelTypeID" },
	{
		id: 4,
		label: "Serial Number Range",
		name: "serialNumberRange",
		isRequired: false,
	},

	{
		id: 5,
		label: "Developer Name",
		name: "displayName",
		isRequired: false,
		isDisabled: true,
	},
];
function Details({
	classes,
	data,
	customCaptions,
	isReadOnly,
	Ctxdispatch,
	application,
	isMounted,
}) {
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

	const handleReviewDateBlur = async (name, e) => {
		try {
			const response = await updateModel(id, [
				{
					op: "replace",
					path: name,
					value: convertDateToUTC(new Date(e.target.value)),
				},
			]);

			if (!response.status) {
				if (!isMounted.aborted) {
					dispatch(showError("Error: Could not update the review date"));
					setReviewDate(oldReviewDate);
				}
			} else {
				Ctxdispatch({
					type: "UPDATE_REVIEWDATE",
					payload: reviewDate,
				});
			}
		} catch (error) {
			dispatch(
				showError(error?.data?.detail || "Error: Could not update input")
			);
		}
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

		if (
			(response.status && inputName === "name") ||
			(response.status && inputName === "modelName")
		) {
			Ctxdispatch({
				type: "TAB_COUNT",
				payload: {
					countTab: inputName === "name" ? "name" : "modelName",
					data: value,
				},
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
			inputDetails
				.filter((input) =>
					(data?.details?.modelType === "F" && input.label === "Model") ||
					(input.label === "Serial Number Range" &&
						data?.details?.modelType === "F") ||
					(input.label === "Serial Number Range" &&
						!application.showSerialNumberRange)
						? false
						: true
				)
				.map((input) => ({
					...input,
					label: customCaptions[input.label.toLowerCase()] ?? input.label,
					value:
						input.name === "modelTypeID"
							? modifyDropdownData(modelTypes)
							: details[input?.name],
				})),
		[customCaptions, modifyDropdownData, data, application]
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

	console.log(details);
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
							label={
								input.id === 1
									? data?.details?.modelType === "F"
										? customCaptions.modelTemplate
										: input.label
									: input.label
							}
							name={input.name}
							value={input.value}
							onChange={onInputChange}
							onBlur={onUpdateInput}
							isFetching={apiStatus[input.name] === "updating"}
							isDisabled={isReadOnly || input.isDisabled}
							isRequired={input.isRequired}
							onKeyDown={onEnterPress}
						/>
					)
				)}
			</div>
		</AccordionBox>
	);
}

export default withMount(Details);
