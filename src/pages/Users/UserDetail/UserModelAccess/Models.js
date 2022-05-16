import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React, { useState } from "react";
import { showError } from "redux/common/actions";
import { updateClientUserSiteAppAccess } from "services/users/userModelAccess";

function Models({
	data,
	captions,
	allowAllModels,
	siteAppId,
	handleCheck,
	dispatch,
	setAllowAllModels,
	name,
}) {
	const [disabled, setDisabled] = useState(false);

	const handleAllowAllModelsCheck = async () => {
		setDisabled(true);

		const response = await updateClientUserSiteAppAccess(siteAppId, [
			{ path: "AllowAllModels", op: "replace", value: !allowAllModels },
		]);
		if (response.status) {
			setAllowAllModels((prev) => !prev);
		} else {
			dispatch(
				showError(
					response.data ||
						response.data?.detail ||
						"Could not add allow all models"
				)
			);
		}
		setDisabled(false);
	};

	return (
		<AccordionBox title={captions[0] ?? "Models"}>
			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				<em>
					{name} can perform {captions[1] ?? "Services"} for the following{" "}
					{captions[0] ?? "Models"}
				</em>
				<CheckboxContainer
					checkBoxes={[
						{
							id: 1,
							name: `Allow all ${captions[0] ?? "Models"} for the ${
								captions[2] ?? "Departments"
							} and ${captions[3] ?? "Roles"} selected`,
							checked: allowAllModels,
							isDisabled: disabled,
						},
					]}
					onCheck={handleAllowAllModelsCheck}
				/>

				{!allowAllModels && (
					<>
						<b>Or</b>
						<CheckboxContainer checkBoxes={data} onCheck={handleCheck} />
					</>
				)}
			</div>
		</AccordionBox>
	);
}

export default Models;
