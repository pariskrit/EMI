import React from "react";
import Elements from "./Elements";

const ElementList = ({ errors, modelData, setModelData, setErrors }) => {
	const onErrorChange = (updatedData, modelName, errorName, elementID) => {
		const resolved = updatedData.filter(
			(x) => x.newName !== null || x[elementID] !== null
		).length;
		setModelData({
			...modelData,
			data: { ...modelData.data, [modelName]: updatedData },
		});
		setErrors({ ...errors, [errorName]: { ...errors[errorName], resolved } });
	};
	return (
		<>
			<Elements
				name="Action"
				title="Action Required"
				errors={errors.actions}
				getApi="/api/actions"
				patchApi="/api/ModelImportActions"
				siteAppID={modelData.data.siteAppID}
				mainData={modelData.data.modelImportActions}
				errorName="actions"
				modelName="modelImportActions"
				elementID="actionID"
				onErrorResolve={onErrorChange}
			/>
			<Elements
				name="Lubricant"
				title="Lubricants"
				errors={errors.lubricants}
				getApi="/api/Lubricants"
				patchApi="/api/ModelImportLubricants"
				siteAppID={modelData.data.siteAppID}
				mainData={modelData.data.modelImportLubricants}
				errorName="lubricants"
				modelName="modelImportLubricants"
				elementID="lubricantID"
				onErrorResolve={onErrorChange}
			/>
			<Elements
				name="Operating Mode"
				title="Operating Modes"
				errors={errors.operatingModes}
				getApi="/api/OperatingModes"
				patchApi="/api/ModelImportOperatingModes"
				siteAppID={modelData.data.siteAppID}
				mainData={modelData.data.modelImportOperatingModes}
				errorName="operatingModes"
				modelName="modelImportOperatingModes"
				elementID="operatingModeID"
				onErrorResolve={onErrorChange}
			/>
			<Elements
				name="System"
				title="Systems"
				errors={errors.systems}
				getApi="/api/Systems"
				patchApi="/api/ModelImportSystems"
				siteAppID={modelData.data.siteAppID}
				mainData={modelData.data.modelImportSystems}
				errorName="systems"
				modelName="modelImportSystems"
				elementID="systemID"
				onErrorResolve={onErrorChange}
			/>
			<Elements
				name="Role"
				title="Roles"
				errors={errors.roles}
				getApi="/api/Roles"
				patchApi="/api/ModelImportRoles"
				siteAppID={modelData.data.siteAppID}
				mainData={modelData.data.modelImportRoles}
				errorName="roles"
				modelName="modelImportRoles"
				elementID="roleID"
				onErrorResolve={onErrorChange}
			/>
		</>
	);
};

export default ElementList;
