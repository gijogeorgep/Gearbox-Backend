const { Product } = require("../models/product.model");

const UploadProduct = async (req, res) => {
  try {
    const item = ({
      itemType,
      name,
      brand,
      description,
      detailedDescription,
      imageUrl,
      smallImages,
      location,
      rate,
      cautionDeposit,
      tutorialLink,
      email,
      sellername,
      sellerPhone,
    } = req.body);

    console.log(item);

    const newProduct = await Product.create({
      itemType,
      brand,
      name,
      description,
      detailedDescription,
      imageUrl,
      smallImages,
      location,
      rate,
      cautionDeposit,
      tutorialLink,
      email,
      sellername,
      sellerPhone,
    });

    res
      .status(201)
      .json({ msg: "Item list uploaded successfully", newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ msg: "Items fetched", products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching product with _id:", id);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Updating product with ID:", productId);
    console.log("Request body:", req.body);

    const {
      email,
      itemType,
      brand,
      name,
      description,
      detailedDescription,
      imageUrl,
      smallImages,
      rate,
      location,
      cautionDeposit,
      tutorialLink,
    } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({ msg: "Main image is required" });
    }
    if (
      !itemType ||
      !name ||
      !description ||
      !location ||
      !rate ||
      !cautionDeposit
    ) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check user authorization (commented out for now - adjust based on your auth setup)
    // if (product.email !== req.user.email || email !== req.user.email) {
    //   return res
    //     .status(403)
    //     .json({ msg: "Not authorized to update this product" });
    // }

    // Update product fields
    product.email = email;
    product.itemType = itemType;
    product.brand = brand;
    product.name = name;
    product.description = description;
    product.detailedDescription =
      detailedDescription?.filter((point) => point.trim() !== "") || [];
    product.imageUrl = imageUrl;
    product.smallImages = smallImages?.filter(Boolean) || [];
    product.rate = rate;
    product.location = location;
    product.cautionDeposit = cautionDeposit;
    product.tutorialLink = tutorialLink || "";

    // Save updated product
    const updatedProduct = await product.save();
    console.log("Product updated successfully:", updatedProduct._id);

    return res.status(200).json({
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const email = req.seller.email;
    const sellername = req.seller.name;
    const sellerphone = req.seller.phone;
    console.log(sellerphone);

    // console.log("email is :" + email);

    const products = await Product.find({ email: email });
    const nameofSeller = await Product.find({ sellername: sellername });
    console.log(products);
    console.log(nameofSeller);

    return res.json({ products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
};

const getProductItemTypes = async (req, res) => {
  try {
    const itemtypes = await Product.aggregate([
      {
        $match: {
          itemType: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$itemType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({ itemtypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSellersWithProductsforAdmin = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $lookup: {
          from: "sellers",
          localField: "email",
          foreignField: "email",
          as: "sellerDetails",
        },
      },
      {
        $unwind: "$sellerDetails",
      },
      {
        $group: {
          _id: "$sellerDetails._id",
          sellerUsername: { $first: "$sellerDetails.username" },
          sellerEmail: { $first: "$sellerDetails.email" },
          sellerPhone: { $first: "$sellerDetails.phone" },
          products: {
            $push: {
              productName: "$name",
              itemType: "$itemType",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sellerId: "$_id",
          sellerUsername: 1,
          sellerEmail: 1,
          sellerPhone: 1,
          products: 1,
        },
      },
    ]);

    res.status(200).json({
      sellers: result,
    });
  } catch (error) {
    console.error("Error fetching sellers with products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  UploadProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  getSellerProducts,
  getProductsCount,
  getProductItemTypes,
  getSellersWithProductsforAdmin,
};
