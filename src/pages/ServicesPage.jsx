import { useState, useEffect } from "react"
import CartPage from "./CartPage"
import CheckoutPage from "./CheckoutPage"

/* ✅ FIXED CART (persistent) */
function useCartPersist() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === med.name)
      if (existing) {
        return prev.map(i =>
          i.name === med.name ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...med, qty: 1 }]
    })
  }

  const removeFromCart = (name) =>
    setCart(prev => prev.filter(i => i.name !== name))

  const updateQty = (name, delta) => {
    setCart(prev =>
      prev
        .map(i =>
          i.name === name
            ? { ...i, qty: Math.max(1, i.qty + delta) }
            : i
        )
        .filter(i => i.qty > 0)
    )
  }

  const clearCart = () => setCart([])

  return { cart, addToCart, removeFromCart, updateQty, clearCart }
}

export default function ServicesPage() {
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setCheckout] = useState(false)
  const [toast, setToast] = useState(null)

  /* ✅ USING FIXED CART */
  const { cart, addToCart, removeFromCart, updateQty, clearCart } = useCartPersist()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleAddToCart = (med) => {
    addToCart(med)
    showToast(`🛒 ${med.name} added`)
  }

  return (
    <div style={{ padding: "24px 20px", background: "#f5f7f6", minHeight: "100%" }}>

      {/* 🔥 HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, color: "#1f2937", fontFamily: "'Nunito', sans-serif", fontSize: 24 }}>Services</h2>

        {/* ✅ CART BUTTON */}
        <button
          onClick={() => setShowCart(true)}
          style={{
            background: "#16805c",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 800
          }}
        >
          🛒 {cart.reduce((s, i) => s + i.qty, 0)}
        </button>
      </div>

      {/* 🔹 DEMO MEDICINES */}
      <div style={{ marginTop: 20, maxWidth: 720 }}>
        {[
          { name: "Paracetamol", price: 25 },
          { name: "Ibuprofen", price: 35 },
        ].map((med) => (
          <div key={med.name} style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            background: "#fff",
            color: "#1f2937"
          }}>
            <span>{med.name}</span>
            <button onClick={() => handleAddToCart(med)} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "8px 14px", cursor: "pointer", fontWeight: 700 }}>
              Add
            </button>
          </div>
        ))}
      </div>

      {/* 🛒 CART */}
      {showCart && (
        <CartPage
          cart={cart}
          removeFromCart={removeFromCart}
          updateQty={updateQty}
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false)
            setCheckout(true)
          }}
        />
      )}

      {/* 💳 CHECKOUT */}
      {showCheckout && (
        <CheckoutPage
          cart={cart}
          onClose={() => setCheckout(false)}
          onSuccess={() => {
            clearCart()
            setCheckout(false)
          }}
        />
      )}

      {/* 🔔 TOAST */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1f2937",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 4
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
