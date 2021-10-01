import { useEffect, useState, useRef, useMemo } from "react";
import { DefaultPageSize } from "helpers/constants";

function useInfiniteScroll(data, count, fetchData, page, searchText) {
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const dataRef = useRef(data);
	const countRef = useRef(count);
	const pageRef = useRef(page);
	const prevPageRef = useRef(0);

	useMemo(() => {
		dataRef.current = data;
		countRef.current = count;
		pageRef.current = page;
	}, [data, count, page]);
	useEffect(() => {
		setHasMore(true);
		pageRef.current = 1;
	}, [searchText]);

	const fetchMoreData = async () => {
		if (countRef.current / pageRef.current < DefaultPageSize) {
			setHasMore(false);
			return;
		}
		if (prevPageRef.current !== pageRef.current) {
			prevPageRef.current = pageRef.current;
			setLoading(true);
			await fetchData(pageRef.current, dataRef.current);
			setLoading(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleScroll = () => {
		if (loading) return;

		if (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		) {
			fetchMoreData();
		}
	};
	const gotoTop = () => {
		window.scroll({ top: 0, left: 0, behavior: "smooth" });
	};
	return { hasMore, loading, gotoTop };
}

export default useInfiniteScroll;
