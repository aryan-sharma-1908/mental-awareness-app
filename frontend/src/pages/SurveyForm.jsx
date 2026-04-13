import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../config";
import { AuthContext } from "@/components/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   QUESTION DATA
───────────────────────────────────────────── */

const PHQ_9_QUESTIONS = [
  { id: 1, question: "Little interest or pleasure in doing things" },
  { id: 2, question: "Feeling down, depressed, or hopeless" },
  { id: 3, question: "Trouble falling or staying asleep, or sleeping too much" },
  { id: 4, question: "Feeling tired or having little energy" },
  { id: 5, question: "Poor appetite or overeating" },
  { id: 6, question: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
  { id: 7, question: "Trouble concentrating on things, such as reading the newspaper or watching television" },
  { id: 8, question: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless" },
  { id: 9, question: "Thoughts that you would be better off dead or of hurting yourself in some way" },
].map((q) => ({
  ...q,
  uid: `phq-${q.id}`,
  options: ["Not at all", "Several days", "More than half the days", "Almost every day"],
}));

const GAD_7_QUESTIONS = [
  { id: 1, question: "Feeling nervous, anxious, or on edge" },
  { id: 2, question: "Not being able to stop or control worrying" },
  { id: 3, question: "Worrying too much about different things" },
  { id: 4, question: "Trouble relaxing" },
  { id: 5, question: "Being so restless that it is hard to sit still" },
  { id: 6, question: "Becoming easily annoyed or irritable" },
  { id: 7, question: "Feeling afraid as if something awful might happen" },
].map((q) => ({
  ...q,
  uid: `gad-${q.id}`,
  options: ["Not at all", "Several days", "More than half the days", "Almost every day"],
}));

const WHO_5_QUESTIONS = [
  { id: 1, question: "I have felt cheerful and in good spirits" },
  { id: 2, question: "I have felt calm and relaxed" },
  { id: 3, question: "I have felt active and vigorous" },
  { id: 4, question: "I woke up feeling fresh and rested" },
  { id: 5, question: "My daily life has been filled with things that interest me" },
].map((q) => ({
  ...q,
  uid: `who-${q.id}`,
  options: [
    "At no time", "Some of the time", "Less than half of the time",
    "More than half of the time", "Most of the time", "All of the time",
  ],
}));

/* ─────────────────────────────────────────────
   SECTIONS CONFIG
   surveyType must exactly match backend enum.
───────────────────────────────────────────── */
const SECTIONS = [
  { title: "PHQ-9 (Depression)", surveyType: "PHQ-9", items: PHQ_9_QUESTIONS },
  { title: "GAD-7 (Anxiety)", surveyType: "GAD-7", items: GAD_7_QUESTIONS },
  { title: "WHO-5 (Well-being)", surveyType: "WHO-5", items: WHO_5_QUESTIONS },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function SurveyForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});           // all answers, all sections
  const [sectionsCompleted, setSectionsCompleted] = useState(
    () => new Array(SECTIONS.length).fill(false)
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [canTakeSurvey, setCanTakeSurvey] = useState(true);
  const [retakeAvailableInDays, setRetakeAvailableInDays] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user can take survey (7-day gap)
  const checkSurveyStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/survey`, {
        credentials: "include",
      });

      if (!res.ok) {
        setCanTakeSurvey(true);
        return;
      }

      const data = await res.json();
      const surveys = data.data ?? [];

      if (surveys.length === 0) {
        setCanTakeSurvey(true);
        return;
      }

      // Most recent submission across all types
      const latest = surveys.reduce((newest, s) =>
        new Date(s.createdAt) > new Date(newest.createdAt) ? s : newest
      );

      const msSince = Date.now() - new Date(latest.createdAt).getTime();
      const weekMs = 7 * 24 * 60 * 60 * 1000;

      if (msSince < weekMs) {
        setCanTakeSurvey(false);
        const days = Math.ceil((weekMs - msSince) / (1000 * 60 * 60 * 24));
        setRetakeAvailableInDays(days);
      } else {
        setCanTakeSurvey(true);
      }
    } catch (e) {
      console.warn("Could not check survey status", e);
      setCanTakeSurvey(true);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkSurveyStatus();
  }, []);

  /* ── Answer selection ─────────────────────────────── */
  const handleOptionChange = (uid, option) => {
    setAnswers((prev) => ({ ...prev, [uid]: option }));
  };

  /* ── Section completion check ─────────────────────── */
  const isSectionComplete = (index) =>
    SECTIONS[index].items.every((q) => answers[q.uid]);

  /* ── Slide navigation ─────────────────────────────── */
  const prevSlide = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const nextSlide = () =>
    setCurrentSlide((s) =>
      Math.min(SECTIONS[currentSection].items.length - 1, s + 1)
    );

  /* ── Submit ONE section to the backend ───────────────
     Filters answers to only the keys belonging to this
     section (e.g. phq-1 … phq-9) before sending.
  ─────────────────────────────────────────────────── */
  const submitSection = async () => {
    if (!isSectionComplete(currentSection) || submitting) return;

    const section = SECTIONS[currentSection];

    // Build a clean answers object for this section only
    const sectionAnswers = {};
    section.items.forEach((q) => {
      sectionAnswers[q.uid] = answers[q.uid];
    });

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          surveyType: section.surveyType,   // ← "PHQ-9" | "GAD-7" | "WHO-5"
          answers: sectionAnswers,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 429) {
          // 7-day gap violation
          setCanTakeSurvey(false);
          const daysMatch = text.match(/(\d+)/);
          if (daysMatch) {
            setRetakeAvailableInDays(parseInt(daysMatch[1]));
          }
          throw new Error(text || `Survey not available. Please try again later.`);
        }
        throw new Error(text || `Server error ${response.status}`);
      }

      // Mark this section done
      setSectionsCompleted((prev) => {
        const updated = [...prev];
        updated[currentSection] = true;
        return updated;
      });

      const isLastSection = currentSection === SECTIONS.length - 1;

      if (isLastSection) {
        toast.success("Survey complete — thank you!");
        setSubmitted(true);

        try {
          if (typeof fetchUser === "function") await fetchUser();
        } catch (e) {
          console.error("fetchUser error:", e);
        }

        // Remove localStorage — DB is the source of truth now
        try { localStorage.removeItem("surveySubmittedAt"); } catch (e) { }

        // Pass flag so Home re-checks immediately on arrival
        setTimeout(() => navigate("/", { state: { surveyJustCompleted: true } }), 900);
      } else {
        // Advance to next section
        setCurrentSection((s) => s + 1);
      }

    } catch (error) {
      console.error("[submitSection]", error);
      setSubmitError(error.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Thank-you screen ─────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full text-center p-6">
          <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4">Your responses have been recorded.</p>
          <Button onClick={() => window.location.reload()} className="!bg-[#7E22CE]">
            Retake Survey
          </Button>
        </Card>
      </div>
    );
  }

  /* ── Check if user can take survey ─────────────────── */
  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full text-center p-6">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-gray-600">Checking survey availability.</p>
        </Card>
      </div>
    );
  }

  if (!canTakeSurvey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full text-center p-6">
          <h2 className="text-2xl font-semibold mb-4">Survey Not Available</h2>
          <p className="text-gray-600 mb-4">
            You can retake the survey in {retakeAvailableInDays} {retakeAvailableInDays === 1 ? 'day' : 'days'}.
          </p>
          <Button onClick={() => navigate('/')} className="!bg-[#7E22CE]">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const section = SECTIONS[currentSection];
  const totalSlides = section.items.length;

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6 survey-form">
      <div className="max-w-4xl w-full flex gap-6">

        {/* ── Left: Section progress sidebar ──────────── */}
        <div className="w-48 flex flex-col items-start">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Survey Progress</h3>
          <div className="space-y-4">
            {SECTIONS.map((s, idx) => {
              const active = idx === currentSection;
              const done = sectionsCompleted[idx];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${done ? "bg-[#7E22CE] text-white"
                      : active ? "border-2 border-[#7E22CE] text-[#7E22CE]"
                        : "border bg-white text-gray-600"}`}
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  <div>
                    <div className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                      {s.title}
                    </div>
                    <div className="text-xs text-gray-400">{s.items.length} questions</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall progress bar */}
          <div className="mt-6 w-full">
            <div className="text-xs text-gray-500">Overall</div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                className="h-2 bg-[#7E22CE] rounded-full transition-all"
                style={{
                  width: `${(sectionsCompleted.filter(Boolean).length / SECTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Right: Question card ─────────────────────── */}
        <div className="flex-1">
          <Card className="w-full shadow-lg p-6">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Answer all questions, then click Submit Section to continue.
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Sliding question carousel */}
                  <div className="relative overflow-hidden">
                    <motion.div
                      className="flex w-full"
                      animate={{ x: `-${currentSlide * 100}%` }}
                      transition={{ type: "tween", duration: 0.28 }}
                    >
                      {section.items.map((q) => (
                        <div key={q.uid} className="w-full flex-shrink-0 px-2">
                          <h3 className="text-sm font-medium mb-3">{q.question}</h3>
                          <div className="space-y-2">
                            {q.options.map((option, i) => (
                              <label
                                key={i}
                                className={`block border rounded-xl px-4 py-2 cursor-pointer transition
                                  ${answers[q.uid] === option
                                    ? "bg-[#7E22CE] text-white border-[#7E22CE]"
                                    : "border-gray-300 hover:bg-purple-50"}`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.uid}`}
                                  value={option}
                                  checked={answers[q.uid] === option}
                                  onChange={() => handleOptionChange(q.uid, option)}
                                  className="hidden"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Prev arrow */}
                    <button
                      onClick={prevSlide}
                      aria-label="Previous question"
                      disabled={currentSlide === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-20
                        w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-colors
                        ${currentSlide === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-[#7E22CE] text-white hover:bg-[#6b1bbf]"}`}
                    >
                      ‹
                    </button>

                    {/* Next arrow */}
                    <button
                      onClick={nextSlide}
                      aria-label="Next question"
                      disabled={currentSlide === totalSlides - 1}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-20
                        w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-colors
                        ${currentSlide === totalSlides - 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-[#7E22CE] text-white hover:bg-[#6b1bbf]"}`}
                    >
                      ›
                    </button>
                  </div>

                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {section.items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-colors
                          ${idx === currentSlide ? "bg-[#7E22CE]" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Question {currentSlide + 1} of {totalSlides}
                  </div>

                  {/* Question Navigation Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="px-6"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={nextSlide}
                      disabled={currentSlide === totalSlides - 1}
                      className="!bg-[#7E22CE] px-6"
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom actions */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
                  disabled={currentSection === 0}
                >
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {isSectionComplete(currentSection) ? "Ready to submit" : "Complete all questions"}
                  </span>
                  <div className="flex flex-col items-end">
                    <Button
                      onClick={submitSection}
                      className="!bg-[#7E22CE]"
                      disabled={!isSectionComplete(currentSection) || submitting}
                    >
                      {submitting
                        ? "Submitting…"
                        : currentSection === SECTIONS.length - 1
                          ? "Finish Survey"
                          : "Submit Section"}
                    </Button>
                    {submitError && (
                      <p className="text-xs text-red-600 mt-2">{submitError}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}