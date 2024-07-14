import React from "react";

const Product = ({
  item,
  addToCart,
  decrementItem,
  quantity,
  cartImg,
  incrementBtn,
  decrementBtn,
}) => {
  const { name, category, price, image } = item;
  const {  desktop } = image;



  let srcImage = desktop;

 
  const isInCart = quantity > 0;

  return (
    <div className="item">
      <img
        src={srcImage}
        alt="Dessert"
        style={{
          border: isInCart ? "3px solid hsl(14, 86%, 42%)" : "none",
        }}
      />

      {!isInCart && (
        <div className="addItembtn btn-1" onClick={() => addToCart(item)}>
          <img src={cartImg} alt="Add to Cart" />
          <span>Add to cart</span>
        </div>
      )}

      {isInCart && (
        <div className="addItembtn btn-2">
          <span className="decrementBtn" onClick={() => decrementItem(item)}>
            <img src={decrementBtn} alt="Decrement" />
          </span>
          <span>{quantity}</span>
          <span className="incrementBtn" onClick={() => addToCart(item)}>
            <img src={incrementBtn} alt="Increment" />
          </span>
        </div>
      )}

      <p className="category">{category}</p>
      <p className="name">{name}</p>
      <p className="price">${price}</p>
    </div>
  );
};

export default Product;
