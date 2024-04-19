const Quiz = require('../models/Quiz');

// Function to create a new quiz
exports.createQuiz = async (req, res, next) => {
    try {
        const { question, options, rightAnswer, startDate, endDate } = req.body;
        const quiz = new Quiz({
            question,
            options,
            rightAnswer,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        await quiz.save();
        res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (error) {
        next(error);
    }
};

// Function to get the currently active quiz
exports.getActiveQuiz = async (req, res, next) => {
    try {
        const now = new Date();
        const activeQuiz = await Quiz.findOne({ startDate: { $lte: now }, endDate: { $gte: now } });
        if (activeQuiz) {
            res.json({ quiz: activeQuiz, status: 'Active' });
        } else {
            res.status(404).json({ message: 'No active quiz found' });
        }
    } catch (error) {
        next(error);
    }
};

// Function to get the result of a quiz by ID
exports.getQuizResult = async (req, res, next) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const now = new Date();
        const fiveMinutesAfterEnd = new Date(quiz.endDate.getTime() + 5 * 60000);
        if (now < fiveMinutesAfterEnd) {
            return res.status(400).json({ message: 'Quiz result is not available yet' });
        }
        res.json({ correctAnswer: quiz.options[quiz.rightAnswer], additionalInfo: 'Any additional information' });
    } catch (error) {
        next(error);
    }
};

// Function to get all quizzes
exports.getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find();
        res.json({ quizzes });
    } catch (error) {
        next(error);
    }
};
