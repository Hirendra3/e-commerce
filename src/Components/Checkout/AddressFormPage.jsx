// src/pages/AddressFormPage.jsx

import React, { useState } from "react";
import { Button, Container, Grid, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import { toast } from "react-toastify"; // Ensure toast is imported

const AddressFormPage = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userEmail: "",
    address: "",
    city: "",
    zipCode: "",
    userState: "",
  });
  const authToken = localStorage.getItem("Authorization");

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    console.log("userDetails", userDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a post request to add the address
      const response = await axios.post(
        "http://206.189.135.103:5000/api/addAddress",
        userDetails,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      toast.success("Address added successfully", {
        autoClose: 5000,
        theme: "colored",
      });
      navigate("/checkout"); // Navigate back or to a different page after submission
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error adding address", {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 10,
      }}
    >
      <Typography variant="h6" sx={{ margin: "20px 0" }}>
        Add New Address
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={userDetails.firstName}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={userDetails.lastName}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              type="tel"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="userEmail"
              value={userDetails.userEmail}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={userDetails.address}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              value={userDetails.city}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="tel"
              label="Postal/Zip Code"
              name="zipCode"
              value={userDetails.zipCode}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Province/State"
              name="userState"
              value={userDetails.userState}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Container
          sx={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <Button variant="contained" type="submit">
            Save Address
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Container>
      </form>
    </Container>
  );
};

export default AddressFormPage;
