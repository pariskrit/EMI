import React, { useCallback, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	LinearProgress,
} from "@material-ui/core";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import AddDialogStyle from "styles/application/AddDialogStyle";
import {
	debounce,
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import ImageUpload from "components/Elements/ImageUpload";
import clsx from "clsx";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { uploadZoneImage } from "services/models/modelDetails/modelZones";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteAssetsForZones } from "services/models/modelDetails/modelTaskZones";
import { getSiteAssetsCount } from "services/clients/sites/siteAssets";

// Init styled components
const ADD = AddDialogStyle();

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// Yup validation schema
const schema = yup.object({
	Name: yup
		.string("This field must be a string")
		.max(50, "The field Name must be a string with a maximum length of 50")
		.required("Name is required"),
	image: yup
		.mixed()
		.test("fileType", "Unsupported File Format", (value) =>
			SUPPORTED_FORMATS.includes(value.type)
		),
	imageUrl: yup.string(),
	imageName: yup.string(),
	defaultSiteAssetID: yup.string().nullable(),
});

const useStyles = makeStyles({
	dialogContent: {
		width: "100%",
	},
	dividerStyle: {
		margin: "10px 0",
	},
	imageContainer: {
		width: "120px",
		height: "120px",
		objectFit: "contain",
	},
	imageContainerMain: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	deleteIcon: {
		cursor: "pointer",
		fontSize: "10px",
	},
	zonedialouge: {
		width: "100%",
		maxWidth: "100%",
	},
});

// Default state schemas
const defaultErrorSchema = {
	Name: null,
	image: null,
	defaultSiteAssetID: null,
};
const defaultStateSchema = {
	Name: "",
	imageUrl: "",
	image: null,
	imageName: "",
	defaultSiteAssetID: {},
};

