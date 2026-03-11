import { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineShoppingBag } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import Logout from "../../components/common/Logout";
import EmptyIcon from "../../components/common/EmptyIcon";

const Products = ({ status }) => {
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); 
    const API = import.meta.env.VITE_API_URL
    const isMainProductsPage = !status && location.pathname === "/dashboard/products";

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API}/api/products`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const productsData = res.data?.data?.products || [];
            const filteredProducts = status
                ? productsData.filter((p) =>
                    status === "published" ? p.isPublished : !p.isPublished
                )
                : productsData;
            setProducts(filteredProducts);

        } catch (error) {
            setProducts([]);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [status]);

    const handleProductAdded = async (newProduct) => {
        await fetchProducts();
        setOpenModal(false);
    };

    const handleEditClick = (product) => {
        setEditProduct(product);
        setOpenModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${API}/api/products/${deleteProduct._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setProducts((prev) =>
                prev.filter((p) => p._id !== deleteProduct._id)
            );

            setShowDeleteModal(false);
            setDeleteProduct(null);
        } catch (error) {
            alert("Delete failed ");
        }
    };

    const toggleStatus = async (id, publish) => {
        try {
            await axios.patch(
                `${API}/api/products/${id}/status`,
                { status: publish },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setProducts(prev => prev.map(product =>
                product._id === id
                    ? { ...product, isPublished: publish }
                    : product
            ));
        } catch (error) {
            alert("Status update failed");
        }
    };
    
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading products...</p>
            </div>
        );
    }
    
    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Header sirf main products page pe dikhe */}
            {isMainProductsPage && (
                <header className="products-header-1">
                    <ul
                        onClick={() => navigate("/dashboard/products")}
                        className="home-logo-container">
                        <MdOutlineShoppingBag />
                        <li id="home-text"  >
                            Products
                        </li>
                    </ul>
                    <div className="product-search-container" >
                        <ul className="all-product-search">
                            <GoSearch />
                            <input type="text"
                                placeholder="Search Services, Products"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </ul>
                        <Logout />
                    </div>
                </header >
            )}

            <section className="product-section">
                <div className="products-page">
                    <div className="products-header-2">
                        <h2>
                            {status === "published" ? "Published Products" : 
                             status === "unpublished" ? "Unpublished Products" : 
                             "All Products"}
                        </h2>

                        <div className="debug" style={{
                            fontSize: '14px'
                        }}>
                            <strong>Total Products : </strong>  {products.length} 
                        </div>
                        
                        {/* "+ Add Products" button sirf tab dikhe jab:
                            1. Main products page ho (isMainProductsPage = true)
                            2. Aur products.length > 0 ho */}
                        {isMainProductsPage && products.length > 0 && (
                            <button
                                className="add-btn"
                                onClick={() => {
                                    setEditProduct(null);
                                    setOpenModal(true);
                                }}
                            >
                                + Add Products
                            </button>
                        )}
                    </div>
                    
                    {products.length === 0 ? (
                        <div className="empty-products">
                            <div className="empty-box">
                                <EmptyIcon />
                                <h3>Feels a little empty over here...</h3>
                                <p>
                                    {status === "published" ? "No published products" :
                                        status === "unpublished" ? "No unpublished products" :
                                            "You can create products without connecting store you can add products to store anytime"}
                                </p>
                                
                                {/* "Add your First Product" button sirf main products page pe dikhe */}
                                {isMainProductsPage && (
                                    <button
                                        className="empty-add-btn"
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Add your First Product
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map((item) => (
                                <div className="product-card" key={item._id || Math.random()}>
                                    <div className="product-card-img">
                                        <img
                                            src={item.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                                            alt={item.name}
                                            className="product-img"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                                            }}
                                        />
                                    </div>
                                    <div className="product-details">
                                        <h4>{item.name || "Unnamed Product"}</h4>
                                        <p><strong>Category-</strong> {item.category || "N/A"}</p>
                                        <p><strong>Stock-</strong> {item.stock || 0}</p>
                                        <p><strong>MRP-</strong> ₹{item.mrp || 0}</p>
                                        <p><strong>Selling Price-</strong> ₹{item.sellingPrice || 0}</p>
                                        <p><strong>Brand-</strong> {item.brandName || "N/A"}</p>
                                        <p><strong>Images-</strong> {(item.images || []).length}</p>
                                        <p><strong>Exchange-</strong> {item.exchangeEligible ? " Eligible" : " Not Eligible"}</p>
                                        <p><strong>Description-</strong> {item.description || "No description"}</p>
                                        <p>
                                            <strong>Status-</strong>
                                            <span className={`status-badge ${item.isPublished ? 'published' : 'unpublished'}`}>
                                                {item.isPublished ? "Published" : "Unpublished"}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="card-actions">
                                        {item.isPublished ? (
                                            <button
                                                className="unpublish-btn"
                                                onClick={() => toggleStatus(item._id, false)}
                                            >
                                                Unpublish
                                            </button>
                                        ) : (
                                            <button
                                                className="publish-btn"
                                                onClick={() => toggleStatus(item._id, true)}
                                            >
                                                Publish
                                            </button>
                                        )}

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditClick(item)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                setDeleteProduct(item);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <span><RiDeleteBin5Line /></span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {openModal && (
                        <AddProductModal
                            onClose={() => {
                                setOpenModal(false);
                                setEditProduct(null);
                            }}
                            onProductAdded={handleProductAdded}
                            editProduct={editProduct}
                            refreshProducts={fetchProducts}
                        />
                    )}
                    {showDeleteModal && deleteProduct && (
                        <div className="modal-overlay">
                            <div className="delete-modal">
                                <div className="modal-header">
                                    <h3>Delete Product</h3>
                                    <button onClick={() => setShowDeleteModal(false)}>✕</button>
                                </div>

                                <p>
                                    Are you sure you want to delete
                                    <strong> "{deleteProduct.name}" </strong>?
                                    This action cannot be undone.
                                </p>

                                <div className="delete-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="confirm-delete-btn"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Products;