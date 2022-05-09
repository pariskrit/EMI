export const redService = ["T", "X", "N", "S"];
export const greenService = ["C", "P", "I", "O"];

export const serviceStatus = {
	T: "Stopped",
	X: "Cancelled",
	N: "Incomplete",
	S: "Scheduled",
	C: "Complete",
	P: "Complete (By Paper)",
	I: "In Progress",
	O: "Checked Out",
};

export const changeStatusReason = [
	{ id: "X", name: "Cancel", showIn: "S" },
	{ id: "C", name: "Complete", showIn: "T" },
	{ id: "I", name: "Incomplete", showIn: "T" },
	{ id: "P", name: "Completed by Paper", showIn: "S" },
];
