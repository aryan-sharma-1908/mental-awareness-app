import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Wind, Heart, Moon, Pause, Play, X, ChevronRight } from 'lucide-react';
import Lottie from 'lottie-react';

/* ─────────────────────────────────────────────
   LOTTIE ANIMATION URLs
───────────────────────────────────────────── */
const LOTTIE_URLS = {
  breathing: '/breathing.json', // Local fallback
  meditation: '/breathing.json', // Using same animation for now
  kindness: '/breathing.json', // Using same animation for now
  sleep: '/breathing.json', // Using same animation for now
};

/* ─────────────────────────────────────────────
   EXERCISE DATA — each step has its own duration (seconds)
───────────────────────────────────────────── */
const EXERCISES = [
  {
    id: 'breathing',
    title: 'Mindful Breathing',
    description: 'Anchor yourself in the present moment through breath awareness.',
    duration: '5 mins',
    icon: <Wind className="h-6 w-6" />,
    difficulty: 'Beginner',
    lottieUrl: LOTTIE_URLS.breathing,
    tone: { freq: 174, type: 'sine' },
    musicLabel: 'Calming breath tone',
    steps: [
      { text: 'Find a comfortable seated position and gently close your eyes.', secs: 10 },
      { text: 'Breathe in slowly through your nose for 4 counts.', secs: 6 },
      { text: 'Hold your breath gently for 4 counts.', secs: 6 },
      { text: 'Exhale slowly through your mouth for 6 counts.', secs: 8 },
      { text: 'Notice the natural rise and fall of your chest.', secs: 10 },
      { text: 'If your mind wanders, gently return focus to your breath.', secs: 10 },
      { text: 'Continue breathing at your own natural pace.', secs: 12 },
      { text: 'Slowly open your eyes. Well done — you did it! 🌿', secs: 8 },
    ],
  },
  {
    id: 'meditation',
    title: 'Body Scan Meditation',
    description: 'Progressively relax each part of your body from head to toe.',
    duration: '15 mins',
    icon: <Brain className="h-6 w-6" />,
    difficulty: 'Intermediate',
    lottieUrl: LOTTIE_URLS.meditation,
    tone: { freq: 285, type: 'sine' },
    musicLabel: 'Deep focus tone',
    steps: [
      { text: 'Lie down or sit comfortably. Close your eyes and relax.', secs: 10 },
      { text: 'Bring your awareness to the top of your head. Notice any tension.', secs: 12 },
      { text: 'Slowly move attention to your face, jaw, and neck. Let them soften.', secs: 12 },
      { text: 'Feel your shoulders drop. Release any tightness in your arms.', secs: 12 },
      { text: 'Focus on your chest and belly. Let your breath be natural.', secs: 12 },
      { text: 'Scan down through your hips, thighs, and knees.', secs: 12 },
      { text: 'Notice your calves, ankles, and the soles of your feet.', secs: 12 },
      { text: 'Your whole body is relaxed. Rest here for a moment. ✨', secs: 14 },
    ],
  },
  {
    id: 'kindness',
    title: 'Loving-Kindness',
    description: 'Develop deep compassion for yourself and those around you.',
    duration: '10 mins',
    icon: <Heart className="h-6 w-6" />,
    difficulty: 'Beginner',
    lottieUrl: LOTTIE_URLS.kindness,
    tone: { freq: 528, type: 'sine' },
    musicLabel: 'Heart resonance tone',
    steps: [
      { text: 'Sit comfortably and place one hand over your heart.', secs: 10 },
      { text: 'Silently repeat: "May I be happy. May I be healthy."', secs: 12 },
      { text: 'Now think of someone you love. Send them the same warmth.', secs: 12 },
      { text: '"May you be happy. May you be at peace."', secs: 10 },
      { text: 'Expand to a neutral person — someone you neither like nor dislike.', secs: 12 },
      { text: 'Now extend kindness to all beings everywhere.', secs: 12 },
      { text: 'Return your focus inward. Feel gratitude for this moment.', secs: 10 },
      { text: 'Gently open your eyes. Carry this warmth with you. 💛', secs: 10 },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep Meditation',
    description: 'Drift into restful sleep through calming visualization.',
    duration: '20 mins',
    icon: <Moon className="h-6 w-6" />,
    difficulty: 'Beginner',
    lottieUrl: LOTTIE_URLS.sleep,
    tone: { freq: 432, type: 'sine' },
    musicLabel: 'Sleep wave tone',
    steps: [
      { text: 'Lie down in bed and let your body sink into the mattress.', secs: 12 },
      { text: 'Take three deep breaths, sighing out any tension.', secs: 12 },
      { text: 'Imagine a warm golden light starting at your feet.', secs: 12 },
      { text: 'The light slowly moves up your legs, melting all tension away.', secs: 14 },
      { text: 'Feel it spreading through your belly and chest, warm and safe.', secs: 14 },
      { text: 'Your arms and hands feel heavy and at rest.', secs: 12 },
      { text: 'Picture a peaceful place — a beach, a forest, anywhere you love.', secs: 14 },
      { text: 'You are safe. You are at peace. Let sleep come naturally. 🌙', secs: 16 },
    ],
  },
];

const difficultyColor = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-rose-100 text-rose-700',
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function Exercises() {
  const [activeExercise, setActiveExercise] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellness Exercises</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Expert-curated exercises to help you find peace, reduce anxiety,
            and improve your mental well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXERCISES.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onStart={() => setActiveExercise(ex)} />
          ))}
        </div>
      </div>

      {activeExercise && (
        <ExerciseModal exercise={activeExercise} onClose={() => setActiveExercise(null)} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXERCISE CARD
───────────────────────────────────────────── */
function ExerciseCard({ exercise, onStart }) {
  const { title, description, duration, icon, difficulty, lottieUrl, steps } = exercise;
  const [animData, setAnimData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(lottieUrl)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(data => {
        setAnimData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        setAnimData(null);
      });
  }, [lottieUrl]);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
      {/* Animation */}
      <div className="h-36 flex items-center justify-center mb-4 rounded-xl bg-indigo-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : animData && !error ? (
          <Lottie animationData={animData} loop className="h-full" />
        ) : (
          <div className="p-4 bg-indigo-100 rounded-full">
            {React.cloneElement(icon, { className: 'h-10 w-10 text-indigo-400' })}
          </div>
        )}
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyColor[difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
          {difficulty}
        </span>
        <span className="text-sm font-medium text-indigo-500">{duration}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-2 flex-1">{description}</p>
      <p className="text-xs text-gray-300 mb-4">{steps.length} guided steps</p>

      <button
        onClick={onStart}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        Start Exercise <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXERCISE MODAL
───────────────────────────────────────────── */
function ExerciseModal({ exercise, onClose }) {
  const { title, duration, difficulty, lottieUrl, tone, musicLabel, steps } = exercise;

  const [animData, setAnimData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [started, setStarted] = useState(false);   // has user pressed Start?
  const [stepIndex, setStepIndex] = useState(0);       // current step
  const [timeLeft, setTimeLeft] = useState(steps[0].secs); // countdown for step
  const [finished, setFinished] = useState(false);   // all steps done

  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch lottie
  useEffect(() => {
    fetch(lottieUrl).then(r => r.json()).then(setAnimData).catch(() => setAnimData(null));
    return () => stopTone();
  }, [lottieUrl]);

  /* ── Timer logic ── */
  const advanceStep = useCallback(() => {
    setStepIndex(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        // All steps done
        setFinished(true);
        stopTone();
        return prev;
      }
      setTimeLeft(steps[next].secs);
      return next;
    });
  }, [steps]);

  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          advanceStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started, stepIndex, finished, advanceStep]);

  /* ── Audio helpers ── */
  const startTone = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscillatorRef.current = osc;
    gainRef.current = gain;
    setPlaying(true);
  };

  const stopTone = () => {
    if (gainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => {
        try { oscillatorRef.current?.stop(); } catch (e) { }
        oscillatorRef.current = null;
        gainRef.current = null;
      }, 900);
    }
    setPlaying(false);
  };

  const toggleMusic = () => playing ? stopTone() : startTone();

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(v, audioCtxRef.current.currentTime + 0.1);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setStepIndex(0);
    setTimeLeft(steps[0].secs);
    setFinished(false);
    startTone();
  };

  const handleClose = () => {
    clearInterval(timerRef.current);
    stopTone();
    onClose();
  };

  // Progress % through current step
  const stepProgress = Math.round(((steps[stepIndex].secs - timeLeft) / steps[stepIndex].secs) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400">{duration} · {difficulty}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Lottie */}
        <div className="h-40 flex items-center justify-center px-6 shrink-0">
          {animData
            ? <Lottie animationData={animData} loop className="h-full" />
            : <div className="h-full w-full bg-indigo-50 rounded-2xl animate-pulse" />
          }
        </div>

        {/* ── INSTRUCTION AREA ── */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {!started && !finished && (
            /* Pre-start: show all steps as a preview list */
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">What you'll do:</p>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-500">{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {started && !finished && (
            /* Active: show current step with countdown */
            <div className="text-center">
              {/* Step counter */}
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                Step {stepIndex + 1} of {steps.length}
              </p>

              {/* Instruction text */}
              <p className="text-gray-800 font-medium text-base leading-relaxed mb-5 min-h-[3rem]">
                {steps[stepIndex].text}
              </p>

              {/* Circular countdown */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#e0e7ff" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - stepProgress / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-indigo-600">
                    {timeLeft}
                  </span>
                </div>
              </div>

              {/* Upcoming step preview */}
              {stepIndex < steps.length - 1 && (
                <p className="text-xs text-gray-400 italic">
                  Up next: {steps[stepIndex + 1].text}
                </p>
              )}

              {/* Step dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300
                      ${i < stepIndex ? 'w-4 bg-indigo-400'
                        : i === stepIndex ? 'w-6 bg-indigo-600'
                          : 'w-1.5 bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {finished && (
            /* Completed state */
            <div className="text-center py-4">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-lg font-bold text-gray-900 mb-1">Exercise Complete!</p>
              <p className="text-sm text-gray-400">
                Great work. Take a moment to notice how you feel.
              </p>
            </div>
          )}
        </div>

        {/* ── BOTTOM CONTROLS ── */}
        <div className="px-6 pb-6 shrink-0 space-y-3">

          {/* Start button (only before exercise begins) */}
          {!started && !finished && (
            <button
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" /> Begin Exercise
            </button>
          )}

          {/* Restart after finish */}
          {finished && (
            <button
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
            >
              Restart Exercise
            </button>
          )}

          {/* Music controls — always visible */}
          <div className="bg-indigo-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-indigo-800">Ambient Sound</p>
                <p className="text-xs text-indigo-400">{musicLabel} · {tone.freq} Hz</p>
              </div>
              <button
                onClick={toggleMusic}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors
                  ${playing
                    ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {playing ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Play</>}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-400">Vol</span>
              <input
                type="range" min="0" max="0.8" step="0.01"
                value={volume} onChange={handleVolume}
                className="flex-1 accent-indigo-600"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}