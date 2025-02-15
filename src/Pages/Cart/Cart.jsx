import React, { useContext, useEffect, useState } from "react";
import { ContextFunction } from "../../Context/Context";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Container,
  CssBaseline,
  Box,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillCloseCircle, AiOutlineLogin } from "react-icons/ai";
import CartCard from "../../Components/Card/CartCard/CartCard";
import ProductCard from "../../Components/Card/Product Card/ProductCard";
import "./Cart.css";
import OrderSummary from "./OrderSummary";
import { EmptyCart } from "../../Assets/Images/Image";
import { Transition } from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";

const Cart = () => {
  const { cart, setCart } = useContext(ContextFunction);
  const [total, setTotal] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [previousOrder, setPreviousOrder] = useState([]);
  let shippingCoast = 100;

  const navigate = useNavigate();
  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  useEffect(() => {
    if (setProceed) {
      getCart();
      getPreviousOrder();
    } else {
      setOpenAlert(true);
    }
    window.scroll(0, 0);
  }, [setProceed]); // Add setProceed as a dependency

  const calculateTotal = () => {
    if (!Array.isArray(cart)) return 0;

    const totalAmount = cart.reduce((acc, curr) => {
      // Log data to check what's being accessed
      console.log("Current Cart Item:", curr);

      // Extract price and quantity
      const price = curr?.price || 0;
      const quantity = curr?.quantity || 0;

      // Log extracted values
      console.log("Price:", price, "Quantity:", quantity);

      return acc + price * quantity + shippingCoast;
    }, 0);

    setTotal(totalAmount);
  };

  const getCart = async () => {
    if (setProceed) {
      try {
        const { data } = await axios.get(
          `http://206.189.135.103:5000/api/getCart`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setCart(data.result);
        calculateTotal(); // Update total after fetching cart
      } catch (error) {
        toast.error("Failed to load cart data", {
          autoClose: 500,
          theme: "colored",
        });
      }
    }
  };

  const handleClose = () => {
    setOpenAlert(false);
    navigate("/");
  };
  const handleToLogin = () => {
    navigate("/login");
  };
  const getPreviousOrder = async () => {
    const { data } = await axios.get(
      `http://206.189.135.103:5000/api/getCart`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    setPreviousOrder(data.result);
  };

  const removeFromCart = async (product) => {
    if (setProceed) {
      try {
        const response = await axios.get(
          `http://206.189.135.103:5000/api/deleteToCart/${product._id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        // Log the response to see what you're getting
        console.log("API Response:", response.data);

        // Check if the response indicates success
        if (response.data.success) {
          toast.success("Removed From Cart", {
            autoClose: 500,
            theme: "colored",
          });
          setCart(
            cart.filter((c) => c.productId._id !== product.productId._id)
          );
        } else {
          toast.error("Failed to remove from cart", {
            autoClose: 500,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Error removing from cart:", error); // Log the error for debugging
        toast.error("Something went wrong", {
          autoClose: 500,
          theme: "colored",
        });
      }
    }
  };

  const proceedToCheckout = async () => {
    if (cart.length <= 0) {
      toast.error("Please add items in cart to proceed", {
        autoClose: 500,
        theme: "colored",
      });
    } else {
      sessionStorage.setItem("totalAmount", total);
      navigate("/checkout");
    }
  };

  return (
    <>
      <CssBaseline />
      <Container fixed maxWidth>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: 10,
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          Cart
        </Typography>
        {setProceed && cart.length <= 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="main-card">
              <img
                src={EmptyCart}
                alt="Empty_cart"
                className="empty-cart-img"
              />
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Your Cart is Empty
              </Typography>
            </div>
          </Box>
        )}
        <Container sx={{ display: "flex", flexDirection: "column", mb: 10 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {Array.isArray(cart) && cart.length > 0 ? (
              cart.map((product) => (
                <CartCard
                  product={product}
                  removeFromCart={removeFromCart}
                  key={product._id}
                />
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{ textAlign: "center", marginTop: 10 }}
              >
                No items in your cart.
              </Typography>
            )}
          </Box>

          {cart.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OrderSummary
                proceedToCheckout={proceedToCheckout}
                total={total}
                shippingCoast={shippingCoast}
              />
            </Box>
          )}
        </Container>
      </Container>
      {setProceed && previousOrder.length > 0 && (
        <Typography variant="h6" sx={{ textAlign: "center", margin: "5px 0" }}>
          Previous Orders
        </Typography>
      )}
      <Container
        maxWidth="xl"
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: 20,
        }}
      >
        {previousOrder.map((product) => (
          <Link
            to={`/Detail/type/${product.type}/${product._id}`}
            key={product._id}
          >
            <ProductCard prod={product} />
          </Link>
        ))}
      </Container>
      <Dialog
        open={openAlert}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent
          sx={{
            width: { xs: 280, md: 350, xl: 400 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5"> Please Login To Proceed</Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="contained"
            onClick={handleToLogin}
            endIcon={<AiOutlineLogin />}
            color="primary"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<AiFillCloseCircle />}
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default Cart;
