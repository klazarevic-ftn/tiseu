const app = require("./app");
const { connectDB } = require('./config/mongo');

// const PORT = process.env.PORT || 8010;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });

const startServer = async () => {
  try {
    await connectDB(); 
    const PORT = process.env.PORT || 8010;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();  