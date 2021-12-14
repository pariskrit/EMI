import React, { useEffect, useState } from "react";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getUsersList } from "services/users/usersList";
import { CircularProgress } from "@material-ui/core";
import { handleSort } from "helpers/utils";
import AppsIcon from "@material-ui/icons/Apps";

function Test() {
	const [data, setData] = useState([]);
	const [selectItem, setSelectItem] = useState({});
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState({ pageNo: 1, perPage: 10 });

	useEffect(() => {
		const fetchData = async (pageNumber, perPageNumber) => {
			setLoading(true);
			const result = await getUsersList(pageNumber, perPageNumber);
			setData(result.data);
			setLoading(false);
		};
		fetchData(page.pageNo, page.perPage);
	}, []);

	const onChange = (item) => {
		setSelectItem(item);
	};

	//Pagination
	const onPageChange = async (p, prevData) => {
		try {
			const response = await getUsersList(p, page.perPage);
			if (response.status) {
				setPage({ pageNo: p, perPage: 10 });
				setData([...prevData, ...response.data]);
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	const handleServerSideSort = async (sortField, setOrder) => {
		const fetchData = async (pageNumber, perPageNumber) => {
			// setLoading(true);
			const result = await getUsersList(pageNumber, perPageNumber);
			setData(result.data);
			// setLoading(false);
		};
		fetchData(page.pageNo, 3);
	};

	const handleServierSideSearch = async (searchTxt) => {
		console.log(searchTxt);
	};
	return (
		<div style={{ margin: "30px auto" }}>
			<h2>Dynamic Dropdown component</h2>
			{loading ? (
				<CircularProgress />
			) : (
				<>
					<DyanamicDropdown
						dataSource={data}
						columns={[
							{ name: "displayName", id: 1, minWidth: "130px" },
							{ name: "email", id: 2, minWidth: "200px" },
						]}
						dataHeader={[
							{ name: "displayName", id: 1, minWidth: "130px" },
							{ name: "email", id: 2, minWidth: "200px" },
						]}
						columnsMinWidths={[140, 140, 140, 140, 140]}
						showHeader={true}
						onChange={onChange}
						selectdValueToshow="displayName"
						handleSort={handleSort}
						selectedValue={selectItem}
						page={page.pageNo}
						onPageChange={onPageChange}
						label="Select"
						isServerSide={false}
						handleServerSideSort={handleServerSideSort}
						showClear={true}
						icon={<AppsIcon />}
						handleServierSideSearch={handleServierSideSearch}
						required={true}
					/>
				</>
			)}
		</div>
	);
}

export default Test;
