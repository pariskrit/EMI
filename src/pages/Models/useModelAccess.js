import { useHistory } from "react-router-dom";
const useModelAccess = () => {
	const history = useHistory();
	const { position } = JSON.parse(localStorage.getItem("me"));
	const access = position?.modelAccess;
	if (
		position !== null &&
		(access === "F" || access === "E" || access === "R")
	) {
		return;
	} else {
		if (history.length > 1) {
			history.goBack();
		} else {
			history.push("/app/me");
		}
	}
};

export default useModelAccess;
