const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: false },
    count: { type: Number, required: false },
    lastUsed: { type: Date, required: false },
    category: { type: String, required: true}
});

const Meal = mongoose.model('meals', MealSchema);

function getMeals(req, res, next) {
    Meal.find({}, (err, meals) => {
        if (err || !meals) {
            res.status('400').json({status: 'meals-missing'});
        }
        req.mealDocuments = meals;
        next();
    });
}

function addMeal(req, res) {
    Meal.create(req.body, (err) => {
        if (err) {
            res.status('400').json({status: 'failed-add'});
        }
    });
}

module.exports = { MealSchema, Meal, getMeals, addMeal };
