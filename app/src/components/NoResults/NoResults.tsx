interface NoResultsProps {
	insert: string;
}

const NoResults: React.FC<NoResultsProps> = ({ insert }) => {
	return <p>No {insert} found</p>;
};

export default NoResults;
