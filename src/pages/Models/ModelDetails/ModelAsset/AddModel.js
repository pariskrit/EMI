import React, { useCallback, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	LinearProgress,
	FormGroup,
	FormControlLabel,
	Typography,
} from "@material-ui/core";
import instance from "helpers/api";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	getSearchedSiteAssets,
	patchmodelAssest,
	postModelAsset,
} from "services/models/modelDetails/modelAsset";
import EMICheckbox from "components/Elements/EMICheckbox";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import {
	handleSort,
	handleValidateObj,
	generateErrorState,
} from "helpers/utils";
import * as yup from "yup";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { addSiteAsset } from "services/clients/sites/siteAssets";

const ADD = AddDialogStyle();

// Yup validation schema
const schema = (serviceAcces, assetID) =>
	yup.object({
		asset: yup
			.string("Asset is required")
			.nullable()
			.when("assetname", {
				is: () => serviceAcces !== "F",
				then: yup.string("Asset is required").required("Asset is required"),
			}),
		name: yup
			.string("This field is required")
			.nullable()
			.when("asset", {
				is: () =>
					(serviceAcces === "F" && assetID === null) ||
					(serviceAcces === "F" && assetID === undefined),
				then: yup.string("Name is required").required("Name is required"),
			}),
		description: yup
			.string()
			.max(255, "Must be less than or equal to 255 characters ")
			.nullable(),
		status: yup.bool().required(),
	});

