const mongoose = require('mongoose');
const meals = require('./meals');

const PlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    meals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "meals"
    }]
});

const Plan = mongoose.model('plans', PlanSchema);

function getWeekPlan(req, res, next) {
    let day = parseInt(req.query.day);
    let month = parseInt(req.query.month);
    let year = parseInt(req.query.year);

    let queries = [];
    let results = [];

    for (let i = 0; i < 7; i++) {
        queries.push(Plan.findOne({day: day + i, month: month, year: year}).populate('meals'));
    }

    Promise.all(queries).then(([day1, day2, day3, day4, day5, day6, day7]) => {
        if (day1) {
            results.push(day1);
        } else {
            results.push({})
        }
        if (day2) {
            results.push(day2);
        } else {
            results.push({})
        }
        if (day3) {
            results.push(day3);
        } else {
            results.push({})
        }
        if (day4) {
            results.push(day4);
        } else {
            results.push({})
        }
        if (day5) {
            results.push(day5);
        } else {
            results.push({})
        }
        if (day6) {
            results.push(day6);
        } else {
            results.push({})
        }
        if (day7) {
            results.push(day7);
        } else {
            results.push({})
        }
        req.weekPlan = results;
        next();
    });
}

function addMealToDay(req, res, next) {
    let day = parseInt(req.query.day);
    let month = parseInt(req.query.month);
    let year = parseInt(req.query.year);

    let query = {
        name: req.body.name,
        link: req.body.link,
        category: req.body.category
    };

    meals.Meal.findOne(query, (err, result) => {
        if (err) {
            res.status('400').json({status: 'failed-add-meal'});
        } else if (result) {
            addPlan(result, day, month, year, res);
        } else {
            meals.Meal.create(req.body, (err2, meal) => {
                if (err2) {
                    res.status('400').json({status: 'meals-create-failed'});
                } else {
                    addPlan(meal, day, month, year, res);
                }
            });
        }

        next();
    });
}

function addPlan(meal, day, month, year, res) {
    Plan.findOne({day: day, month: month, year: year}, (err, result) => {
        if (err) {
            res.status('400').json({status: 'failed-add-meal'});
        } else if (result) {
            result.meals.addToSet(meal);
            result.save();
        } else {
            Plan.create({day: day, month: month, year: year, meals: [meal]}, (err) => {
                if (err) {
                    res.status('400').json({status: 'failed-add-meal-create'});
                }
            });
        }
    });
}

function removeMealFromPlan(req, res, next) {
    let day = parseInt(req.query.day);
    let month = parseInt(req.query.month);
    let year = parseInt(req.query.year);
    let meal = req.query.meal;

    removePlan(day, month, year, meal, res);
}

function removePlan(day, month, year, mealId, res) {
    Plan.updateOne({day: day, month: month, year: year}, {$pull: {meals: mealId}}, err => {
        if (err) {
            res.status('400').json({status: 'failed-add-meal'});
        }
    });
}

function deleteMeal(req, res, next) {
    let mealId = req.query.meal;

    console.log(mealId);

    Plan.updateMany({}, {$pull: {meals: mealId}}, err => {
        if (err) {
            console.log(err);
            res.status('400').json({status: 'failed-delete-meals'});
        } else {
            meals.Meal.deleteOne({_id: mealId}, err => {
                if (err) {
                    console.log(err)
                    res.status('400').json({status: 'failed-delete-meals'});
                }
            });
        }
    });
}

module.exports = { PlanSchema, Plan, getWeekPlan, addMealToDay, removeMealFromPlan, deleteMeal };
