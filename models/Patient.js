// models/Patient.js

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  systolicbloodPressure: { type: Number, required: true },
  diastolicbloodPressure: { type: Number, required: true },
  pulseRate: { type: Number, required: true },
  temperature: { type: Number, required: true },
  hasFever: {type: Boolean,default: false},
  medication: { type: String, default: "No medication" }  // Determined by logic
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