const debounce = (func, delay) => {
	let timer;
	return function () {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

const AddModel = ({
	open,
	handleClose,
	modelId,
	getError,
	title,
	handleAddComplete,
	editData,
	fetchModelAsset,
	isEdit = false,
	serviceAccess,
}) => {
	const [loading, setLoading] = useState(false);
	const [assets, setAsset] = useState([]);
	const [input, setInput] = useState({
		asset: {},
		status: true,
		name: "",
		description: "",
	});
	const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
	const [count, setCount] = useState(0);
	const { position, siteID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const [errors, setErrors] = useState({
		asset: null,
		status: null,
		name: null,
		description: null,
	});

	useEffect(() => {
		if (isEdit && editData) {
			setInput({
				asset: { id: editData?.siteAssetID },
				status: editData?.isActive,
				name: "",
				description: "",
			});
		}
	}, [editData, isEdit]);

	const fetchAssets = async (pNo = 1, prevData = []) => {
		let pageSearchField =
			pNo !== null ? `&&pageNumber=${pNo}&&pageSize=${page.pageSize}` : "";

		try {
			let result = await instance.get(
				`/api/siteassets?siteAppId=${position?.siteAppID}${pageSearchField}`
			);
			if (result.status) {
				setAsset([...prevData, ...result.data]);
			}
		} catch (e) {
			return;
		}
	};

	const fetchAssetCount = async () => {
		try {
			let result = await instance.get(`/api/SiteAssets/Count?siteId=${siteID}`);
			if (result.status) {
				setCount(result.data);
			}
		} catch (e) {
			return;
		}
	};

	const fetchAssetData = async () => {
		await Promise.all([fetchAssets(), fetchAssetCount()]);
	};

	const addModelAsset = async () => {
		setLoading(true);

		const { status, asset, name, description } = input;

		const data = {
			ModelID: +modelId,
			SiteAssetID: asset.id,
			isActive: status,
		};

		try {
			const localChecker = await handleValidateObj(
				schema(serviceAccess, asset.id, name),
				{
					asset: asset?.id,
					status,
					name,
					description,
				}
			);
			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				if (!isEdit) {
					let siteAsset;
					// add site only if service access is full and assest from dropdown is not selected
					if (serviceAccess === "F") {
						if (
							asset.id === "" ||
							asset.id === undefined ||
							asset.id === null
						) {
							siteAsset = await addSiteAsset({ siteID, name, description });
							if (!siteAsset.status) {
								getError(siteAsset.data.detail || "Failed To add asset");
								setLoading(false);

								return;
							}
						}
					}
					let result = await postModelAsset(
						serviceAccess === "F" && asset.id === undefined && name !== ""
							? { ...data, SiteAssetID: siteAsset.data }
							: data
					);
					if (result.status) {
						await fetchModelAsset(false);
						closeOverride();
					} else {
						if (result.data?.detail) getError(result.data.detail);
						else {
							if (result.data?.detail) getError(result.data.detail);
						}
					}
				} else {
					let result = await patchmodelAssest(editData?.id, [
						{
							op: "replace",
							path: "isActive",
							value: status,
						},
					]);
					if (result.status) {
						await fetchModelAsset(false);
						closeOverride();
					} else {
						getError(result.data.detail);
					}
				}
			} else {
				// show validation errors
				const newError = generateErrorState(localChecker);
				setErrors({ ...errors, ...newError });
			}
		} catch (e) {
			console.log(e);
			return;
		}
		setLoading(false);
	};

	const closeOverride = () => {
		handleClose();
		setAsset([]);
		setErrors({
			asset: null,
			status: null,
			name: null,
			description: null,
		});
		setPage({ pageNo: 1, pageSize: 10 });
		!isEdit && setInput({ asset: {}, status: true, description: "", name: "" });
	};

	const pageChange = async (p, prevData) => {
		await fetchAssets(p, prevData);
		setPage({ pageNo: p, pageSize: page.pageSize });
	};

	const handleServerSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getSearchedSiteAssets(
					position.siteAppID,
					1,
					20,
					searchTxt
				);
				setAsset(response.data);
			} else {
				pageChange(1, []);
			}
		}, 500),
		[]
	);

	return (
		<Dialog
			open={open}
			onClose={closeOverride}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			className="application-dailog"
		>
			{loading ? <LinearProgress /> : null}
			<ADD.ActionContainer>
				<DialogTitle>
					<ADD.HeaderText>
						{isEdit ? "Edit" : "Add"} {title}
					</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<div className="modalButton">
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
					</div>
					<div className="modalButton">
						<ADD.ConfirmButton onClick={addModelAsset} variant="contained">
							{isEdit ? "Close" : `Add ${title}`}
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<Divider />
			<DialogContent>
				<div
					style={{
						display: "flex",
						justifyContent: isEdit ? "left" : "space-between",
						alignItems: "center",
					}}
				>
					{!isEdit && (
						<ErrorInputFieldWrapper
							errorMessage={errors?.asset === null ? null : errors?.asset}
						>
							<DyanamicDropdown
								label={title}
								dataSource={assets}
								dataHeader={[
									{ id: 1, name: "Name" },
									{ id: 2, name: "Description" },
								]}
								showHeader
								onChange={(val) =>
									setInput((th) => ({
										...th,
										asset: val,
										name: "",
										description: "",
									}))
								}
								selectedValue={input.asset}
								onPageChange={pageChange}
								page={page.pageNo}
								columns={[
									{ name: "name", id: 1 },
									{ name: "description", id: 2 },
								]}
								selectdValueToshow="name"
								count={count}
								handleSort={handleSort}
								required={true}
								isError={errors?.asset ? true : false}
								handleServierSideSearch={handleServerSideSearch}
								isServerSide
								fetchData={fetchAssetData}
							/>
						</ErrorInputFieldWrapper>
					)}

					<FormGroup style={{ marginLeft: "10px" }}>
						<FormControlLabel
							control={
								<EMICheckbox
									state={input?.status}
									changeHandler={() => {
										setInput((th) => ({
											...th,
											status: !th.status,
											name: "",
											description: "",
										}));
									}}
								/>
							}
							label={<Typography>Active</Typography>}
						/>
					</FormGroup>
				</div>
				{serviceAccess === "F" && (
					<>
						<Divider />

						<p style={{ textAlign: "center" }}>Or</p>
						<div>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors?.name === null ? null : errors?.name}
							>
								<ADD.NameInput
									error={errors.name === null ? false : true}
									variant="outlined"
									size="medium"
									value={input.name}
									onKeyDown={() => {}}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value, asset: {} });
									}}
								/>
							</ErrorInputFieldWrapper>
						</div>

						<div style={{ marginTop: "20px" }}>
							<ADD.NameLabel>Description</ADD.NameLabel>
							<ADD.NameInput
								error={errors.description === null ? false : true}
								helperText={
									errors.description === null ? null : errors.description
								}
								variant="outlined"
								size="medium"
								multiline
								value={input.description}
								onKeyDown={() => {}}
								onChange={(e) => {
									setInput({
										...input,
										description: e.target.value,
										asset: {},
									});
								}}
							/>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
export default AddModel;
