import { Link, useNavigate } from "react-router";
import styles from "./Home.module.css";
import ROUTES from "../../consts/Routes";
import RegisterForm from "../../components/Forms/RegisterForm";
import HotelHighlight from "../../components/Cards/Hotels/HotelHighlight";
import SearchForm from "../../components/Forms/SearchForm";
import { useEffect, useState } from "react";
import { getHotels, Hotel } from "../../services/HotelService";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

// Type home component
interface HomeProps {
	onLogin: (token: string) => void;
}

const Home: React.FC<HomeProps> = ({ onLogin }) => {
	const navigate = useNavigate();

	const [searchValue, setSearchValue] = useState("");
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchValue.trim()) {
			navigate(`/search?search=${encodeURIComponent(searchValue.trim())}`);
		} else {
			navigate("/search");
		}
	};

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	useEffect(() => {
		getHotels()
			.then((response) => {
				setHotels(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		if (hotels.length > 0) {
			const completedHotels = hotels.filter(
				(hotel) => hotel.status === "completed"
			);
			setFilteredHotels(completedHotels);
		}
	}, [hotels]);

	return (
		<main id="main" className={styles.main}>
			<title>Wheelable Hotels</title>
			<div className={styles.hero}>
				<SearchForm
					searchValue={searchValue}
					onSearchChange={setSearchValue}
					onSearchSubmit={handleSearchSubmit}
				/>
			</div>
			<div className={styles.content}>
				<section className={`${styles.section} ${styles.intro}`}>
					<div className={`${styles.section_text} ${styles.intro_text}`}>
						<p>
							<span className={styles.intro_name}>Wheelable Hotels</span> is a
							platform made by and for wheelchair users. It's our mission to
							make finding accessible hotels easier. On our platform, you can
							search hotels by destination or name, and you can filter them
							based on your accessibility needs. You can also find accessibility
							information about the hotel and the accessible rooms.
						</p>
						<p>
							We know how important experiences from others are when looking at
							hotels, so you can also see ratings and reviews from others. To
							make your search easier, you can save hotels to your favourites
							and come back to them at a later time.
						</p>
						<p>
							All of our hotels are added by members of the community and all
							information has been checked by an admin before being published on
							the platform. This way we try to reduce the extra research that
							comes with travelling as a wheelchair user. We can't guarantee
							that all information is 100% correct, but if you find any
							mistakes, please <Link to={ROUTES.contact}>contact us</Link> and
							let us know.
						</p>
					</div>
					<img
						src="/assets/DSC_0045.jpg"
						alt="Girl in wheelchair in front of beach"
						className={styles.intro_img}
					/>
				</section>
				<section className={`${styles.section} ${styles.community}`}>
					<div className={styles.community_left}>
						<h1 className={styles.section_title}>Community-based</h1>
						<p className={styles.section_text}>
							Our platform is community-based. All of our hotels are added by
							community member, based on their own experiences. As part of our
							community, you can add your own favourite accessible hotels, as
							well as rate and review hotels others added. You can also add the
							hotels you want to explore to your favourites for later.
						</p>
						<p className={styles.section_text}>
							Join us in creating a more accessible travel experience, one hotel
							at a time.
						</p>
					</div>
					<RegisterForm onLogin={onLogin} />
				</section>
				<section className={`${styles.section} ${styles.hotels}`}>
					<h1 className={styles.section_title}>Community favourites</h1>
					<div className={styles.hotel_highlights}>
						{isLoading ? (
							<Loading />
						) : error ? (
							<Error message={error.message} />
						) : filteredHotels && filteredHotels.length > 0 ? (
							filteredHotels.map((hotel) => {
								return (
									<HotelHighlight
										hotelName={hotel.name}
										hotelId={hotel._id}
										location={hotel.location}
									/>
								);
							})
						) : null}
					</div>
				</section>
			</div>
		</main>
	);
};

export default Home;
