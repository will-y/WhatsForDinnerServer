const express = require('express');
const meals = require('./meals');
const fs = require('fs');
const plan = require('./plan');

function createRouter() {
    const router = express.Router();

    router.get('/meals',
        meals.getMeals,
        async (req, res, next) => {
            const meals = req.mealDocuments;
            res.status(200).json({
                meals: meals
            });
        });

    router.get('/get-plan', plan.getWeekPlan,
        async (req, res, next) => {
            res.status(200).json({
               plan: req.weekPlan
            });
        });

    router.post('/meal', meals.addMeal,
        async (req, res, next) => {
            res.status(200).json({
                status: 'ok'
            });
        });

    router.post('/add-plan', plan.addMealToDay,
        async (req, res, next) => {
            res.status(200).json({
                status: 'ok'
            });
        });

    router.put('/remove-meal-from-plan', plan.removeMealFromPlan,
        async (req, res, next) => {
            res.status(200).json({
               status: 'ok'
            });
        });

    router.delete('/delete-meal', plan.deleteMeal,
        async (req, res, next) => {
            res.status(200).json({
                status: 'ok'
            });
        });

    return router;
}
module.exports = createRouter;
