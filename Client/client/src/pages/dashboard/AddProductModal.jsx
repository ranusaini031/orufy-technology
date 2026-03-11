import { useState, useEffect, useRef } from "react";
import axios from "axios";
const AddProductModal = ({ onClose, onProductAdded, editProduct, refreshProducts }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brandName: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        stock: "",
        exchangeEligible: false,
        images: []
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || "",
                category: editProduct.category || "",
                brandName: editProduct.brandName || "",
                description: editProduct.description || "",
                mrp: editProduct.mrp || "",
                sellingPrice: editProduct.sellingPrice || "",
                stock: editProduct.stock || "",
                exchangeEligible: editProduct.exchangeEligible || false,
                images: editProduct.images || []
            });
            setImagePreviews(editProduct.images || []);
            setImageFiles([]);
        } else {
            setFormData({
                name: "",
                category: "",
                brandName: "",
                mrp: "",
                sellingPrice: "",
                stock: "",
                exchangeEligible: false,
                images: []
            });
            setImageFiles([]);
            setImagePreviews([]);
        }
    }, [editProduct]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const totalImages = imageFiles.length + files.length;

        if (totalImages > 5) {
            alert("Maximum 5 images allowed");
            e.target.value = "";
            return;
        }

        const newFiles = [...imageFiles, ...files];
        const newPreviews = [
            ...imagePreviews,
            ...files.map(file => URL.createObjectURL(file))
        ];

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);

        e.target.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!editProduct && imageFiles.length === 0) {
            setError("Please upload at least one image");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in. Please login again.");
                setLoading(false);
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
                return;
            }

            const formDataToSend = new FormData();

            formDataToSend.append("name", formData.name);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("brandName", formData.brandName);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("mrp", Number(formData.mrp));
            formDataToSend.append("sellingPrice", Number(formData.sellingPrice));
            formDataToSend.append("stock", Number(formData.stock));
            formDataToSend.append("exchangeEligible", formData.exchangeEligible ? "true" : "false");

            const API = import.meta.env.VITE_API_URL

            imageFiles.forEach(file => {
                formDataToSend.append("images", file);
            });

            if (editProduct && imageFiles.length === 0) {
                formDataToSend.append("existingImages", JSON.stringify(formData.images));
            }
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };

            let response;

            if (editProduct) {
                response = await axios.put(
                    `${API}/api/products/${editProduct._id}`,
                    formDataToSend,
                    config
                );
            } else {
                response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/products`,
                    formDataToSend,
                    config
                );
            }
            if (response.data.success) {
                if (!editProduct) {
                    onProductAdded(response.data.product);
                } else {
                    refreshProducts();
                }
                onClose();
            } else {
                setError(response.data.error || "Operation failed");
            }

        } catch (error) {
            if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else if (error.response?.status === 400) {
                setError(error.response.data?.error || "Invalid data. Please check all fields.");
            } else if (error.response?.status === 404) {
                setError("Product not found.");
            } else if (error.response?.status === 500) {
                setError("Server error. Please try again later.");
            } else if (error.response) {
                setError(error.response.data?.error ||
                    error.response.data?.message ||
                    `Error: ${error.response.status}`);
            } else if (error.request) {
                setError("No response from server. Check if backend is running on port 5000.");
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const removeImage = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        URL.revokeObjectURL(newPreviews[index]);
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };
    return (
        <div className="modal-overlay">
            <div className="product-modal">
                <div className="modal-header">
                    <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="food">Food</option>
                                <option value="furniture">Furniture</option>
                                <option value="fashion">Fashion</option>
                                <option value="home">Home & Kitchen</option>
                                <option value="beauty">Beauty</option>
                                <option value="sports">Sports</option>
                                <option value="books">Books</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Enter stock quantity"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>MRP (₹) *</label>
                            <input
                                type="number"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter MRP"
                            />
                        </div>

                        <div className="form-group">
                            <label>Selling Price *</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter selling price"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="upload-title">
                            <h5 >Upload Product Images</h5>
                            <h5
                                style={{ cursor: "pointer", color: "#2563eb" }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                Add More Photos
                            </h5>
                        </div>

                        <div className="upload-box">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                                className="description-input"
                            />

                            <span
                                className="browse-text"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Browser
                            </span>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                            <div className="image-previews">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="preview-item">
                                        <div className="product-img-container"  >
                                            <img src={preview} alt={`Preview ${index + 1}`} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-image"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <small className="upload-note">Upload up to 5 images. Max 5MB per image.</small>
                        <div className="form-group checkbox-group">
                            <label>
                                Exchange or return eligibility
                            </label>
                            <select
                                name="exchangeEligible"
                                value={formData.exchangeEligible ? "yes" : "no"}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        exchangeEligible: e.target.value === "yes",
                                    }))
                                }
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>

                        </div>

                        {editProduct && formData.images?.length > 0 && imageFiles.length === 0 && (
                            <div className="existing-images">
                                <p>Existing Images:</p>
                                <div className="image-previews">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="preview-item existing">
                                            <img src={img} alt={`Existing ${index + 1}`} />
                                            <span className="existing-badge">Existing</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="info-text">
                                    To change images, upload new images above.
                                </p>
                            </div>
                        )}
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : editProduct ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;