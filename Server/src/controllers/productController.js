import Product from "../models/Product.js";
const getAllProducts = async (req, res) => {
  try {
    const { isPublished, category, search } = req.query;

    const filter = { user: req.user._id };

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { products }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
      details: error.message
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
      details: error.message
    });
  }
};

const createProduct = async (req, res) => {
  
  try {
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name: req.body.name,
      mrp: parseFloat(req.body.mrp),
      sellingPrice: parseFloat(req.body.sellingPrice),
      brandName: req.body.brandName,
      description: req.body.description || "",
      category: req.body.category || "other",
      images: imageUrls,
      stock: parseInt(req.body.stock) || 0,
      exchangeEligible: req.body.exchangeEligible === "true",
      user: req.user._id,
      isPublished: false
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product }
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
      details: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = parseFloat(req.body.price);
    if (req.body.brandName) product.brandName = req.body.brandName;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.stock !== undefined) product.stock = parseInt(req.body.stock);
    if (req.body.exchangeEligible !== undefined) {
      product.exchangeEligible = req.body.exchangeEligible === "true";
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product }
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
      details: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
      details: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Status must be true (published) or false (unpublished)"
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id 
      },
      { isPublished: status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    const message = status ? "Product published successfully" : "Product unpublished successfully";

    res.status(200).json({
      success: true,
      message,
      data: { product }
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update status",
      details: error.message
    });
  }
};

const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ user: req.user._id });
    const publishedProducts = await Product.countDocuments({
      user: req.user._id,
      isPublished: true
    });
    const unpublishedProducts = await Product.countDocuments({
      user: req.user._id,
      isPublished: false
    });

    const categoryStats = await Product.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        published: publishedProducts, 
        unpublished: unpublishedProducts,
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get product statistics",
      details: error.message
    });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatus,
  getProductStats
};