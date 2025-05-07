const Patient = require('../models/Patient');

// Helper to determine medication based on blood pressure and fever
const determineMedication = (systolicBP, diastolicBP, hasFever) => {
  const meds = [];
  if (systolicBP > 140 || diastolicBP < 70 || diastolicBP > 90) meds.push('BP Control Med');
  if (hasFever) meds.push('Fever Med');
  return meds.length > 0 ? meds.join(', ') : 'No medication';
};

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      systolicbloodPressure,
      diastolicbloodPressure,
      pulseRate,
      temperature
    } = req.body;

    const hasFever = temperature > 100.4;
    const medication = determineMedication(systolicbloodPressure, diastolicbloodPressure, hasFever);

    const newPatient = new Patient({
      name,
      age,
      systolicbloodPressure,
      diastolicbloodPressure,
      pulseRate,
      temperature,
      hasFever,
      medication
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update patient vitals
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const {
      systolicbloodPressure,
      diastolicbloodPressure,
      pulseRate,
      temperature
    } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (systolicbloodPressure !== undefined) patient.systolicbloodPressure = systolicbloodPressure;
    if (diastolicbloodPressure !== undefined) patient.diastolicbloodPressure = diastolicbloodPressure;
    if (pulseRate !== undefined) patient.pulseRate = pulseRate;
    if (temperature !== undefined) {
      patient.temperature = temperature;
      patient.hasFever = temperature > 100.4;
    }

    // Update medication based on updated vitals
    patient.medication = determineMedication(
      patient.systolicbloodPressure,
      patient.diastolicbloodPressure,
      patient.hasFever
    );

    await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patients with high blood pressure (Systolic > 140)
// @route   GET /api/patients/highBP
// @access  Private
exports.getHighBP = async (req, res) => {
  try {
    const highBPpatients = await Patient.find({ systolicbloodPressure: { $gt: 140 } });
    res.json(highBPpatients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patients with low blood pressure (Diastolic < 70)
// @route   GET /api/patients/lowBP
// @access  Private
exports.getLowBP = async (req, res) => {
  try {
    const lowBPpatients = await Patient.find({ diastolicbloodPressure: { $lt: 70 } });
    res.json(lowBPpatients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all patients with fever (temperature > 100.4)
// @route   GET /api/patients/fever
// @access  Private
exports.getFeverPatients = async (req, res) => {
  try {
    const feverPatients = await Patient.find({ hasFever: true });
    res.json(feverPatients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
