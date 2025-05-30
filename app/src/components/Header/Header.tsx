import { Link, NavLink, useMatch } from "react-router";
import ROUTES from "../../consts/Routes";
import styles from "./Header.module.css";

const Header = () => {
	// Use useMatch to check if the current route matches the home page
	const isHomePage = useMatch("/");
	return (
		<>
			<a href="#main" className={styles.skip}>
				Skip to main content
			</a>
			{isHomePage ? (
				<header className={styles.header_home}>
					<Link to={ROUTES.home}>
						<img
							src="./src/assets/Logo_WheelableHotels_black.png"
							alt="logo Wheelable Hotels"
							className={styles.logo_home}
						/>
					</Link>
					<nav className={styles.nav}>
						<ul className={styles.nav_list_home}>
							<li className={styles.nav_listitem_home}>
								<NavLink
									to={ROUTES.hotelOverview}
									className={styles.nav_link_home}
								>
									Search hotels
								</NavLink>
							</li>
							<li className={styles.nav_listitem_home}>
								<NavLink to={ROUTES.contact} className={styles.nav_link_home}>
									Contact
								</NavLink>
							</li>
							<li className={styles.nav_listitem_home}>
								<NavLink to={ROUTES.addHotel} className={styles.nav_btn_home}>
									Add a hotel
								</NavLink>
							</li>
							<li className={styles.nav_listitem_home}>
								<NavLink
									to={ROUTES.favourites}
									className={styles.nav_link_home}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										viewBox="0 0 40 40"
										fill="none"
										className={styles.nav_icon_home}
									>
										<path
											d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
											strokeWidth="3.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</NavLink>
							</li>
							<li className={styles.nav_listitem_home}>
								<NavLink
									to={ROUTES.userDashboard}
									className={styles.nav_link_home}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 32 32"
										className={`${styles.nav_icon_home} ${styles.icon_user_home}`}
									>
										<path
											d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7479 20 21.3334 20H10.6667C9.25222 20 7.89566 20.5619 6.89547 21.5621C5.89528 22.5623 5.33337 23.9188 5.33337 25.3333V28M21.3334 9.33333C21.3334 12.2789 18.9456 14.6667 16 14.6667C13.0545 14.6667 10.6667 12.2789 10.6667 9.33333C10.6667 6.38781 13.0545 4 16 4C18.9456 4 21.3334 6.38781 21.3334 9.33333Z"
											strokeWidth="3.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</NavLink>
							</li>
						</ul>
					</nav>
				</header>
			) : (
				<header className={styles.header}>
					<Link to={ROUTES.home}>
						<img
							src="./src/assets/Logo_WheelableHotels_blue.png"
							alt="logo Wheelable Hotels"
							className={styles.logo}
						/>
					</Link>
					<nav className={styles.nav}>
						<ul className={styles.nav_list}>
							<li className={styles.nav_listitem}>
								<NavLink to={ROUTES.hotelOverview} className={styles.nav_link}>
									Search hotels
								</NavLink>
							</li>
							<li className={styles.nav_listitem}>
								<NavLink to={ROUTES.contact} className={styles.nav_link}>
									Contact
								</NavLink>
							</li>
							<li className={styles.nav_listitem}>
								<NavLink to={ROUTES.addHotel} className={styles.nav_btn}>
									Add a hotel
								</NavLink>
							</li>
							<li className={styles.nav_listitem}>
								<NavLink to={ROUTES.favourites} className={styles.nav_link}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										viewBox="0 0 40 40"
										fill="none"
										className={styles.nav_icon}
									>
										<path
											d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
											strokeWidth="3.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</NavLink>
							</li>
							<li className={styles.nav_listitem}>
								<NavLink to={ROUTES.userDashboard} className={styles.nav_link}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 32 32"
										className={`${styles.nav_icon} ${styles.icon_user}`}
									>
										<path
											d="M26.6667 28V25.3333C26.6667 23.9188 26.1048 22.5623 25.1046 21.5621C24.1044 20.5619 22.7479 20 21.3334 20H10.6667C9.25222 20 7.89566 20.5619 6.89547 21.5621C5.89528 22.5623 5.33337 23.9188 5.33337 25.3333V28M21.3334 9.33333C21.3334 12.2789 18.9456 14.6667 16 14.6667C13.0545 14.6667 10.6667 12.2789 10.6667 9.33333C10.6667 6.38781 13.0545 4 16 4C18.9456 4 21.3334 6.38781 21.3334 9.33333Z"
											strokeWidth="3.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</NavLink>
							</li>
						</ul>
					</nav>
				</header>
			)}
		</>
	);
};

export default Header;
