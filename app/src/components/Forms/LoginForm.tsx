import { Link } from "react-router";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";
import ROUTES from "../../consts/Routes";
import React, { useState } from "react";
import { login } from "../../services/AuthService";
import Loading from "../Loading/Loading";

interface LoginFormProps {
	onLogin: (token: string) => void; // Callback to handle login success
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { email, password } = formData;

	// Function to handle in register form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle login
	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		setError(null); // Clear any previous errors

		if (formData.email !== "" && formData.password !== "") {
			login({ email, password })
				.then(({ data }) => {
					onLogin(data.token); // Call the onLogin callback with the token
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error.message || "Login failed. Please try again.");
					setIsLoading(false);
				});
		} else {
			setError("Please fill in all fields.");
			setIsLoading(false);
		}
	};

	// Function to show password
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	if (isLoading) return <Loading />;

	return (
		<div className={styles.container}>
			<p className={styles.title}>Log in here!</p>
			<form method="post" className={styles.form} onSubmit={handleLogin}>
				<FormInput
					label="email"
					type="text"
					id="email"
					name="email"
					placeholder="JohnDoe"
					value={email}
					onChange={handleChange}
					required={true}
					autocomplete="email"
				/>
				<div className={styles.password}>
					<FormInput
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						name="password"
						value={password}
						onChange={handleChange}
						required={true}
						autocomplete="current-password"
					/>
					<label htmlFor="showPassword" className={styles.checkbox}>
						<input
							type="checkbox"
							id="showPassword"
							checked={showPassword}
							onChange={togglePasswordVisibility}
						/>
						Show password
					</label>
				</div>
				{error && <p className={styles.error}>{error}</p>}
				<div className={styles.buttons}>
					<button type="submit">Login</button>
					<Link to={ROUTES.register}>I don't have an account yet</Link>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
