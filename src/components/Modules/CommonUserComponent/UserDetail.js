import React from "react";
import AccordionBox from "components/Layouts/AccordionBox";
import { Grid, TextField, Typography } from "@material-ui/core";

const UserDetail = ({
	title,
	data,
	setData,
	patchData,
	errors,
	setErrors,
}) => {
	// const [userDetail, setUserDetail] = useState({});

	const handleInputChange = (name, value) => {
		setErrors({ ...errors, [name]: null });

		setData((detail) => ({
			...detail,
			[name]: value,
		}));
	};

	return (
		<AccordionBox title={title} noExpand={true}>
			<Grid container spacing={5}>
				<Grid item sm={6}>
					<Typography>
						First Name <span style={{ color: "#E31212" }}>*</span>
					</Typography>
					<TextField
						name="firstName"
						variant="outlined"
						fullWidth
						onChange={(e) => handleInputChange("firstName", e.target.value)}
						onBlur={(e) => patchData("firstName", e.target.value)}
						value={data?.firstName || ""}
						error={errors["firstName"] === null ? false : true}
						helperText={
							errors["firstName"] === null ? null : errors["firstName"]
						}
					/>
				</Grid>
				<Grid item sm={6}>
					<Typography>
						Last Name <span style={{ color: "#E31212" }}>*</span>
					</Typography>
					<TextField
						name="lastName"
						variant="outlined"
						fullWidth
						value={data?.lastName || ""}
						onChange={(e) => handleInputChange("lastName", e.target.value)}
						onBlur={(e) => patchData("lastName", e.target.value)}
						error={errors["lastName"] === null ? false : true}
						helperText={errors["lastName"] === null ? null : errors["lastName"]}
					/>
				</Grid>
				<Grid item sm={6}>
					<Typography>
						Email Address <span style={{ color: "#E31212" }}>*</span>
					</Typography>
					<TextField
						name="email"
						variant="outlined"
						fullWidth
						value={data?.email || ""}
						onChange={(e) => handleInputChange("email", e.target.value)}
						onBlur={(e) => patchData("email", e.target.value)}
						error={errors["email"] === null ? false : true}
						helperText={errors["email"] === null ? null : errors["email"]}
					/>
				</Grid>
				<Grid item sm={6}>
					<Typography>Mobile Number</Typography>
					<TextField
						name="phone"
						variant="outlined"
						fullWidth
						value={data?.phone || ""}
						onChange={(e) => handleInputChange("phone", e.target.value)}
						onBlur={(e) => patchData("phone", e.target.value)}
					/>
				</Grid>
				<Grid item sm={6}>
					<Typography>External Reference Number </Typography>
					<TextField
						name="externalRef"
						variant="outlined"
						fullWidth
						value=""
						onChange={(e) => handleInputChange("externalRef", e.target.value)}
						onBlur={(e) => patchData("externalRef", e.target.value)}
					/>
				</Grid>
			</Grid>
		</AccordionBox>
	);
};

export default UserDetail;
