import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ModelMapHeader from "./ModelMapHeader";
import API from "helpers/api";
import Dropdown from "components/Elements/Dropdown";
import {
	CircularProgress,
	LinearProgress,
	Grid,
	TextField,
	Typography,
} from "@material-ui/core";
import ElementList from "./ElementList";
import { showError } from "redux/common/actions";
import { modelsPath } from "helpers/routePaths";
import withMount from "components/HOC/withMount";
import { getModelMapData } from "services/models/modelMap";
import ColourConstants from "helpers/colourConstants";
import useSuperAdminExclude from "hooks/useSuperAdminExclude";

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
	labeling: {
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		fontWeight: "bold",
		color: ColourConstants.commonText,
		paddingBottom: 5,
		width: "100%",
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

const ModelMapData = ({ match, history, getError, isMounted, access }) => {
	const classes = useStyles();
	const {
		params: { modelId },
	} = match;
	useSuperAdminExclude();
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
		type: {},
	});

	const [textValue, setTextValue] = useState({
		name: "",
		model: "",
		serialNumberRange: "",
	});

	const [dropDownLoading, setDropDownLoading] = useState(false);

	const fetchData = async () => {
		setModelData({ data: {}, loading: true });
		try {
			const res = await getModelMapData(modelId);
			if (res.status) {
				const { data } = res;

				if (!isMounted.aborted) {
					setModelData({ data: data, loading: false });
					setTextValue({
						name: data.name,
						model: data.model,
						serialNumberRange: data.serialNumberRange,
					});
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
							"/api/ModelTypes?siteAppId=" + siteAppID,
						].map((end) => API.get(end))
					)
						.then(
							axios.spread(
								(
									{ data: locations },
									{ data: departments },
									{ data: types }
								) => {
									const loc = setDropDownList(locations);
									const dep = setDropDownList(departments);
									const typ = setDropDownList(types);

									if (!isMounted.aborted) {
										setDropDown({
											loading: false,
											locations: loc,
											departments: dep,
											types: typ,
										});

										setDropDownValue({
											location:
												loc.find((x) =>
													setDropDownData(x, data.siteLocationID)
												) || {},
											department:
												dep.find((x) =>
													setDropDownData(x, data.siteDepartmentID)
												) || {},

											type:
												typ.find((x) => setDropDownData(x, data.modelTypeID)) ||
												{},
										});
									}
								}
							)
						)
						.catch((err) => console.log(err.response));
				} else {
					// isMounted
					return;
				}
			} else {
				// response status
				if (res?.data?.title !== undefined) getError(res.data.title);

				history.push(modelsPath);
			}
		} catch (err) {
			return;
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const patchData = (path, value) => {
		setDropDownLoading(true);

		API.patch("/api/ModelImports/" + modelId, [{ op: "replace", path, value }])
			.then((res) => {
				if (!isMounted.aborted) {
					setModelData((th) => ({
						loading: false,
						data: { ...th.data, ...res.data },
					}));
					setDropDownLoading(false);
				}
			})
			.catch((err) => {
				setDropDownLoading(false);
			});
	};

	const handleChange = (name, val, typeId) => {
		if (dropDownValue[name].value !== val.value) {
			patchData(typeId, val.value);
			setDropDownValue((th) => ({ ...th, [name]: val }));
		}
	};

	const handleTextChange = (e) => {
		const { name, value } = e.target;
		setTextValue((th) => ({ ...th, [name]: value }));
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		if (modelData.data[name] !== value) {
			patchData(name, value);
		}
		return;
	};

	if (modelData.loading) {
		return <CircularProgress />;
	}

	const disableInput = access === "F" || access === "E";

	return (
		<div>
			{dropDownLoading ? <LinearProgress className={classes.loading} /> : null}
			<ModelMapHeader
				name={`${modelData.data.name} (${modelData.data.model})`}
				errors={errors}
				getError={getError}
				history={history}
				modelId={modelId}
				fetchData={fetchData}
				access={access}
			/>

			<div className={classes.main}>
				{dropDowns.loading ? (
					<CircularProgress />
				) : (
					<>
						<Grid container spacing={2}>
							<Grid item md={4} sm={6} xs={12}>
								<Typography className={classes.labeling}>Name</Typography>
								<TextField
									name="name"
									onChange={handleTextChange}
									onBlur={handleBlur}
									fullWidth
									variant="outlined"
									value={textValue.name}
									disabled={!disableInput}
								/>
							</Grid>
							<Grid item md={4} sm={6} xs={12}>
								<Typography className={classes.labeling}>Model</Typography>
								<TextField
									name="model"
									onChange={handleTextChange}
									onBlur={handleBlur}
									fullWidth
									variant="outlined"
									value={textValue.model}
									disabled={!disableInput}
								/>
							</Grid>
							<Grid item md={4} sm={6} xs={12}>
								<Typography className={classes.labeling}>
									Serial Number Range
								</Typography>
								<TextField
									name="serialNumberRange"
									onChange={handleTextChange}
									onBlur={handleBlur}
									fullWidth
									variant="outlined"
									value={textValue.serialNumberRange}
									disabled={!disableInput}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item md={4} sm={6} xs={12}>
								<Typography className={classes.labeling}>Location</Typography>
								<Dropdown
									width="100%"
									placeholder="Please Select"
									options={dropDowns.locations}
									onChange={(val) =>
										handleChange("location", val, "siteLocationID")
									}
									selectedValue={dropDownValue.location}
									disabled={!disableInput}
								/>
							</Grid>
							<Grid item md={4} sm={6} xs={12}>
								<Typography className={classes.labeling}>Department</Typography>
								<Dropdown
									width="100%"
									placeholder="Please Select"
									options={dropDowns.departments}
									onChange={(val) =>
										handleChange("department", val, "siteDepartmentID")
									}
									selectedValue={dropDownValue.department}
									disabled={!disableInput}
								/>
							</Grid>

							<Grid item md={4} xs={12}>
								<Typography className={classes.labeling}>Type</Typography>
								<Dropdown
									width="100%"
									placeholder="Please Select"
									options={dropDowns.types}
									onChange={(val) => handleChange("type", val, "modelTypeID")}
									selectedValue={dropDownValue.type}
									disabled={!disableInput}
								/>
							</Grid>
						</Grid>
					</>
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

export default connect(null, mapDispatchToProps)(withMount(ModelMapData));
