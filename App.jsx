export default function App() {
  return (
    <div>
      <h1>Hello from React Component!</h1>
    </div>
  );
}









import { useState } from "react";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);

  const menuData = [
    { id: 1, name: "Margherita Pizza", price: 299, img: "images/margherita.jpg" },
    { id: 2, name: "Farmhouse Pizza", price: 349, img: "images/farmhouse.jpg" },
    { id: 3, name: "Chicken Pizza", price: 399, img: "images/chicken-pizza.jpg" },
    { id: 4, name: "Classic Burger", price: 159, img: "images/burger.jpg" },
    { id: 5, name: "Chicken Burger", price: 199, img: "images/chicken-burger.jpg" },
    { id: 6, name: "Veg Sandwich", price: 119, img: "images/sandwich.jpg" },
    { id: 7, name: "Chicken Sandwich", price: 149, img: "images/chicken-sandwich.jpg" },
    { id: 8, name: "White Sauce Pasta", price: 249, img: "images/white-pasta.jpg" },
    { id: 9, name: "Red Sauce Pasta", price: 239, img: "images/red-pasta.jpg" },
    { id: 10, name: "Chicken Roll", price: 149, img: "images/chicken-roll.jpg" },
    { id: 11, name: "Veg Roll", price: 119, img: "images/veg-roll.jpg" },
    { id: 12, name: "French Fries", price: 99, img: "images/fries.jpg" }
  ];

  function addToCart(item) {
    setCart([...cart, item]);
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="logo">R</div>
          <div className="brand-text">
            <strong>Rasa Bites</strong>
            <small>Fresh • Fast • Flavorful</small>
          </div>
        </div>

        <div className="search">
          <input placeholder="Search items..." />
        </div>

        <div className="controls">
          <div className="cart-icon">
            🛒 Cart ({cart.length})
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="main">
        <section className="menu-section">
          <h2>Menu</h2>

          <div className="menu-grid">
            {menuData.map((item) => (
              <div className="menu-card" key={item.id}>
                <img src={item.img} alt={item.name} />
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>

        {/* CART */}
        <aside className="cart-box">
          <h3>Your Cart</h3>
          {cart.length === 0 && <p>No items added.</p>}

          {cart.map((c, i) => (
            <div className="cart-item" key={i}>
              {c.name} – ₹{c.price}
            </div>
          ))}

          <hr />

          <strong>
            Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
          </strong>
        </aside>
      </main>
    </div>
  );
}
