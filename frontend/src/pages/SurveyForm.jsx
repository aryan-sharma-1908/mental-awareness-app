import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const questions_PHQ_9_Depression_screening = [
    { id: 1, question: "Little interest or pleasure in doing things", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 2, question: "Feeling down, depressed, or hopeless", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 3, question: "Trouble falling or staying asleep, or sleeping too much", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 4, question: "Feeling tired or having little energy", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 5, question: "Poor appetite or overeating", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 6, question: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 7, question: "Trouble concentrating on things, such as reading the newspaper or watching television", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 8, question: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 9, question: "Thoughts that you would be better off dead or of hurting yourself in some way", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
];
const questions_GAD_7_Generalized_Anxiety_Disorder_7 = [
    { id: 1, question: "Feeling nervous, anxious, or on edge", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 2, question: "Not being able to stop or control worrying", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 3, question: "Worrying too much about different things", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 4, question: "Trouble relaxing", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 5, question: "Being so restless that it is hard to sit still", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 6, question: "Becoming easily annoyed or irritable", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
    { id: 7, question: "Feeling afraid as if something awful might happen", options: ["Not at all", "Several days", "More than half the days", "Almost every day"] },
];

const questions_WHO_5_Well_Being_Index = [
    {id : 1, question: "I have felt cheerful and in good spirits", options: ["At no time","Some of the time","Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]},
    {id : 2, question: "I have felt calm and relaxed", options: ["At no time","Some of the time","Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]},
    {id : 3, question: "I have felt active and vigorous", options: ["At no time","Some of the time","Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]},
    {id : 4, question: "I woke up feeling fresh and rested", options: ["At no time","Some of the time","Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]},
    {id : 5, question: "My daily life has been filled with things that interest me", options: ["At no time","Some of the time","Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]},

]

export default function SurveyForm() {
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // use the three explicit question sets (PHQ-9, GAD-7, WHO-5)
    const sections = [
        { title: "PHQ-9 (Depression)", items: questions_PHQ_9_Depression_screening.map((q) => ({ ...q, uid: `phq-${q.id}` })) },
        { title: "GAD-7 (Anxiety)", items: questions_GAD_7_Generalized_Anxiety_Disorder_7.map((q) => ({ ...q, uid: `gad-${q.id}` })) },
        { title: "WHO-5 (Well-being)", items: questions_WHO_5_Well_Being_Index.map((q) => ({ ...q, uid: `who-${q.id}` })) },
    ];

    const [sectionsCompleted, setSectionsCompleted] = useState(() => new Array(sections.length).fill(false));

    const handleOptionChange = (uid, option) => {
        setAnswers((s) => ({ ...s, [uid]: option }));
    };

    useEffect(() => {
        // reset slide when section changes
        setCurrentSlide(0);
    }, [currentSection]);

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide((s) => s - 1);
    };

    const nextSlide = () => {
        const len = sections[currentSection].items.length;
        if (currentSlide < len - 1) setCurrentSlide((s) => s + 1);
    };

    const isSectionComplete = (index) => {
        return sections[index].items.every((q) => answers[q.uid]);
    };

    const submitSection = () => {
        if (!isSectionComplete(currentSection)) return;
        const updated = [...sectionsCompleted];
        updated[currentSection] = true;
        setSectionsCompleted(updated);
        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            setSubmitted(true);
            // TODO: send `answers` to backend
        }
    };

    const prevSection = () => {
        if (currentSection > 0) setCurrentSection(currentSection - 1);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="max-w-md w-full text-center p-6">
                    <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-4">Your responses have been recorded.</p>
                    <Button onClick={() => window.location.reload()} className="!bg-[#7E22CE]">Retake Survey</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6 survey-form">
            <div className="max-w-4xl w-full flex gap-6">
                {/* Left: Section progress */}
                <div className="w-48 flex flex-col items-start">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">Survey Progress</h3>
                    <div className="space-y-4">
                        {sections.map((s, idx) => {
                            const active = idx === currentSection;
                            const done = sectionsCompleted[idx];
                            return (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${done ? "bg-[#7E22CE] text-white" : active ? "border-2 border-[#7E22CE] text-[#7E22CE]" : "border bg-white text-gray-600"}`}>
                                        {done ? "✓" : idx + 1}
                                    </div>
                                    <div>
                                        <div className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>{s.title}</div>
                                        <div className="text-xs text-gray-400">{s.items.length} questions</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 w-full">
                        <div className="text-xs text-gray-500">Overall</div>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                            <div className="h-2 bg-[#7E22CE] rounded-full transition-all" style={{ width: `${(sectionsCompleted.filter(Boolean).length / sections.length) * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Right: Current section questions */}
                <div className="flex-1">
                    <Card className="w-full shadow-lg p-6">
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-2">{sections[currentSection].title}</h2>
                            <p className="text-sm text-gray-500 mb-4">Please answer the questions below and submit the section to continue.</p>

                            <AnimatePresence mode="wait">
                                <motion.div key={currentSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                                    <div className="relative">
                                        <div className="overflow-hidden">
                                            <motion.div className="flex w-full" animate={{ x: `-${currentSlide * 100}%` }} transition={{ type: "tween", duration: 0.28 }}>
                                                {sections[currentSection].items.map((q) => (
                                                    <div key={q.uid} className="w-full flex-shrink-0 px-2">
                                                        <div className="space-y-4">
                                                            <h3 className="text-sm font-medium mb-2">{q.question}</h3>
                                                            <div className="space-y-2">
                                                                {q.options.map((option, i) => (
                                                                    <label key={i} className={`block border rounded-xl px-4 py-2 cursor-pointer transition ${answers[q.uid] === option ? "bg-[#7E22CE] text-white border-[#7E22CE]" : "border-gray-300 hover:bg-purple-50"}`}>
                                                                        <input type="radio" name={`q${q.uid}`} value={option} checked={answers[q.uid] === option} onChange={() => handleOptionChange(q.uid, option)} className="hidden" />
                                                                        {option}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </div>

                                        {/* Arrows */}
                                        <button
                                            onClick={() => prevSlide()}
                                            aria-label="Previous question"
                                            disabled={currentSlide === 0}
                                            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-colors ${currentSlide === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#7E22CE] text-white hover:bg-[#6b1bbf]'}`}
                                        >
                                            ‹
                                        </button>

                                        <button
                                            onClick={() => nextSlide()}
                                            aria-label="Next question"
                                            disabled={currentSlide === sections[currentSection].items.length - 1}
                                            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-colors ${currentSlide === sections[currentSection].items.length - 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#7E22CE] text-white hover:bg-[#6b1bbf]'}`}
                                        >
                                            ›
                                        </button>

                                        {/* Dots */}
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            {sections[currentSection].items.map((_, idx) => (
                                                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2 h-2 rounded-full ${idx === currentSlide ? "bg-[#7E22CE]" : "bg-gray-300"}`} />
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500 text-center mt-2">Question {currentSlide + 1} of {sections[currentSection].items.length}</div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between items-center mt-6">
                                <div>
                                    <Button variant="outline" onClick={prevSection} disabled={currentSection === 0}>Back</Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-gray-500">{isSectionComplete(currentSection) ? "Ready to submit" : "Complete all questions"}</div>
                                    <Button onClick={submitSection} className="!bg-[#7E22CE]" disabled={!isSectionComplete(currentSection)}>
                                        {currentSection === sections.length - 1 ? "Finish Survey" : "Submit Section"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
