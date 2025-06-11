const Error = ({ message }: { message: string | undefined }) => {
	return <p role="log">Error: {message}</p>;
};

export default Error;
