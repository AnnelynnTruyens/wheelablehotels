import { Link, NavLink } from "react-router";
import styles from "./Footer.module.css";
import ROUTES from "../../consts/Routes";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<Link to={ROUTES.home}>
				<img
					src="/logo/Logo_WheelableHotels_white.png"
					alt="Logo Wheelable Hotels"
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
						<NavLink to={ROUTES.userDashboard} className={styles.nav_link}>
							Profile
						</NavLink>
					</li>
					<li className={styles.nav_listitem}>
						<NavLink to={ROUTES.contact} className={styles.nav_link}>
							Contact
						</NavLink>
					</li>
					<li className={styles.nav_listitem}>
						<NavLink to={ROUTES.accessibility} className={styles.nav_link}>
							Accessibility statement
						</NavLink>
					</li>
					<li className={styles.nav_listitem}>
						<NavLink to={ROUTES.privacy} className={styles.nav_link}>
							Privacy statement
						</NavLink>
					</li>
				</ul>
			</nav>
		</footer>
	);
};

export default Footer;
