import React, { useEffect, useMemo } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxInput from "components/Elements/CheckboxInput";
import { updateModel } from "services/models/modelDetails/details";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { useState } from "react";
import { settingsInputList } from "constants/modelDetails";

function Settings({ data, customCaptions, isReadOnly }) {
	const dispatch = useDispatch();

	const [inputDetails, setInputDetails] = useState([]);
	const [isDisabled, setIsDisabled] = useState({});

	const { id } = useParams();
	const labels = useMemo(
		() => ({
			allowTickAllPartsTools: `Allow 'Tick All' for ${customCaptions["partPlural"]}/${customCaptions["toolPlural"]} in ${customCaptions["service"]}`,
			listPartsToolsByStageZone: `List ${customCaptions["partPlural"]}/${customCaptions["toolPlural"]} by ${customCaptions["stage"]}/${customCaptions["zone"]}`,
			hideTools: `Hide ${customCaptions["toolPlural"]} in ${customCaptions["service"]}`,
			hideParts: `Hide ${customCaptions["partPlural"]} in ${customCaptions["service"]} `,
		}),
		[customCaptions]
	);

	const onTickInputClick = async (data) => {
		if (isReadOnly) {
			return;
		}

		const prevData = [...inputDetails];
		setIsDisabled({ [data.id]: true });
		const response = await updateModel(id, [
			{
				op: "replace",
				path: data.name,
				value: data.checked ? false : true,
			},
		]);
		setInputDetails([
			...inputDetails.map((input) =>
				input.name === data.name
					? {
							...input,
							checked: data.checked ? false : true,
					  }
					: input
			),
		]);

		if (!response.status) {
			setInputDetails(prevData);
			dispatch(showError(response.data || "Could Not Update Model Status"));
		}

		setIsDisabled({ [data.id]: false });
	};

	useEffect(() => {
		if (inputDetails.length === 0 && data) {
			const tickInputLists = settingsInputList.map((input) => ({
				...input,
				checked: data[input.name] ?? false,
				label: labels[input.name] ?? input.label,
			}));
			setInputDetails(tickInputLists);
		}
	}, [data, labels, inputDetails.length]);
	return (
		<AccordionBox title="Settings">
			<div>
				{inputDetails.map((detail) => (
					<CheckboxInput
						key={detail.id}
						state={detail}
						handleCheck={onTickInputClick}
						isDisabled={isDisabled[detail.id]}
					/>
				))}
			</div>
		</AccordionBox>
	);
}

export default Settings;
