import React, { useEffect, useState } from "react";
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
import { postModelAsset } from "services/models/modelDetails/modelAsset";
import EMICheckbox from "components/Elements/EMICheckbox";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { handleSort } from "helpers/utils";

const ADD = AddDialogStyle();

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
	const [input, setInput] = useState({ asset: {}, status: false });
	const [page, setPage] = useState({ pageNo: 1, pageSize: 10 });
	const [count, setCount] = useState(0);
	const { position, siteID } = JSON.parse(sessionStorage.getItem("me"));

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
			let result = await postModelAsset(data);
			if (result.status) {
				setLoading(false);
				const assetData = assets.find((x) => x.id === asset.id);
				handleAddComplete({
					description: assetData.description,
					id: result.data,
					isActive: status,
					name: assetData.name,
				});
				closeOverride();
			} else {
				setLoading(false);
				if (result.data?.detail) getError(result.data.detail);
				else {
					if (result.data?.detail) getError(result.data.detail);
				}
			}
		} catch (e) {
			return;
		}
	};

	const closeOverride = () => {
		handleClose();
		setAsset([]);
		setPage({ pageNo: 1, pageSize: 10 });
		setInput({ asset: {}, status: false });
	};

	const pageChange = (p, prevData) => {
		fetchAssets(p, prevData);
		setPage({ pageNo: p, pageSize: page.pageSize });
	};

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
							Save
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
					<DyanamicDropdown
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
					/>

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
							label={<Typography>Status</Typography>}
						/>
					</FormGroup>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default AddModel;
