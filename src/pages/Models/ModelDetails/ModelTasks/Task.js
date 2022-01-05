import React, { useEffect } from "react";
import ModelTaskTable from "components/Modules/ModelTaskTable";
import SettingsIcon from "@material-ui/icons/Settings";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ImageIcon from "@material-ui/icons/Image";
import BuildIcon from "@material-ui/icons/Build";
import API from "helpers/api";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { Grid } from "@material-ui/core";

const AC = ContentStyle();

function Task() {
	const fetchData = async (modelVersionId) => {
		try {
			const response = await API.get(
				"/api/ModelVersionTasks?modelVersionId=" + modelVersionId
			);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchData(38);
	}, []);

	const handleSearch = async (searchTxt) => {};
	return (
		<div>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Tasks"}
					dataCount={50}
					description="Task assigned in this asset model"
				/>
				<AC.SearchContainer>
					<AC.SearchInner className="applicationSearchBtn">
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<SearchIcon />
							</Grid>
							<Grid item>
								<AC.SearchInput
									onChange={(e) => handleSearch(e.target.value)}
									label="Search"
								/>
							</Grid>
						</Grid>
					</AC.SearchInner>
				</AC.SearchContainer>
			</div>

			<ModelTaskTable
				handleEdit={() => {}}
				handleDelete={() => {}}
				setData={() => {}}
				headers={[
					{ id: 16, name: <ImageIcon />, sort: false },
					{ id: 15, name: <BuildIcon />, sort: false },
					{ id: 1, name: <SettingsIcon />, sort: false },
					{ id: 17, name: <NoteAddIcon />, sort: false },
					{
						id: 13,
						name: <WarningIcon style={{ color: "red" }} />,
						sort: false,
					},
					{
						id: 14,
						name: <ErrorOutlineIcon style={{ color: "red" }} />,
						sort: false,
					},
					{ id: 2, name: "Action", sort: true },
					{ id: 3, name: "Name", sort: true },
					{ id: 4, name: "Operating Mode", sort: true },
					{ id: 5, name: "System", sort: true },
					{ id: 6, name: "Roles", sort: true },
					{ id: 7, name: "Est Mins", sort: true },
					{ id: 9, name: "Order Added", sort: true },
					{ id: 10, name: "Intervals", sort: true, width: "100px" },
					{ id: 11, name: "Stages", sort: true },
					{ id: 12, name: "Zones", sort: true },
				]}
				columns={[
					"imageIcon",
					"buildIcon",
					"settingIcon",
					"noteIcon",
					"warningIcon",
					"ErrorIcon",
					"Action",
					"Name",
					"Operating Mode",
					"System",
					"Role",
					"Est Mins",
					"Order Added",
					"Intervals",
					"Stages",
					"Zones",
				]}
				data={[
					{
						id: 1,
						settingIcon: <SettingsIcon />,
						warningIcon: <WarningIcon style={{ color: "red" }} />,
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						settingIcon: <SettingsIcon />,
						warningIcon: <WarningIcon style={{ color: "red" }} />,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,,",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
					{
						id: 2,
						imageIcon: <ImageIcon />,
						noteIcon: <NoteAddIcon />,
						buildIcon: <BuildIcon />,
						ErrorIcon: <ErrorOutlineIcon style={{ color: "red" }} />,
						settingIcon: "",
						Action: "Fill",
						Name: "Transmission Oil",
						"Operating Mode": "Invloved",
						System: "Cabin",
						Role: "manager",
						"Est Mins": 12,
						"Order Added": 2,
						Intervals: "300hr,300hr,300hr",
						Stages: "Service",
						Zones: "Zone 1",
					},
				]}
			/>
		</div>
	);
}

export default Task;
