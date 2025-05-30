import { Link, useNavigate } from "react-router";
import ROUTES from "../../consts/Routes";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";
import { useState } from "react";
import { login, register } from "../../services/AuthService";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";

// Type register component
interface RegisterFormProps {
	onLogin: (token: string) => void; // Callback to handle login success
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onLogin }) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		role: "user",
	});
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const { username, email, password, role } = formData;

	// Function to handle in register form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle register
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		register({ username, email, password, role })
			.then(() => {
				login({ email, password })
					.then(({ data }) => {
						onLogin(data.token);
						navigate(ROUTES.home);
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						navigate(ROUTES.login);
						setIsLoading(false);
					});
			})
			.catch((error) => {
				setError(error);
				navigate(ROUTES.register);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error message={error.message} />;
	else
		return (
			<div className={styles.container}>
				<p className={styles.title}>Join our community!</p>
				<form onSubmit={handleSubmit} className={styles.form}>
					<FormInput
						label="Username"
						type="text"
						id="username"
						name="username"
						value={username}
						placeholder="JohnDoe"
						onChange={handleChange}
					/>
					<FormInput
						label="Email"
						type="email"
						id="email"
						name="email"
						value={email}
						placeholder="john.doe@example.com"
						onChange={handleChange}
					/>
					<FormInput
						label="Password"
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={handleChange}
					/>
					<div className={styles.buttons}>
						<button type="submit">Register</button>
						<Link to={ROUTES.login}>I already have an account</Link>
					</div>
				</form>
			</div>
		);
};

export default RegisterForm;
