const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/categories_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// Category Schema & Model
const Category = mongoose.model('Category', new mongoose.Schema({ name: { type: String, required: true } }));

// Routes
const router = express.Router();

router.route('/categories')
    .post(async (req, res) => {
        try {
            const category = await new Category(req.body).save();
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .get(async (_, res) => {
        try {
            res.json(await Category.find());
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/categories/:id')
    .get(async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            category ? res.json(category) : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .put(async (req, res) => {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            updatedCategory ? res.json(updatedCategory) : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            deletedCategory ? res.json({ message: 'Category deleted' }) : res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

app.use('/api', router);

// Server Initialization
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//http://localhost:5000/api/categories