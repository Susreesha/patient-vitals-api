const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');

dotenv.config();

// ✅ Check for required env variables
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  throw new Error('Missing required environment variables in .env');
}

// ✅ Connect to MongoDB
connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON

// ✅ Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Vitals API',
      version: '1.0.0',
      description: 'API documentation for Patient Vitals Management System',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/**/*.js'], // Include all route files, even nested
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Swagger UI route

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