function AddNewModelTask({
	open,
	closeHandler,
	siteAppId,
	siteID,
	data,
	title,
	createProcessHandler,
	ModelVersionID,
	zoneId,
	fetchModelZoneList,
	isEdit,
	customCaptions,
	modelType,
}) {
	// Init hooks
	const classes = useStyles();
	const dispatch = useDispatch();

	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [siteAssset, setSiteAssest] = useState([]);
	const [assestCount, setAssestCount] = useState(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (data) {
			setInput({
				...data,
				imageUrl: data.imageUrl || "",
				imageName: data.imageName || "",
			});
		}
	}, [data]);

	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);
		setSiteAssest([]);
		setAssestCount(null);
		setPage(1);

		closeHandler();
	};

	const handleCreateProcess = async () => {
		// Rendering spinner
		setIsUpdating(true);

		// Clearing errors before attempted create
		setErrors(defaultErrorSchema);

		// cleaned Input
		const cleanInput = {
			...input,
			defaultSiteAssetID: input.defaultSiteAssetID?.id || null,
		};

		try {
			const localChecker = await handleValidateObj(schema, cleanInput);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const newData = await createProcessHandler({
					Name: input.Name,
					ModelVersionID,
					imageKey: input?.imageName,
					defaultSiteAssetID: input?.defaultSiteAssetID?.id || null,
				});
				if (newData?.status) {
					if (input?.image) {
						const formData = new FormData();
						formData.append("file", input.image);
						await uploadZoneImage(zoneId || newData.data, formData);
					}
					await fetchModelZoneList();
					setIsUpdating(false);
					closeOverride();
				} else {
					dispatch(
						showError(newData?.data?.detail || "Failed to add new zone")
					);
					setIsUpdating(false);
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
				setIsUpdating(false);
			}
		} catch (err) {
			// TODO: handle non validation errors here
			setIsUpdating(false);
			setErrors({ ...errors, ...err?.response?.data?.errors });
			dispatch(
				showError(err?.response?.data?.detail || "Failed to add new zone")
			);
		}
	};

	// api call to handle serverside asset search
	const handleServierSideSearch = useCallback(
		debounce(async (searchTxt) => {
			if (searchTxt) {
				const response = await getSiteAssetsForZones(
					siteAppId,
					1,
					100,
					searchTxt
				);
				setSiteAssest(response.data);
			} else {
				onPageChange(1);
			}
		}, 500),
		[]
	);

	// fetch site assets
	const fetchSiteAssest = async (
		siteAppID,
		pageNo,
		perPage = 10,
		search = ""
	) => {
		try {
			const response = await getSiteAssetsForZones(
				siteAppID,
				pageNo,
				perPage,
				search
			);

			setSiteAssest((prev) =>
				[...prev, ...(response?.data || [])].reduce((acc, current) => {
					const x = acc.find((item) => item.id === current.id);
					if (!x) {
						return acc.concat([current]);
					} else {
						return acc;
					}
				}, [])
			);
		} catch (error) {
			dispatch(error?.response?.data || "Coulnd not fetch site asset");
		}
	};

	// api call to get total count of asset for pagiantion
	useEffect(() => {
		if (open && modelType === "F") {
			const fetchCountAssest = async () => {
				const response = await getSiteAssetsCount(siteID);
				if (response.status) {
					setAssestCount(response.data);
				}
			};
			fetchCountAssest();
		}
	}, [open, siteID, modelType]);

	// pagination for site asset
	const onPageChange = async (pageSize) => {
		setPage(pageSize);
		await fetchSiteAssest(siteAppId, pageSize, 10);
	};

	// api call when site asset dropDown clicked
	const fetchSiteFromDropDown = async () => {
		return await fetchSiteAssest(siteAppId, 1);
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleCreateProcess();
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={closeOverride}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={clsx("large-application-dailog")}
			>
				{isUpdating ? <LinearProgress /> : null}
				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{
							<ADD.HeaderText>
								{isEdit ? "Edit " + title : title}
							</ADD.HeaderText>
						}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeOverride} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								onClick={handleCreateProcess}
								variant="contained"
								className={classes.createButton}
								disabled={isUpdating}
							>
								{isEdit ? "Close " : title}
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>
				<Divider className={classes.dividerStyle} />

				<DialogContent className={classes.dialogContent}>
					<ADD.InputContainer>
						<ADD.LeftInputContainer>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.Name === null ? false : true}
								helperText={errors.Name === null ? null : errors.Name}
								value={input.Name}
								onChange={(e) => {
									setInput({ ...input, Name: e.target.value });
								}}
								variant="outlined"
								autoFocus
								onKeyDown={handleEnterPress}
							/>
						</ADD.LeftInputContainer>

						<ADD.RightInputContainer>
							<ADD.NameLabel>Image</ADD.NameLabel>
							<ErrorInputFieldWrapper
								errorMessage={errors.image === null ? null : errors.image}
							>
								<ImageUpload
									onDrop={(e) => {
										setInput({
											...input,
											image: e[0],
											imageUrl: URL.createObjectURL(e[0]),
											imageName: e[0].name,
										});
									}}
									imageUrl={input?.imageUrl}
									imageName={input?.image?.name || ""}
									removeImage={() => {
										setInput({
											...input,
											imageUrl: "",
											imageName: "",
											image: null,
										});
									}}
								/>
							</ErrorInputFieldWrapper>
						</ADD.RightInputContainer>
					</ADD.InputContainer>
					{modelType === "F" && (
						<ADD.InputContainer>
							<ADD.LeftInputContainer>
								<DyanamicDropdown
									label={`Default ${customCaptions?.asset}`}
									dataSource={siteAssset}
									columns={[
										{ name: "name", id: 1 },
										{ name: "description", id: 2 },
									]}
									dataHeader={[
										{ name: "Name", id: 1 },
										{ name: "Description", id: 2 },
									]}
									showHeader
									onPageChange={onPageChange}
									isServerSide
									handleServerSideSort={(field, method) =>
										handleSort(siteAssset, setSiteAssest, field, method)
									}
									page={page}
									count={assestCount}
									handleServierSideSearch={handleServierSideSearch}
									selectedValue={{
										id: input.defaultSiteAssetID?.id,
										name: input.defaultSiteAssetID?.name,
									}}
									placeholder={`Select ${customCaptions?.asset}`}
									selectdValueToshow="name"
									width="100%	"
									onChange={(list) =>
										setInput((prev) => ({ ...prev, defaultSiteAssetID: list }))
									}
									fetchData={fetchSiteFromDropDown}
								/>
							</ADD.LeftInputContainer>
						</ADD.InputContainer>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AddNewModelTask;
