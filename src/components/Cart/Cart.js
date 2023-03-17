import { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const cartCtx = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEmptyPrompt, setIsEmptyPrompt] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckOut(true);
  };


  const cartEmptyConfirmation = () => {
    setIsEmptyPrompt(true);
  }
  const cartEmptyHandler = () => {
    cartCtx.emptyCart();
    setIsEmptyPrompt(false);
  }

  const emptyPromptCancelHandler = () => {
    setIsEmptyPrompt(false);
  }


  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch("https://react-372b2-default-rtdb.firebaseio.com/orders.json", {
      method: "POST",
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items,
      }),
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const cartModalContent = 
  <div>
    {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckOut && (
        <div className={classes.actions}>
          <button className={classes["button--alt"]} onClick={props.onClose}>
            Close
          </button>
          <button className={classes["button--alt"]} onClick={cartEmptyConfirmation}>Empty Cart</button>
          {hasItems && (
            <button className={classes.button} onClick={orderHandler}>
              Order
            </button>
          )}
        </div>
      )}
  </div>;

  const isSubmittingModalContent = <div>
    <h2>🛣️ Submitting Order, Please Wait...</h2>
  </div>

  const submittedModalContent = <div>
    <h2>✅ Successfully Submitted!</h2>
    <div className={classes.actions}>
    <button className={classes.button} onClick={props.onClose}>Close</button>
    </div>
  </div>

  const emptyPrompt = 
  <div>
    <h2>Are you sure you want to remove all orders?</h2>
    <div className={classes.actions}>
      <button className={classes.button} onClick={emptyPromptCancelHandler}>Cancel</button>
      <button className={classes.button} onClick={cartEmptyHandler}>Confirm</button>
    </div>
  </div>

  return (
    <Modal onClose={props.onClose}>
      {isEmptyPrompt && emptyPrompt}
      {!isSubmitting && !submitted && !isEmptyPrompt && cartModalContent}
      {isSubmitting && !submitted && isSubmittingModalContent}
      {!isSubmitting && submitted && submittedModalContent}
    </Modal>
  );
};

export default Cart;
