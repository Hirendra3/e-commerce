import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { ContextFunction } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import AddressFormPage from "./AddressFormPage"; // Import the new address form page component

const CheckoutForm = () => {
  const { cart } = useContext(ContextFunction);
  const [useraddress, setUseraddress] = useState([]);
  const [userdetails, setdetails] = useState([]);

  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;
  let navigate = useNavigate();
  let totalAmount = sessionStorage.getItem("totalAmount");

  useEffect(() => {
    if (setProceed) {
      getPreviousOrder();
    } else {
      navigate("/");
    }
  }, []);

  const getPreviousOrder = async () => {
    try {
      const { data } = await axios.get(
        `http://206.189.135.103:5000/api/getUseraddress`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setdetails(data.result.user);
      setUseraddress(data.result.address);
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  const handleEdit = (index) => {
    console.log("Edit address:", useraddress[index]);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://206.189.135.103:5000/api/deleteUseraddress/${useraddress[index]._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      getPreviousOrder();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAddNewAddress = () => {
    console.log("Add New Address");
  };
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  return (
    <Container>
      <Button
        variant="contained"
        onClick={handleOpenPopup}
        sx={{
          backgroundColor: "#ff5722",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#e64a19",
          },
        }}
      >
        Add New Address
      </Button>

      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <AddressFormPage />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3} className="address-grid">
        {useraddress.map((address, index) => (
          <Grid
            item
            xs={12}
            md={6}
            key={index}
            style={{
              padding: "15px",
              backgroundColor: "#f9f9f9",
              marginTop: "2rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Address {index + 1}
            </Typography>
            <Typography variant="body1" style={{ marginTop: "8px" }}>
              {address.add}
            </Typography>
            {/* Display user details */}
            <Typography variant="body1" style={{ marginTop: "8px" }}>
              Name {address.firstName} {address.lastName}
            </Typography>
            <Typography variant="body1" style={{ marginTop: "4px" }}>
              Mobile No. {address.phoneNumber}
            </Typography>
            <Typography variant="body1" style={{ marginTop: "4px" }}>
              Email Id {userdetails.email}
            </Typography>
            <div style={{ marginTop: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(index)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CheckoutForm;
