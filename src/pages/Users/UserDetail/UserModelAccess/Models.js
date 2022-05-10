import AccordionBox from "components/Layouts/AccordionBox";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import React, { useState } from "react";
import { updateClientUserSiteAppAccess } from "services/users/userModelAccess";

function Models({ data, captions, allowAllModels, siteAppId, handleCheck }) {
	const [showList, setShowList] = useState(allowAllModels);
	const [disabled, setDisabled] = useState(false);

	const handleAllowAllModelsCheck = async () => {
		setShowList((prev) => !prev);
		setDisabled(true);

		const response = await updateClientUserSiteAppAccess(siteAppId, [
			{ path: "AllowAllModels", op: "replace", value: !showList },
		]);
		if (response.status) setDisabled(false);
	};
	return (
		<AccordionBox title={captions[0] ?? "Models"}>
			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				<em>
					Bill Thompson can perform {captions[1] ?? "Services"} for the
					following {captions[0] ?? "Models"}
				</em>
				<CheckboxContainer
					checkBoxes={[
						{
							id: 1,
							name: `Allow all ${captions[0] ?? "Models"} for the ${
								captions[2] ?? "Departments"
							} and ${captions[3] ?? "Roles"} selected`,
							checked: showList,
							isDisabled: disabled,
						},
					]}
					onCheck={handleAllowAllModelsCheck}
				/>

				{!showList && (
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
