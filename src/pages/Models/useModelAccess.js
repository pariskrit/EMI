import { useHistory } from "react-router-dom";
const useModelAccess = () => {
	const history = useHistory();
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (position === null) {
		if (history.length > 1) {
			history.goBack();
		} else {
			history.push("/app/me");
		}
	}
};

export default useModelAccess;
