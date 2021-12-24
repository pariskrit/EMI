import React from "react";
import Elements from "./Elements";

const ElementList = ({ errors, modelData, setModelData, setErrors }) => {
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
				setErrors={setErrors}
				setModelData={setModelData}
				elementID="actionID"
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
				setErrors={setErrors}
				setModelData={setModelData}
				elementID="lubricantID"
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
				setErrors={setErrors}
				setModelData={setModelData}
				elementID="operatingModeID"
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
				setErrors={setErrors}
				setModelData={setModelData}
				elementID="systemID"
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
				setErrors={setErrors}
				setModelData={setModelData}
				elementID="roleID"
			/>
		</>
	);
};

export default ElementList;
