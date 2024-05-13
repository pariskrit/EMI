import React, { useEffect, useMemo } from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxInput from "components/Elements/CheckboxInput";
import { updateModel } from "services/models/modelDetails/details";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { useState } from "react";
import { settingsInputList } from "constants/modelDetails";
import { getLocalStorageData } from "helpers/utils";
import updateStorage from "helpers/updateStorage";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

function Settings({ data, customCaptions, isReadOnly, Ctxdispatch }) {
	const dispatch = useDispatch();

	const [inputDetails, setInputDetails] = useState([]);
	const [isDisabled, setIsDisabled] = useState({});
	const {
		application,

		siteAppID,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const [siteAppState, setSiteAppState] = useState({ application });
	const reduxDispatch = useDispatch();

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			setSiteAppState(result?.data);
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		}
	};
	const { id } = useParams();
	const labels = useMemo(
		() => ({
			allowTickAllPartsTools: `Allow 'Tick All' for 
			${
				siteAppState.application.showParts
					? `${customCaptions["partPlural"] ?? "Parts"}/`
					: ""
			}${customCaptions["toolPlural"]} in ${customCaptions["service"]}`,
			listPartsToolsByStageZone: `List
			 ${
					siteAppState.application.showParts
						? `${customCaptions["partPlural"] ?? "Parts"}/`
						: ""
				}${customCaptions["toolPlural"]} by ${customCaptions["stage"]}/${
				customCaptions["zone"]
			}`,
			hideTools: `Hide ${customCaptions["toolPlural"]} in ${customCaptions["service"]}`,
			hideParts: `Hide ${customCaptions["partPlural"] ?? "Parts"} in ${
				customCaptions["service"]
			} `,
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
		if (response.status) {
			Ctxdispatch({
				type: "CHANGE_TICK",
				payload: {
					name: data.name,
					value: data.checked,
				},
			});
			!response?.data?.arrangementsExist &&
				dispatch(
					showError(
						`Please review your ${customCaptions["asset"]} ${customCaptions["arrangementPlural"]}. Some  ${customCaptions["assetPlural"]} contain an invalid ${customCaptions["arrangement"]} configuration for this new published version.`
					)
				);
		}

		if (!response.status) {
			setInputDetails(prevData);
			dispatch(showError(response?.data || "Could Not Update Model Status"));
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
	useEffect(() => {
		fetchSiteApplicationDetails();
		if (siteAppID) updateStorage(siteAppID);
	}, []);
	return (
		<AccordionBox title="Settings">
			<div>
				{inputDetails
					.filter((item) => {
						if (!siteAppState.application.showParts) {
							return item.id !== 5;
						} else {
							return item;
						}
					})
					.map((detail) => (
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
