import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import Row from "./Row";
import API from "helpers/api";
import useDidMountEffect from "hooks/useDidMountEffect";
import usePrevious from "hooks/usePrevious";

const successColor = "#24BA78";
const errorColor = "#E21313";

const media = "@media (max-width: 414px)";

const useStyles = makeStyles((theme) => ({
	box: {
		marginTop: 16,
	},
	tableContainer: {
		[media]: {
			whiteSpace: "nowrap",
		},
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
		width: "100%",
	},
}));

const header = (title, errorData, errors) => (
	<span>
		{title} &nbsp;&nbsp;
		{errors.total > 0 && (
			<span
				style={{
					color: errors.total === errors.resolved ? successColor : errorColor,
				}}
			>
				({errorData} Errors Resolved)
			</span>
		)}
	</span>
);

const Elements = ({
	name,
	title,
	errors,
	getApi,
	patchApi,
	siteAppID,
	mainData = [],
	errorName,
	modelName,
	elementID,
	onErrorResolve,
}) => {
	const classes = useStyles();
	const [dropDown, setDropDown] = useState([]);
	const [updatedDetails, setUpdatedDetails] = useState({
		data: mainData,
		selectedRow: 0,
	});

	useEffect(() => {
		if (siteAppID) {
			API.get(getApi + `?siteAppId=${siteAppID}`).then((res) =>
				setDropDown(res.data)
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppID]);
	const [prevData, setPreviousValue] = usePrevious(updatedDetails);

	const setErrorResolve = (datas, y) => {
		// If input value is null i.e. deleted then subtract else add

		const uData = updatedDetails.data.map((x) => {
			return x.id === y.id ? { ...x, ...datas } : x;
		});
		setUpdatedDetails({ data: uData, selectedRow: y.id });
	};
	useDidMountEffect(() => {
		const uData = prevData.data.map((x) => {
			return x.id === updatedDetails.selectedRow
				? updatedDetails.data.find((y) => y.id === x.id)
				: x;
		});
		setPreviousValue({ data: uData, selectedRow: updatedDetails.selectedRow });
		onErrorResolve(uData, modelName, errorName, elementID);
	}, [updatedDetails]);
	return (
		<AccordionBox
			accordionClass={classes.box}
			defaultExpanded={false}
			title={header(title, `${errors.resolved}/${errors.total}`, errors)}
		>
			<Table className={classes.tableContainer}>
				<TableHead className={classes.tableHead}>
					<TableRow>
						<TableCell>Source {name}</TableCell>
						<TableCell>Destination {name} (Please Select)</TableCell>
						<TableCell>Destination {name} (Add New)</TableCell>
						<TableCell>Resolved ?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{mainData.map((x) => (
						<Row
							key={x.id}
							dropDown={dropDown.map((x) => ({ label: x.name, value: x.id }))}
							x={x}
							patchApi={patchApi}
							setErrorResolve={(data) => setErrorResolve(data, x)}
							elementID={elementID}
						/>
					))}
				</TableBody>
			</Table>
		</AccordionBox>
	);
};

export default Elements;
