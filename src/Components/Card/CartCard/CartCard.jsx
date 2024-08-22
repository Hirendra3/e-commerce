import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
import styles from './CartCard.module.css';

const CartCard = ({ product, removeFromCart }) => {
    // Ensure productId is always extracted correctly
    const productId = product?.productId || product;

    // Handle cases where productId might be undefined or null
    if (!productId) {
        return null; // Don't render anything if productId is invalid
    }

    return (
        <Card className={styles.main_cart}>
            <Link to={`/Detail/type/${productId?.type}/${productId?._id}`}>
                <CardActionArea className={styles.card_action}>
                    <Box className={styles.img_box}>
                        <img
                            alt={productId?.name || 'Product Image'}
                            loading='lazy'
                            src={productId?.image || '/path/to/placeholder/image.jpg'}
                            className={styles.img}
                        />
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                            {productId?.name ? (
                                productId?.name.length > 20 ? productId?.name.slice(0, 20) + '...' : productId?.name
                            ) : (
                                'Product Name'
                            )}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                '& > *': {
                                    m: 1,
                                },
                            }}
                        >
                            {product?.quantity && (
                                <Button>
                                    <Typography variant='body2' color='black'>
                                        Quantity {product.quantity}
                                    </Typography>
                                </Button>
                            )}
                            <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                                ₹{productId?.price || '0.00'}
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                <Tooltip title='Remove From Cart'>
                    <Button
                        className='all-btn'
                        sx={{ width: 10, borderRadius: '30px' }}
                        variant='contained'
                        color='error'
                        onClick={() => removeFromCart(product)}
                    >
                        <AiFillDelete style={{ fontSize: 15 }} />
                    </Button>
                </Tooltip>
                <Typography>
                    <Rating
                        name="read-only"
                        value={Math.round(productId?.rating || 0)}
                        readOnly
                        precision={0.5}
                    />
                </Typography>
            </CardActions>
        </Card>
    );
};

export default CartCard;
