const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Attendee = require('./models/Attendee')
const Student = require('./models/Student')

// Endpoint to mark attendees
router.post('/mark_attendees', async (req, res) => {
    const attendees = req.body; // The incoming dictionary from the Python request

    try {
        // Iterate over each entry in the incoming data
        for (const [matric_num, details] of Object.entries(attendees)) { 
            const [_, name, timestamp] = details.split(',');

            // Create a new attendee document
            const attendee = new Attendee({
                matric_no: matric_num,
                name: name.trim(),
                timestamp: timestamp.trim()
            });

            // Save the document to the database
            await attendee.save()
            res.status(200).send()
        }
    } catch (error) {
        console.error('Error inserting attendees:', error);
        res.status(500).json({ message: 'Failed to save attendees' });
    }
});

// Endpoint to register a student
router.post('/register', async (req, res) => {
    const {matric_num, name} = req.body; // The incoming dictionary from the Python request

    try {
        // Create a new attendee document
        const student = new Student({
            matric_no: matric_num,
            name: name.trim(),
        });

        // Save the document to the database
        await student.save()
        res.status(200).send()
    } catch (error) {
        console.error('Error inserting student:', error);
        res.status(500).json({ message: 'Failed to save student' });
    }
});

// GET all students
router.get('/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Failed to fetch students' });
    }
  });

  // GET all attendees
router.get('/attendees', async (req, res) => {
    try {
      const attendees = await Attendee.find();
      res.status(200).json(attendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      res.status(500).json({ message: 'Failed to fetch attendees' });
    }
  });


module.exports = router