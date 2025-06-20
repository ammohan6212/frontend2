import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';

function SellerHome() {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState(null);
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const storedSellerName = localStorage.getItem("seller_name");
    const token = localStorage.getItem("seller_token");

    if (!storedSellerName || !token) {
      navigate('/seller-login');
    } else {
      setSellerName(storedSellerName);
    }
  }, [navigate]);

  const categories = [
    "Men's Clothing", "Women's Clothing", "Kid's & Baby Clothing", "Shoes & Footwear",
    "Jewelry & Watches", "Handbags & Accessories", "Lingerie & Sleepwear",
    "Computers & Laptops", "Smartphones & Tablets", "TV, Video & Audio",
    "Cameras & Photography", "Video Games & Consoles", "Wearable Technology",
    "Drones & Accessories", "Electronic Accessories", "Home & Kitchen", "Furniture & Decor",
    "Bed & Bath", "Garden & Outdoor", "Home Improvement & Tools", "Appliances",
    "Lighting & Ceiling Fans", "Skincare & Makeup", "Hair Care & Styling", "Fragrances",
    "Health Care & Supplements", "Personal Care & Wellness", "Shaving & Hair Removal",
    "Books & Literature", "eBooks & Audiobooks", "Movies & TV Shows", "Music, Vinyl & CDs",
    "Textbooks", "Athletic Apparel", "Exercise & Fitness", "Outdoor Recreation", "Team Sports",
    "Fan Shop & Memorabilia", "Cycling", "Camping & Hiking", "Action Figures & Statues",
    "Board Games & Puzzles", "Dolls & Accessories", "Building Toys (e.g., LEGO)",
    "Educational Toys", "Video Games", "Car Parts & Accessories", "Motorcycle & Powersports",
    "Tools & Equipment", "Tires & Wheels", "Industrial Supplies", "Pantry Staples",
    "Snacks & Sweets", "Coffee, Tea & Beverages", "Gourmet & Specialty Foods",
    "Organic Products", "Art & Wall Decor", "Crafting & Sewing", "Collectibles & Memorabilia",
    "Antiques", "Dog Supplies", "Cat Supplies", "Fish & Aquatic Pets", "Bird Supplies",
    "Small Animal Supplies", "Office & School Supplies", "Luggage & Travel Gear",
    "Musical Instruments", "Software", "Gift Cards"
  ];

  const categoryOptions = categories.map(cat => ({ label: cat, value: cat }));

  const handleLogout = () => {
    localStorage.removeItem("seller_token");
    localStorage.removeItem("seller_name");
    navigate('/seller-login');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!productCategory) {
      alert("Please select a product category.");
      return;
    }

    const formData = new FormData();
    formData.append("sellerName", sellerName);
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productPrice);
    formData.append("category", productCategory.value);
    formData.append("quantity", productQuantity);
    formData.append("image", productImage);

    try {
      const response = await fetch("/product/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product uploaded successfully!");
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductCategory(null);
        setProductQuantity("");
        setProductImage(null);
      } else {
        alert("Failed to upload product.");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("An error occurred while uploading the product.");
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setProductImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ color: "#2c3e50" }}>Welcome, {sellerName}</h2>
        <div>
          <button onClick={() => navigate('/seller-dashboard')} style={styles.headerButton}>
            Dashboard
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.title}>Upload New Product</h3>
        <form onSubmit={handleProductSubmit} style={styles.form}>
          <div style={styles.formItem}>
            <label style={styles.label}>Seller</label>
            <div style={styles.readOnlyText}>{sellerName}</div>
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Price ($)</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Category</label>
            <Select
              options={categoryOptions}
              value={productCategory}
              onChange={setProductCategory}
              placeholder="Select..."
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "6px",
                  fontSize: "14px",
                }),
              }}
            />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              required
              style={styles.input}
              min="1"
            />
          </div>

          <div style={styles.formItem}>
            <label style={styles.label}>Image</label>
            <div
              {...getRootProps()}
              style={{
                ...styles.dropzone,
                borderColor: isDragActive ? '#00b894' : '#ccc',
                backgroundColor: isDragActive ? '#e0f7fa' : '#fafafa',
              }}
            >
              <input {...getInputProps()} />
              {productImage ? (
                <p><strong>Selected:</strong> {productImage.name}</p>
              ) : isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag 'n' drop image here, or click to select</p>
              )}
            </div>
          </div>

          <div style={styles.formItem}>
            <button type="submit" style={styles.submitButton}>Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #f1f1f1",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(to right, #e0f7fa, #f8f9fa)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    boxSizing: "border-box",
  },
  header: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerButton: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    padding: "10px 16px",
    marginRight: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    marginBottom: "40px",
  },
  title: {
    marginBottom: "25px",
    color: "#2c3e50",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formItem: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontWeight: "bold",
    marginBottom: "4px",
    fontSize: "14px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px"
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "80px"
  },
  submitButton: {
    backgroundColor: "#00b894",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  readOnlyText: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    fontSize: "15px"
  },
  dropzone: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555"
  }
};

export default SellerHome;
