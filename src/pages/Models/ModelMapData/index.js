import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ModelMapHeader from "./ModelMapHeader";
import API from "helpers/api";
import Dropdown from "components/Elements/Dropdown";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { handleSort } from "helpers/utils";
import ElementList from "./ElementList";
import { showError } from "redux/common/actions";
import { modelsPath } from "helpers/routePaths";

const modalInitial = { data: {}, loading: false };

const useStyles = makeStyles({
	main: {
		marginTop: 30,
	},
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

// Either newName or elementID (actionID,lubricantID, etc) not null return true
function filterResolved(x, elementId) {
	return x.newName !== null || x[elementId] !== null;
}

function setDropDownData(x, elementId = null) {
	return x.value === elementId;
}

function setDropDownList(lists) {
	return lists.map((x) => ({
		id: x.siteAppID,
		label: x.name,
		value: x.id,
	}));
}

const ModelMapData = ({ match, history, getError }) => {
	const classes = useStyles();
	const {
		params: { modelId },
	} = match;

	const [modelData, setModelData] = useState(modalInitial);

	const [dropDowns, setDropDown] = useState({
		locations: [],
		departments: [],
		statuses: [],
		types: [],
		loading: false,
	});

	const [errors, setErrors] = useState({
		actions: { total: 0, resolved: 0 },
		lubricants: { total: 0, resolved: 0 },
		operatingModes: { total: 0, resolved: 0 },
		systems: { total: 0, resolved: 0 },
		roles: { total: 0, resolved: 0 },
	});

	const [dropDownValue, setDropDownValue] = useState({
		location: {},
		department: {},
		status: {},
		type: {},
	});

	const [dropDownLoading, setDropDownLoading] = useState(false);

	const fetchData = () => {
		setModelData({ data: {}, loading: true });
		API.get("/api/ModelImports/" + modelId)
			.then((res) => {
				const { data } = res;
				setModelData({ data: data, loading: false });
				setErrors({
					actions: {
						total: data.modelImportActions.length,
						resolved: data.modelImportActions.filter((x) =>
							filterResolved(x, "actionID")
						).length,
					},
					lubricants: {
						total: data.modelImportLubricants.length,
						resolved: data.modelImportLubricants.filter((x) =>
							filterResolved(x, "lubricantID")
						).length,
					},
					operatingModes: {
						total: data.modelImportOperatingModes.length,
						resolved: data.modelImportOperatingModes.filter((x) =>
							filterResolved(x, "operatingModeID")
						).length,
					},
					roles: {
						total: data.modelImportRoles.length,
						resolved: data.modelImportRoles.filter((x) =>
							filterResolved(x, "roleID")
						).length,
					},
					systems: {
						total: data.modelImportSystems.length,
						resolved: data.modelImportSystems.filter((x) =>
							filterResolved(x, "systemID")
						).length,
					},
				});
				setDropDown((th) => ({ ...th, loading: true }));

				const siteAppID = data.siteAppID;
				Promise.all(
					[
						"/api/SiteLocations?siteAppId=" + siteAppID,
						"/api/SiteDepartments?siteAppId=" + siteAppID,
						"/api/ModelStatuses?siteAppId=" + siteAppID,
						"/api/ModelTypes?siteAppId=" + siteAppID,
					].map((end) => API.get(end))
				)
					.then(
						axios.spread(
							(
								{ data: locations },
								{ data: departments },
								{ data: statuses },
								{ data: types }
							) => {
								const loc = setDropDownList(locations);
								const dep = setDropDownList(departments);
								const typ = setDropDownList(types);
								const stat = statuses.map((x) => ({
									...x,
									publish: x.publish ? "Yes" : "No",
								}));
								setDropDown({
									loading: false,
									locations: loc,
									departments: dep,
									statuses: stat,
									types: typ,
								});

								setDropDownValue({
									location:
										loc.find((x) => setDropDownData(x, data.siteLocationID)) ||
										{},
									department:
										dep.find((x) =>
											setDropDownData(x, data.siteDepartmentID)
										) || {},
									status:
										stat.find((x) => setDropDownData(x, data.siteStatusID)) ||
										{},
									type:
										typ.find((x) => setDropDownData(x, data.modelTypeID)) || {},
								});
							}
						)
					)
					.catch((err) => console.log(err.response));
			})
			.catch((err) => {
				if (err.response.data.title !== undefined)
					getError(err.response.data.title);

				history.push(modelsPath);
			});
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (name, val, typeId) => {
		setDropDownLoading(true);
		if (typeId) {
			API.patch("/api/ModelImports/" + modelId, [
				{ op: "replace", path: typeId, value: val.value },
			])
				.then((res) => {
					setModelData((th) => ({
						...th,
						...res.data,
					}));
					setDropDownLoading(false);
				})
				.catch((err) => {
					console.log(err.response);
					setDropDownLoading(false);
				});
		}
		setDropDownValue((th) => ({ ...th, [name]: val }));
	};

	// After Pressing Complete Button
	const handleImport = () => {
		return new Promise((resolve, reject) => {
			API.post("/api/modelimports/" + modelId + "/import", {
				key: modelData.data.documentKey,
				import: false,
			})
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					// If error response, the data need to be remapped
					reject(err);
				});
		});
	};

	if (modelData.loading) {
		return <CircularProgress />;
	}

	return (
		<div>
			{dropDownLoading ? <LinearProgress className={classes.loading} /> : null}
			<ModelMapHeader
				name={`${modelData.data.name} (${modelData.data.model})`}
				onCompleteImport={handleImport}
				errors={errors}
				getError={getError}
				history={history}
				modelId={modelId}
				fetchData={fetchData}
			/>
			<div className={classes.main}>
				{dropDowns.loading ? (
					<CircularProgress />
				) : (
					<div style={{ display: "flex", gap: 6, flex: "25%" }}>
						<Dropdown
							width="291px"
							placeholder="Location"
							options={dropDowns.locations}
							onChange={(val) =>
								handleChange("location", val, "siteLocationID")
							}
							selectedValue={dropDownValue.location}
						/>
						<Dropdown
							width="291px"
							placeholder="Department"
							options={dropDowns.departments}
							onChange={(val) =>
								handleChange("department", val, "siteDepartmentID")
							}
							selectedValue={dropDownValue.department}
						/>

						<DyanamicDropdown
							isServerSide={false}
							placeholder="Status"
							dataHeader={[
								{ id: 1, name: "Name" },
								{ id: 2, name: "Publish" },
							]}
							columns={[
								{ id: 1, name: "name" },
								{ id: 2, name: "publish" },
							]}
							dataSource={dropDowns.statuses}
							showHeader
							selectedValue={dropDownValue.status}
							handleSort={handleSort}
							onChange={(val) => handleChange("status", val)}
							selectdValueToshow="name"
						/>
						<Dropdown
							width="291px"
							placeholder="Type"
							options={dropDowns.types}
							onChange={(val) => handleChange("type", val, "modelTypeID")}
							selectedValue={dropDownValue.type}
						/>
					</div>
				)}

				<ElementList
					errors={errors}
					modelData={modelData}
					setModelData={setModelData}
					setErrors={setErrors}
				/>
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(ModelMapData);
