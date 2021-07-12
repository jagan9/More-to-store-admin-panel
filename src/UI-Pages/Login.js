import React, { Component } from 'react';
import Logo from '../media/Logo.jpg'
import { Container, Button, CircularProgress, Box, TextField, Typography } from '@material-ui/core';
import firebase from '../firebase'


class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: "",
			password: "",
			show_progress: false,
		};

		this.handelChange = this.handelChange.bind()
		this.login = this.login.bind()
	}

	handelChange = (e) => {
		this.setState({

			[e.target.name]: e.target.value,
		})
	}

	login = () => {
		let validDate = true;
		this.state.email_error = null;
		this.state.password_error = null;


		if (this.state.email === "") {
			this.state.email_error = "required!";
			validDate = false;
		}

		if (this.state.password === "") {
			this.state.password_error = "required!";
			validDate = false;
		}

		this.setState({
			update: true
		})


		if (validDate) {
			this.state.show_progress = true

			firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
				this.props.history.replace('/');
			}).catch((error) => {
				console.log(error);
				if (error.code === "auth/wrong-password") {

					this.state.password_error = "incorrect Password!";
					this.setState({
						show_progress: false,
					})

				}
			})
		}
	}


	render() {

		return (
			<Container maxWidth="xs">
				<Box bgcolor="white" boxShadow="2" textAlign="center" p="24px" mt="50px" borderRadius="13px">
					<img src={Logo} height="90px" />
					<Typography variant="h5" color="primary">ADMIN</Typography><br /><br />
					<TextField error={this.state.email_error != null} helperText={this.state.email_error} onChange={this.handelChange} name="email" color="secondary" size="small" label="email" fullWidth variant="outlined" /><br /><br />
					<TextField error={this.state.password_error != null} helperText={this.state.password_error} onChange={this.handelChange} name="password" color="secondary" size="small" label="password" fullWidth variant="outlined" /><br /><br />
					{this.state.show_progress ? (<CircularProgress size={35} color="primary" thickness="5" />) : null}<br /><br />
					<Button onClick={this.login} disabledElevation fullWidth variant="contained" color="primary"> LOGIN
					</Button>

				</Box>

			</Container>
		);
	}
}



export default Login;


