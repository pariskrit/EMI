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
	postModelAsset,
} from "services/models/modelDetails/modelAsset";
import EMICheckbox from "components/Elements/EMICheckbox";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import {
	generateErrorState,
	handleSort,
	handleValidateObj,
} from "helpers/utils";
import * as yup from "yup";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";

const ADD = AddDialogStyle();

// Yup validation schema
const schema = yup.object({
	asset: yup.number("Asset is Required").required("Asset is Required"),
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
}) => {
	const [loading, setLoading] = useState(false);
	const [assets, setAsset] = useState([]);
	const [input, setInput] = useState({ asset: {}, status: true });
	const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
	const [count, setCount] = useState(0);
	const { position, siteID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const [errors, setErrors] = useState({});

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
				console.log(result);
				setCount(result.data);
			}
		} catch (e) {
			return;
		}
	};

	const fetchAssetData = async () => {
		setLoading(true);
		await Promise.all([fetchAssets(), fetchAssetCount()]);
		setLoading(false);
	};

	useEffect(() => {
		if (open) fetchAssetData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const addModelAsset = async () => {
		const { status, asset } = input;

		const data = {
			ModelID: +modelId,
			SiteAssetID: asset.id,
			isActive: status,
		};

		setLoading(true);
		try {
			const localChecker = await handleValidateObj(schema, {
				asset: asset?.id,
			});

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				let result = await postModelAsset(data);
				if (result.status) {
					const assetData = assets.find((x) => x.id === asset.id);
					handleAddComplete({
						description: assetData.description,
						id: result.data,
						isActive: status,
						name: assetData.name,
					});
					closeOverride();
				} else {
					if (result.data?.detail) getError(result.data.detail);
					else {
						if (result.data?.detail) getError(result.data.detail);
					}
				}
			} else {
				// show validation errors
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
			setLoading(false);
		} catch (e) {
			return;
		}
	};

	const closeOverride = () => {
		handleClose();
		setAsset([]);
		setErrors({});
		setPage({ pageNo: 1, pageSize: 10 });
		setInput({ asset: {}, status: true });
	};

	const pageChange = (p, prevData) => {
		fetchAssets(p, prevData);
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
					<ADD.HeaderText>Add {title}</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<div className="modalButton">
						<ADD.CancelButton onClick={closeOverride} variant="contained">
							Cancel
						</ADD.CancelButton>
					</div>
					<div className="modalButton">
						<ADD.ConfirmButton onClick={addModelAsset} variant="contained">
							Add {title}
						</ADD.ConfirmButton>
					</div>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>
			<Divider />
			<DialogContent>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
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
							onChange={(val) => setInput((th) => ({ ...th, asset: val }))}
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
							isError={errors?.asset ? false : true}
							handleServierSideSearch={handleServerSideSearch}
							isServerSide
						/>
					</ErrorInputFieldWrapper>

					<FormGroup>
						<FormControlLabel
							control={
								<EMICheckbox
									state={input.status}
									changeHandler={() => {
										setInput((th) => ({ ...th, status: !th.status }));
									}}
								/>
							}
							label={<Typography>Active</Typography>}
						/>
					</FormGroup>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default AddModel;
