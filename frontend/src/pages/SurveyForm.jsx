import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const questions = [
    {
        id: 1,
        question: "How often have you felt stressed or anxious in the past week?",
        options: ["Rarely", "Sometimes", "Often", "Almost every day"],
    },
    {
        id: 2,
        question: "How well have you been sleeping recently?",
        options: ["Very well", "Okay", "Poorly", "Hardly at all"],
    },
    {
        id: 3,
        question: "How motivated do you feel to complete daily tasks?",
        options: ["Very motivated", "Somewhat motivated", "Unmotivated", "Not sure"],
    },
    {
        id: 4,
        question: "Do you often feel supported by people around you?",
        options: ["Yes, always", "Sometimes", "Rarely", "Not at all"],
    },
    {
        id: 5,
        question: "How would you describe your current emotional state?",
        options: ["Calm", "Neutral", "Stressed", "Depressed"],
    },
];

export default function SurveyForm() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleOptionChange = (option) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: option });
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
        else setSubmitted(true);
    };

    const prevQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="max-w-md w-full text-center p-6">
                    <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-4">
                        Your responses have been recorded. We’ll use them to better
                        understand your mental health status and offer helpful insights.
                    </p>
                    <Button onClick={() => window.location.reload()} className='!bg-[#7E22CE]'>Retake Survey</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 survey-form">
            <Card className="max-w-md w-full shadow-lg p-6">
                <CardContent>
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-2 bg-[#7E22CE] rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Question {currentIndex + 1} of {questions.length}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-lg font-semibold mb-4">
                                {questions[currentIndex].question}
                            </h2>
                            <div className="space-y-3">
                                {questions[currentIndex].options.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`block border rounded-xl px-4 py-2 cursor-pointer transition ${answers[questions[currentIndex].id] === option
                                                ? "bg-[#7E22CE] text-white border-[#7E22CE]"
                                                : "border-gray-300 hover:bg-purple-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q${questions[currentIndex].id}`}
                                            value={option}
                                            checked={answers[questions[currentIndex].id] === option}
                                            onChange={() => handleOptionChange(option)}
                                            className="hidden"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={prevQuestion}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button onClick={nextQuestion} className='!bg-[#7E22CE]'>
                            {currentIndex === questions.length - 1 ? "Submit" : "Next"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
