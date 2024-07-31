import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import res from "./data.json";
import { ReactComponent as ShoppingCart } from "./images/icon-add-to-cart.svg";
import { ReactComponent as Cake } from "./images/illustration-empty-cart.svg";
import { ReactComponent as Minus } from "./images/icon-decrement-quantity.svg";
import { ReactComponent as Plus } from "./images/icon-increment-quantity.svg";
import { ReactComponent as Remove } from "./images/icon-remove-item.svg";
import { ReactComponent as Carbon } from "./images/icon-carbon-neutral.svg";
import { ReactComponent as Confirm } from "./images/icon-order-confirmed.svg";
interface Item {
  newId: string;
  category: string;
  name: string;
  price: number;
  image: {
    desktop: string;
  };
}
interface CartItem extends Item {
  quantity: number;
}
function App() {
  const [data, setData] = useState<Item[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [confirm, setConfrim] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const newItem = { ...prev };
      if (newItem[item.newId]) {
        newItem[item.newId] = {
          ...newItem[item.newId],
          quantity: newItem[item.newId].quantity + 1,
        };
      } else {
        newItem[item.newId] = { ...item, quantity: 1 };
      }
      console.log("Added to Cart:", newItem);

      return newItem;
    });
    setSelectedItems((prev) => ({
      ...prev,
      [item.newId]: true,
    }));
  };
  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const { [itemId]: removedItem, ...remainingItems } = prevCart;
      if (removedItem) {
        if (removedItem.quantity > 1) {
          return {
            ...remainingItems,
            [itemId]: {
              ...removedItem,
              quantity: removedItem.quantity - 1,
            },
          };
        } else {
          setSelectedItems((prev) => {
            const { [itemId]: _, ...remainingItems } = prev;
            return remainingItems;
          });
          return remainingItems;
        }
      }

      return prevCart;
    });
  };
  const removeTotalItem = (itemId) => {
    setCart((prev) => {
      const { [itemId]: removedItem, ...remainingItems } = prev;
      setSelectedItems((prev) => {
        const { [itemId]: _, ...remainingItems } = prev;
        return remainingItems;
      });
      return remainingItems;
    });
  };
  const total = () => {
    return Object.values(cart)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };
  const totalQuantity = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.quantity,
      0
    );
  };
  const toggleConfirmation = () => {
    setConfrim((prev) => !prev);
  };
  const reset = () => {
    setConfrim(false);
    setSelectedItems({});
    setCart({});
  };
  useEffect(() => {
    const newData = res.map((item) => ({
      ...item,
      newId: uuidv4(),
    }));
    setData(newData);
  }, []);
  return (
    <div className="App">
      <div className="content">
        <h1>Desserts</h1>
        <div className="gridContainer">
          {data.map((item) => (
            <div className="gridItem" key={item.newId}>
              <div>
                <img
                  src={item.image.desktop}
                  alt="img"
                  className={`${selectedItems[item.newId] ? "border" : ""}`}
                />
                <span>
                  {cart[item.newId] ? (
                    <div className="cartStatus">
                      <button
                        onClick={() => removeFromCart(item.newId)}
                        className="minus"
                      >
                        <Minus />
                      </button>
                      <span className="quantity">
                        {cart[item.newId].quantity}
                      </span>
                      <button onClick={() => addToCart(item)} className="plus">
                        <Plus />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <button
                        className="addToCart"
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart />
                        <span> Add to Cart</span>
                      </button>
                    </div>
                  )}
                </span>
              </div>
              <h4>{item.category}</h4>
              <h2>{item.name}</h2>
              <p>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="cart">
        <div>
          <h3>Your Cart ({totalQuantity()})</h3>
          {Object.values(cart).length > 0 ? (
            <>
              {Object.values(cart).map((item) => (
                <>
                  <div key={item.newId} className="cartInfo">
                    <div>
                      <h4>{item.name}</h4>
                      <ul>
                        <li> {item.quantity}x</li>
                        <li>
                          <span>@</span> ${item.price.toFixed(2)}
                        </li>{" "}
                        <li>$ {(item.price * item.quantity).toFixed(2)}</li>
                      </ul>
                    </div>

                    <button onClick={() => removeTotalItem(item.newId)}>
                      <Remove />
                    </button>
                  </div>
                </>
              ))}
              <h6>
                Order Total <span>${total()}</span>
              </h6>
              <p>
                <Carbon /> This is a <span>carbon-neutral</span> delivery
              </p>
              <button onClick={toggleConfirmation} className="confirmBtn">
                Confirm Order
              </button>
            </>
          ) : (
            <div className="emptyCart">
              <Cake />
              <p>Your added items will appear here</p>
            </div>
          )}
        </div>
      </div>
      {confirm && (
        <>
          <div className="overlay"></div>
          <div className="confirmedOrder">
            <div>
              <Confirm />
            </div>
            <h2>Order Confirmed</h2>
            <p>We hope you enjoy your food!</p>
            <div className="orders">
              {Object.values(cart).length > 0 &&
                Object.values(cart).map((item) => (
                  <>
                    <div key={item.newId}>
                      <ul className="priceAndImg">
                        <ul>
                          <li>
                            <img src={item.image.desktop} alt="img" />
                          </li>
                          <li>
                            {item.name}{" "}
                            <div>
                              {item.quantity}x
                              <span>
                                <span>@</span> ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </li>
                        </ul>
                        <li>${(item.price * item.quantity).toFixed(2)}</li>
                      </ul>
                    </div>
                  </>
                ))}{" "}
              <div className="total">
                Order Total <span>${total()}</span>
              </div>
            </div>{" "}
            <button onClick={reset}>Start New Order</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
