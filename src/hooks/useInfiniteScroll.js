import { useEffect, useState, useRef, useMemo } from "react";

function useInfiniteScroll(data, count, fetchData) {
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const dataRef = useRef(data);
	const countRef = useRef(count);
	useMemo(() => {
		dataRef.current = data;
		countRef.current = count;
	}, [data, count]);

	const fetchMoreData = async () => {
		if (dataRef.current.length >= countRef.current) {
			setHasMore(false);
			return;
		}
		setLoading(true);
		await fetchData(dataRef.current);
		setLoading(false);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleScroll = () => {
		if (loading || !hasMore) return;

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
