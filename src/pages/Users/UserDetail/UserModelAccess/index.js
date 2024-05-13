import { Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DetailsPanel from "components/Elements/DetailsPanel";
import React, { useEffect, useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import FilterListIcon from "@mui/icons-material/FilterList";
import Departments from "./Departments";
import Models from "./Models";
import Roles from "./Roles";
import { coalesc } from "helpers/utils";
import { CircularProgress } from "@mui/material";
import {
	checkUserDepartments,
	checkUserModels,
	checkUserRoles,
	deleteAtTickAll,
	getClientSites,
	getClientUserSiteAppAccess,
	getClientUserSiteApps,
	uncheckUserDepartments,
	uncheckUserModels,
	uncheckUserRoles,
} from "services/users/userModelAccess";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

const useStyles = makeStyles()((theme) => ({
	dropdown: {
		display: "flex",
		alignItems: "center",
		gap: "30px",
		justifyContent: "space-between",
	},
	applicationSiteContainer: {
		display: "flex",
		gap: "30px",
		marginBottom: "30px",
		marginTop: "20px",
	},
	grid: {
		marginTop: "20px",
	},
}));

function UserModelAccess({ data }) {
	const { classes, cx } = useStyles();
	const [isLoading, setLoading] = useState(true);
	const [tickAllLoading, setTickAllLoading] = useState(false);
	const [departmentChangeLoading, setDepartmentChangeLoading] = useState(false);
	const [roleChangeLoading, setRoleChangeLoading] = useState(false);
	const [allowAllModels, setAllowAllModels] = useState(false);
	const [sites, setSites] = useState([]);
	const [selectedSite, setSelectedSite] = useState({});
	const [applications, setApplications] = useState([]);
	const [selectedApplication, setSelectedApplication] = useState({});
	const [departments, setDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [models, setModels] = useState([]);
	const [showTiles, setShowTiles] = useState(false);
	const [clientUserSiteAppId, setClientUserSiteAppId] = useState(null);
	const dispatch = useDispatch();

	const { id } = useParams();

	const { siteAppID, customCaptions, site, application } = JSON.parse(
		sessionStorage.getItem("me") || localStorage.getItem("me")
	);

	const onDropdownChange = async (type, item) => {
		if (type === "site") {
			if (item.id === selectedSite.id) return;
			if (Object.keys(selectedApplication).length !== 0) {
				setSelectedApplication({});
				setShowTiles(false);
			}

			setSelectedSite(item);
			fetchSiteApplication(item.id);
		}
		if (type === "application") {
			if (item.id === selectedApplication.id) return;
			setSelectedApplication(item);
			setClientUserSiteAppId(item.id);
			fetchModelDepartmentRole(item.clientUserSiteAppID);
		}
	};
	const handleDepartmentChange = async (checkedItem) => {
		const updatedDepartment = [
			...departments.map((department) =>
				department.id === checkedItem.id
					? { ...department, checked: !department.checked, isDisabled: true }
					: { ...department, isDisabled: true }
			),
		];
		setDepartments(updatedDepartment);
		setDepartmentChangeLoading(true);
		const response = checkedItem.checked
			? await uncheckUserDepartments(checkedItem.idToDelete)
			: await checkUserDepartments({
					clientUserSiteAppID: selectedApplication.clientUserSiteAppID || id,
					siteDepartmentID: checkedItem.id,
			  });
		if (response.status) {
			setDepartments([
				...departments.map((department) =>
					department.id === checkedItem.id
						? {
								...department,
								checked: !department.checked,
								idToDelete: response.data,
						  }
						: { ...department, isDisabled: false }
				),
			]);
			await fetchModelDepartmentRole(siteAppID ? id : clientUserSiteAppId);
			setDepartmentChangeLoading(false);
		} else {
			setDepartments([
				...departments.map((department) => ({
					...department,
					isDisabled: false,
				})),
			]);
			setDepartmentChangeLoading(false);
			displayError(response);
		}
	};

	const handleRoleChange = async (checkedItem) => {
		const updatedRoles = [
			...roles.map((role) =>
				role.id === checkedItem.id
					? { ...role, checked: !role.checked, isDisabled: true }
					: { ...role, isDisabled: true }
			),
		];

		setRoles(updatedRoles);
		setRoleChangeLoading(true);

		const response = checkedItem.checked
			? await uncheckUserRoles(checkedItem?.idToDelete)
			: await checkUserRoles({
					clientUserSiteAppID: selectedApplication.clientUserSiteAppID || id,
					roleID: checkedItem.id,
			  });

		if (response.status) {
			setRoles([
				...updatedRoles.map((role) =>
					role.id === checkedItem.id
						? {
								...role,
								idToDelete: response.data,
								isDisabled: false,
						  }
						: { ...role, isDisabled: false }
				),
			]);
			await fetchModelDepartmentRole(siteAppID ? id : clientUserSiteAppId);
			setRoleChangeLoading(false);
		} else {
			setRoles([...roles.map((role) => ({ ...role, isDisabled: false }))]);
			setRoleChangeLoading(false);
			displayError(response);
		}
	};

	const tickAllModel = async () => {
		setTickAllLoading(true);
		const response = await deleteAtTickAll(
			siteAppID ? id : clientUserSiteAppId
		);
		if (response.status) {
			await fetchModelDepartmentRole(siteAppID ? id : clientUserSiteAppId);
			setTickAllLoading(false);
		}
	};

	const handleModelChange = async (checkedItem) => {
		const updatedModel = [
			...models.map((model) =>
				model.id === checkedItem.id
					? {
							...model,
							checked: !model.checked,

							isDisabled: true,
					  }
					: { ...model, isDisabled: true }
			),
		];
		setModels(updatedModel);

		const response = checkedItem.checked
			? await checkUserModels({
					clientUserSiteAppID: selectedApplication.clientUserSiteAppID || id,
					modelID: checkedItem.id,
			  })
			: await uncheckUserModels(checkedItem?.idToDelete);

		if (response.status) {
			setModels([
				...updatedModel.map((model) =>
					model.id === checkedItem.id
						? {
								...model,
								idToDelete: response.data,
								isDisabled: false,
						  }
						: { ...model, isDisabled: false }
				),
			]);
		} else {
			setModels([
				...models.map((model) =>
					model.id === checkedItem.id
						? {
								...model,

								isDisabled: false,
						  }
						: { ...model, isDisabled: false }
				),
			]);

			displayError(response);
		}
	};

	const displayError = (response) =>
		dispatch(
			showError(response?.data?.detail || response?.data || "Could not update")
		);

	const fetchSiteApplication = async (id) => {
		const response = await getClientUserSiteApps(id);
		if (response.status) {
			const modifiedApplication = [
				...response.data.map((application) => ({
					...application,
					id: application.clientUserSiteAppID,
				})),
			];
			setApplications(modifiedApplication);
			if (response.data.length === 1) {
				setSelectedApplication(modifiedApplication[0]);
				fetchModelDepartmentRole(response.data[0].clientUserSiteAppID);
				setClientUserSiteAppId(modifiedApplication[0].clientUserSiteAppID);
			}
		} else displayError(response);
	};
	const fetchModelDepartmentRole = async (clientId) => {
		const response = await getClientUserSiteAppAccess(clientId);
		if (response.status) {
			setDepartments(
				response.data.siteDepartments?.map((department) => ({
					...department,
					idToDelete:
						department.clientUserSiteAppServiceDepartments?.length > 0
							? department.clientUserSiteAppServiceDepartments[0].id
							: null,
					checked: department.clientUserSiteAppServiceDepartments?.length > 0,
				}))
			);
			setRoles(
				response.data.roles?.map((role) => ({
					...role,
					checked: role.clientUserSiteAppServiceRoles?.length > 0,
					idToDelete:
						role.clientUserSiteAppServiceRoles?.length > 0
							? role.clientUserSiteAppServiceRoles[0]?.id
							: null,
				}))
			);
			setModels(
				response.data.models.map((model) => ({
					...model,
					name: `${model.name} ${coalesc(model.modelName)}`,
					checked: model.clientUserSiteAppServiceModels?.length <= 0,
					idToDelete:
						model.clientUserSiteAppServiceModels?.length > 0
							? model.clientUserSiteAppServiceModels[0]?.id
							: null,
				}))
			);
			setAllowAllModels(response.data.allowAllModels);
			setShowTiles(true);
		} else displayError(response);
	};

	const fetchAllData = async () => {
		if (!siteAppID) {
			const response = await getClientSites(id);

			if (response.status) {
				const modifiedSite = response?.data?.map((res) => ({
					...res,
					name: res?.siteName,
				}));
				setSites(modifiedSite);
				if (response.data.length === 1) {
					setSelectedSite(modifiedSite[0]);
					fetchSiteApplication(modifiedSite[0].id);
				}
			} else displayError(response);
		} else {
			fetchModelDepartmentRole(id);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchAllData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (isLoading) return <CircularProgress />;
	return (
		<div>
			<DetailsPanel
				header={`${customCaptions?.servicePlural ?? "Services"} Access`}
				dataCount={null}
				description={`Manage the ${
					customCaptions?.service ?? "Service"
				} Access for the user on a per application/site basis`}
			/>
			<div className={classes.applicationSiteContainer}>
				<label>
					<b>Site:</b> <span>{selectedSite?.name ?? site?.siteName}</span>
				</label>
				<label>
					<b>Application:</b>{" "}
					<span>{selectedApplication?.name ?? application?.name}</span>
				</label>
			</div>

			{!siteAppID ? (
				<Grid container spacing={4}>
					<Grid item xs={12} md={6}>
						<DyanamicDropdown
							dataSource={sites}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							showHeader={false}
							placeholder={`Select Site`}
							width="100%"
							onChange={(list) => onDropdownChange("site", list)}
							selectdValueToshow="name"
							selectedValue={selectedSite}
							label={`Filter by Site`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<DyanamicDropdown
							dataSource={applications}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							showHeader={false}
							width="100%"
							placeholder={`Select Application`}
							onChange={(list) => onDropdownChange("application", list)}
							selectdValueToshow="name"
							selectedValue={selectedApplication}
							label={`Filter by Application`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
			) : null}
			{showTiles ? (
				<Grid container spacing={4} className={classes.grid}>
					<Grid item xs={12} md={6}>
						<Departments
							data={departments}
							captions={[
								customCaptions?.departmentPlural,
								customCaptions?.servicePlural,
							]}
							handleCheck={handleDepartmentChange}
							name={`${data?.firstName} ${data?.lastName}`}
							departmentChangeLoading={departmentChangeLoading}
						/>
						<Roles
							data={roles}
							captions={[
								customCaptions?.rolePlural,
								customCaptions?.servicePlural,
							]}
							handleCheck={handleRoleChange}
							roleChangeLoading={roleChangeLoading}
							name={`${data?.firstName} ${data?.lastName}`}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<Models
							data={models}
							allowAllModels={allowAllModels}
							setAllowAllModels={setAllowAllModels}
							siteAppId={selectedApplication.clientUserSiteAppID || id}
							captions={[
								customCaptions?.modelPlural,
								customCaptions?.servicePlural,
								customCaptions?.departmentPlural,
								customCaptions?.rolePlural,
							]}
							handleCheck={handleModelChange}
							tickAllModel={tickAllModel}
							dispatch={dispatch}
							name={`${data?.firstName} ${data?.lastName}`}
							tickAllLoading={tickAllLoading}
						/>
					</Grid>
				</Grid>
			) : null}
		</div>
	);
}

export default UserModelAccess;
