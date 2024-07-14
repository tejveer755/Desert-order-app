import React, { useEffect, useState } from "react";
import "./App.css";
import Product from "./components/Product";
import emptyCartImg from "./illustration-empty-cart.svg";
import removeItemImg from "./icon-remove-item.svg";
import cartImg from "./icon-add-to-cart.svg";
import incrementBtn from "./icon-increment-quantity.svg";
import decrementBtn from "./icon-decrement-quantity.svg";
import treeImg from "./icon-carbon-neutral.svg";
import tick from "./icon-order-confirmed.svg";


function App() {
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("./data.json")
      .then((result) => result.json())
      .then((data) => {
        const menuWithQuantity = data.map((item) => ({
          ...item,
          quantity:
            cart.find((cartItem) => cartItem.name === item.name)?.quantity || 0,
        }));
        setMenu(menuWithQuantity);
        console.log(menu);
      });
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, menu]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  const modifyCart = (product, operation) => {
    const index = cart.findIndex((item) => item.name === product.name);
    if (index !== -1) {
      const updatedCart = [...cart];
      operation(updatedCart, index);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const addToCart = (product) => {
    modifyCart(product, (updatedCart, index) => {
      updatedCart[index].quantity += 1;
      updateCart(updatedCart);
    });
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const decrementItem = (product) => {
    modifyCart(product, (updatedCart, index) => {
      if (updatedCart[index].quantity === 1) {
        removeFromCart(index);
      } else {
        updatedCart[index].quantity -= 1;
        updateCart(updatedCart);
      }
    });
  };

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(
    JSON.parse(localStorage.getItem("isOrderConfirmed")) || false
  );
  useEffect(() => {
    localStorage.setItem("isOrderConfirmed", JSON.stringify(isOrderConfirmed));
  }, [isOrderConfirmed]);

  const startNewOrder = () => {
    setIsOrderConfirmed(false);
    setCart([]);
  };

  return (
    <div className="app">
      <main>
        <h1>Desserts</h1>
        <div className="menu">
          {menu.map((item) => (
            <Product
              key={item.name}
              item={item}
              quantity={item.quantity}
              cartImg={cartImg}
              decrementBtn={decrementBtn}
              incrementBtn={incrementBtn}
              addToCart={addToCart}
              decrementItem={decrementItem}
            />
          ))}
        </div>
      </main>

      <div className="cart">
        <h1>Your Cart ({totalCount})</h1>
        {cart.length === 0 ? (
          <div>
            <img src={emptyCartImg} alt="Empty Cart" className="tick" />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="addedItem">
                <div>
                  <h3>{item.name}</h3>
                  <p className="item-details">
                    <span className="quantity">{item.quantity}x</span>
                    <span className="price">@${item.price}</span>
                    <span className="total">${item.price * item.quantity}</span>
                  </p>
                </div>
                <div
                  className="remove-item"
                  onClick={() => removeFromCart(index)}
                >
                  <img src={removeItemImg} alt="Remove Item" />
                </div>
              </div>
            ))}

            <div className="order-amount">
              <span>Order Total</span>
              <span className="total-amount">${totalAmount}</span>
            </div>

            <div className="carbon">
              <img src={treeImg} alt="" />
              <p>
                This is a <span>cardon-neutral</span> delivery
              </p>
            </div>
            <button
              className="confirm-order"
              onClick={() => setIsOrderConfirmed(true)}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>

      {isOrderConfirmed && (
        <div className="overlay">
          <div className="order-confirmed-msg">
            <img src={tick} alt="" />
            <h2>Order Confirmed!</h2>
            <div className="bill">
              {cart.map((item, index) => (
                <div key={index} className="placed-oder-items">
                  <img
                    src={item.image.thumbnail}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p className="item-details">
                      <span className="quantity">{item.quantity}x</span>
                      <span className="">@${item.price}</span>
                    </p>
                  </div>
                  <h4 className="total">${item.price * item.quantity}</h4>
                </div>
              ))}
            </div>

            <div className="bill-amount">
              <span className="order-total">Order Total</span>
              <span className="total-amount">${totalAmount}</span>
            </div>

            <button className="set-new-order" onClick={startNewOrder}>
              Start New order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
