import NoResults from "../../NoResults/NoResults";
import styles from "./RoomCard.module.css";

interface RoomCardProps {
	roomName: string;
	roomDescription: string;
	accessibilityFeatures: { _id: string; name: string }[];
	accessibilityInfo: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
	roomName,
	accessibilityFeatures,
	roomDescription,
	accessibilityInfo,
}) => {
	return (
		<div className={styles.room}>
			<h3 className={styles.title}>{roomName}</h3>
			<h4 className={styles.subtitle}>Description</h4>
			<p className={styles.text}>{roomDescription}</p>
			<h4 className={styles.subtitle}>Accessibility features</h4>
			{accessibilityFeatures && accessibilityFeatures.length > 0 ? (
				<ul className={styles.list}>
					{accessibilityFeatures.map((feature, index) => {
						return (
							<li key={`feature_${index}`} className={styles.list_li}>
								{feature.name}
							</li>
						);
					})}
				</ul>
			) : (
				<NoResults insert="accessibility features" />
			)}
			<h4 className={styles.subtitle}>Accessibility information</h4>
			<p className={styles.text}>{accessibilityInfo}</p>
		</div>
	);
};

export default RoomCard;
