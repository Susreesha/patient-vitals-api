// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getHighBP,
  getLowBP,
  getFeverPatients
} = require('../controllers/patientController');

const auth = require('../middleware/authMiddleware');

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid patient ID format' });
  }
  next();
};

// Apply JWT authentication middleware to all routes
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient vitals management
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of patients
 */
router.get('/', getAllPatients);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - systolicbloodPressure
 *               - diastolicbloodPressure
 *               - pulseRate
 *               - temperature
 *               - hasFever
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               systolicbloodPressure:
 *                 type: number
 *               diastolicbloodPressure:
 *                 type: number
 *               heartRate:
 *                 type: number
 *               temperature:
 *                 type: number
 *               hasFever:
 *                 type: Boolean
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post('/', createPatient);

/**
 * @swagger
 * /patients/highBP:
 *   get:
 *     summary: Get patients with high blood pressure (BP > 140)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of high BP patients
 */
router.get('/highBP', getHighBP);

/**
 * @swagger
 * /patients/lowBP:
 *   get:
 *     summary: Get patients with low blood pressure (BP < 70)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low BP patients
 */
router.get('/lowBP', getLowBP);

/**
 * @swagger
 * /patients/hasFever:
 *   get:
 *     summary: Get patients who have fever (temperature > 100.4°F)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients with fever
 */
router.get('/hasFever', getFeverPatients);


/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient data retrieved
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Patient not found
 */
router.get('/:id', validateObjectId, getPatientById);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient vitals
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               systolicbloodPressure:
 *                 type: number
 *               diastolicbloodPressure:
 *                 type: number
 *               heartRate:
 *                 type: number
 *               temperature:
 *                 type: number
 *               hasFever:
 *                 type: Boolean
 *     responses:
 *       200:
 *         description: Patient updated
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Patient not found
 */
router.put('/:id', validateObjectId, updatePatient);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Patient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Patient not found
 */
router.delete('/:id', validateObjectId, deletePatient);

module.exports = router;
