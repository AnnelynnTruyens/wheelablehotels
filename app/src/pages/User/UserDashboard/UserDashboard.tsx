import { useNavigate } from "react-router";
import useStores from "../../../hooks/useStores";
import { useEffect, useState } from "react";
import ROUTES from "../../../consts/Routes";
import Loading from "../../../components/Loading/Loading";
import { useAuth } from "../../../contexts/AuthContext";

const UserDashboard = () => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<Boolean>(true);

	const { logout } = useAuth();
	const { UiStore } = useStores();

	// Wait for currentUser to be set
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);

			if (!UiStore.currentUser) {
				navigate(ROUTES.home);
			}
		};

		waitForUser();
	}, [UiStore, navigate]);

	// Logout function
	const handleLogout = () => {
		logout();
	};

	if (isLoading)
		return (
			<main id="main" className="main">
				<title>Dashboard | Wheelable Hotels</title>

				<Loading />
			</main>
		);
	else
		return (
			<main id="main" className="main">
				<title>Dashboard | Wheelable Hotels</title>
				<h1>Welcome {UiStore.currentUser?.username}!</h1>
				<button onClick={handleLogout}>Log out</button>
			</main>
		);
};

export default UserDashboard;
