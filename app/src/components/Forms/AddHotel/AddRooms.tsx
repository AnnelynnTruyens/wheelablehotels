import styles from "../Forms.module.css";
import AddRoom from "./Partials/AddRoom";
import Progress from "./Partials/Progress";

interface AddRoomsProps {
	goToNext: () => void; // Callback to handle going to next step
	goToPrevious: () => void; // Callback to handle going to previous step
}

const AddRooms: React.FC<AddRoomsProps> = ({ goToNext, goToPrevious }) => {
	return (
		<div className={styles.container_full}>
			<Progress step={3} />
			<h1 className={styles.title}>Add rooms</h1>
			<p>Please only add accessible rooms.</p>

			<form method="post" className={styles.form} onSubmit={goToNext}>
				<AddRoom />
				<button>Add another room</button>
				<div className={styles.buttons}>
					<button onClick={goToPrevious}>Previous</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddRooms;
