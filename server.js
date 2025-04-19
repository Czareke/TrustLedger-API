    require("dotenv").config();
    const mongoose = require("mongoose");
    const app = require("./app");

    // Database connection
    mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/webnovel")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
