import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useHistoryLength from "./useHistoryLength";

const useSuperAdminExclude = () => {
	const navigate = useNavigate();
	const { historyLength } = useHistoryLength();
	const isLoading = useSelector((state) => state.commonData.isLoading);
	const { position } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	if (!isLoading) {
		if (position === null) {
			if (historyLength > 1) {
				navigate(-1);
			} else {
				navigate("/app/me");
			}
		}
	}
};

export default useSuperAdminExclude;
