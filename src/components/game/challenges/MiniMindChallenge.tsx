import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as handpose from '@tensorflow-models/handpose';
import * as blazeface from '@tensorflow-models/blazeface';

// --- Types & Interfaces ---
interface MiniMindProps {
    onComplete?: (score: number) => void;
    onClose?: () => void;
}

type Mode = 'recycling' | 'hand' | 'face';
type ClassLabel = 'Recyclable (Paper)' | 'Danger (Plastic)' | 'Idle';

const MiniMindChallenge: React.FC<MiniMindProps> = ({ onComplete, onClose }) => {
    // --- State Management ---
    const [activeMode, setActiveMode] = useState<Mode>('recycling');
    const [isLoading, setIsLoading] = useState(true);
    const [statusText, setStatusText] = useState<string>('Initializing Systems...');

    // Mode Specific States
    const [confidence, setConfidence] = useState<number>(0);
    const [fingerCount, setFingerCount] = useState<number>(0);
    const [faceCount, setFaceCount] = useState<number>(0);
    const [showHelp, setShowHelp] = useState(false);

    // Classifier Samples
    const [samples, setSamples] = useState<{ [key: string]: number }>({
        'Recyclable (Paper)': 0,
        'Danger (Plastic)': 0,
        'Idle': 0
    });

    // --- Refs ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    // Model Refs
    const classifierRef = useRef<knnClassifier.KNNClassifier | null>(null);
    const mobilenetRef = useRef<mobilenet.MobileNet | null>(null);
    const handposeRef = useRef<handpose.HandPose | null>(null);
    const blazefaceRef = useRef<blazeface.BlazeFaceModel | null>(null);

    const modeRef = useRef<Mode>('recycling');

    // --- 1. Initialization ---
    useEffect(() => {
        modeRef.current = activeMode;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [activeMode]);

    useEffect(() => {
        const initAllModels = async () => {
            try {
                setStatusText('Booting Neural Core & Loading Models...');
                await tf.ready();

                const [mobil, hand, face] = await Promise.all([
                    mobilenet.load({ version: 2, alpha: 0.50 }),
                    handpose.load(),
                    blazeface.load()
                ]);

                mobilenetRef.current = mobil;
                handposeRef.current = hand;
                blazefaceRef.current = face;
                classifierRef.current = knnClassifier.create();

                setStatusText('Models Ready. Starting Camera...');
                setIsLoading(false);
                setupCamera();
            } catch (err) {
                console.error(err);
                setStatusText('Error: AI Model Load Failed');
                setIsLoading(false);
            }
        };

        initAllModels();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // --- 2. Camera Setup ---
    const setupCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current!.play();
                    if (canvasRef.current) {
                        canvasRef.current.width = videoRef.current!.videoWidth;
                        canvasRef.current.height = videoRef.current!.videoHeight;
                    }
                    detectLoop();
                };
            }
        }
    };

    // --- 3. The Main Detection Loop ---
    const detectLoop = async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) {
            animationRef.current = requestAnimationFrame(detectLoop);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
        }

        const mode = modeRef.current;

        // --- BRANCH 1: RECYCLING CLASSIFIER ---
        if (mode === 'recycling' && classifierRef.current && mobilenetRef.current) {
            if (classifierRef.current.getNumClasses() > 0) {
                const activation = mobilenetRef.current.infer(video, true);
                const result = await classifierRef.current.predictClass(activation);
                setStatusText(result.label);
                setConfidence(result.confidences[result.label]);
            } else {
                setStatusText('Waiting for Training Data...');
                setConfidence(0);
            }
        }

        // --- BRANCH 2: HAND DETECTION (Updated Logic) ---
        else if (mode === 'hand' && handposeRef.current && ctx) {
            const predictions = await handposeRef.current.estimateHands(video);

            if (predictions.length > 0) {
                predictions.forEach(hand => {
                    const landmarks = hand.landmarks;
                    drawHandSkeleton(ctx, landmarks);
                    const count = countExtendedFingers(landmarks);
                    setFingerCount(count);
                    setStatusText(`Hand Detected: ${count} Fingers`);
                });
            } else {
                setFingerCount(0);
                setStatusText('No Hand Detected');
            }
        }

        // --- BRANCH 3: FACE DETECTION ---
        else if (mode === 'face' && blazefaceRef.current && ctx) {
            const predictions = await blazefaceRef.current.estimateFaces(video, false);
            setFaceCount(predictions.length);

            if (predictions.length > 0) {
                setStatusText(`${predictions.length} Face(s) Secure`);
                predictions.forEach((face: any) => {
                    const start = face.topLeft;
                    const end = face.bottomRight;
                    const size = [end[0] - start[0], end[1] - start[1]];
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(start[0], start[1], size[0], size[1]);
                });
            } else {
                setStatusText('Scanning for Faces...');
            }
        }

        if (ctx) ctx.restore();
        animationRef.current = requestAnimationFrame(detectLoop);
    };

    // --- Helper: Count Fingers (Robust Geometric Approach) ---
    const countExtendedFingers = (landmarks: number[][]): number => {
        // We use Euclidean distance from Wrist (point 0) to Tip vs Wrist to Lower Joint
        // This makes the logic "Rotation Invariant" (works sideways/upside down)

        const wrist = landmarks[0];

        // Finger Indices in HandPose:
        // Thumb: Tip=4, Base=2 (MCP)
        // Index: Tip=8, Base=5 (MCP)
        // Middle: Tip=12, Base=9 (MCP)
        // Ring: Tip=16, Base=13 (MCP)
        // Pinky: Tip=20, Base=17 (MCP)

        const fingerIndices = [
            { tip: 4, base: 2 },  // Thumb (Using MCP as base gives better results for thumb)
            { tip: 8, base: 5 },  // Index
            { tip: 12, base: 9 }, // Middle
            { tip: 16, base: 13 },// Ring
            { tip: 20, base: 17 } // Pinky
        ];

        let count = 0;

        const getDistance = (p1: number[], p2: number[]) => {
            return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
        };

        fingerIndices.forEach((finger) => {
            const tipDist = getDistance(landmarks[finger.tip], wrist);
            const baseDist = getDistance(landmarks[finger.base], wrist);

            // If the tip is significantly further from the wrist than the base knuckle is, it's open.
            // We use a 1.1 multiplier as a threshold to prevent jitter when fingers are half-curled.
            if (tipDist > baseDist * 1.1) {
                count++;
            }
        });

        return count;
    };

    // --- Helper: Draw Skeleton ---
    const drawHandSkeleton = (ctx: CanvasRenderingContext2D, landmarks: number[][]) => {
        const fingerJoints = {
            thumb: [0, 1, 2, 3, 4],
            index: [0, 5, 6, 7, 8],
            middle: [0, 9, 10, 11, 12],
            ring: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20],
        };

        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;

        Object.values(fingerJoints).forEach((joints) => {
            for (let i = 0; i < joints.length - 1; i++) {
                const first = landmarks[joints[i]];
                const second = landmarks[joints[i + 1]];
                ctx.beginPath();
                ctx.moveTo(first[0], first[1]);
                ctx.lineTo(second[0], second[1]);
                ctx.stroke();
            }
        });

        ctx.fillStyle = 'red';
        for (let i = 0; i < landmarks.length; i++) {
            const x = landmarks[i][0];
            const y = landmarks[i][1];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI); // Made dots slightly larger
            ctx.fill();
        }
    };

    // --- Interaction Logic ---
    const addExample = async (label: ClassLabel) => {
        if (classifierRef.current && mobilenetRef.current && videoRef.current) {
            const activation = mobilenetRef.current.infer(videoRef.current, true);
            classifierRef.current.addExample(activation, label);
            setSamples(prev => ({ ...prev, [label]: prev[label] + 1 }));
        }
    };

    const handleTabChange = (m: Mode) => {
        setActiveMode(m);
        setConfidence(0);
        setStatusText('Switching Module...');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] flex flex-col overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-green-500/50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <h2 className="text-green-400 font-mono font-bold tracking-wider">
                            OMNI_VISION_CORE.EXE
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white px-2">[X] EXIT</button>
                </div>

                {/* Main Body */}
                <div className="flex flex-col md:flex-row h-full">

                    {/* Left: Vision Feed */}
                    <div className="flex-1 relative bg-black min-h-[400px]">
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="font-mono text-green-500 animate-pulse">LOADING AI MODELS...</p>
                            </div>
                        )}

                        {/* Video & Canvas Overlay */}
                        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />

                        {/* HUD Overlay */}
                        <div className="absolute top-4 left-4 z-10 font-mono text-sm text-green-500 bg-black/50 p-2 rounded border border-green-500/30">
                            <p>MODE: {activeMode.toUpperCase()}</p>
                            <p>STATUS: {statusText}</p>
                            {activeMode === 'recycling' && <p>CONFIDENCE: {(confidence * 100).toFixed(1)}%</p>}
                        </div>
                    </div>

                    {/* Right: Control Panel */}
                    <div className="w-full md:w-80 bg-slate-900 border-l border-green-500/30 flex flex-col">

                        {/* Tabs */}
                        <div className="flex border-b border-slate-700">
                            {(['recycling', 'hand', 'face'] as Mode[]).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => handleTabChange(mode)}
                                    className={`flex-1 py-3 text-xs font-mono font-bold transition-all ${activeMode === mode
                                        ? 'bg-green-600/20 text-green-400 border-b-2 border-green-500'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Mode Specific Controls */}
                        <div className="p-4 flex-1 overflow-y-auto">

                            {/* Help / How to Test Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-green-400 font-mono text-sm font-bold">CONTROL_PANEL</h3>
                                <button
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="w-6 h-6 rounded-full border border-green-500 text-green-500 flex items-center justify-center text-xs hover:bg-green-500 hover:text-black transition"
                                >
                                    ?
                                </button>
                            </div>

                            {/* Contextual Help Box */}
                            {showHelp && (
                                <div className="mb-4 bg-blue-900/30 border border-blue-500/50 p-3 rounded text-xs text-blue-200 font-mono">
                                    <p className="font-bold mb-1">HOW TO TEST:</p>
                                    {activeMode === 'recycling' && (
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Hold an object up to camera.</li>
                                            <li>Click a button (Blue/Red) to "Teach" the AI what it is.</li>
                                            <li>Test by moving the object away and back.</li>
                                        </ul>
                                    )}
                                    {activeMode === 'hand' && (
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Show your hand to the camera.</li>
                                            <li>Open your fingers to see the counter go up.</li>
                                            <li>Cyan lines show the AI's skeletal tracking.</li>
                                        </ul>
                                    )}
                                    {activeMode === 'face' && (
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Look directly at the camera.</li>
                                            <li>A green box will track your face.</li>
                                            <li>Try covering your face to test detection loss.</li>
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* RECYCLING CONTROLS */}
                            {activeMode === 'recycling' && (
                                <div className="space-y-3">
                                    <ControlBtn
                                        color="blue" label="TEACH: RECYCLABLE"
                                        count={samples['Recyclable (Paper)']}
                                        onClick={() => addExample('Recyclable (Paper)')}
                                    />
                                    <ControlBtn
                                        color="red" label="TEACH: DANGER"
                                        count={samples['Danger (Plastic)']}
                                        onClick={() => addExample('Danger (Plastic)')}
                                    />
                                    <ControlBtn
                                        color="gray" label="TEACH: BACKGROUND"
                                        count={samples['Idle']}
                                        onClick={() => addExample('Idle')}
                                    />
                                </div>
                            )}

                            {/* HAND CONTROLS (Read Only Stats) */}
                            {activeMode === 'hand' && (
                                <div className="space-y-4 text-center mt-10">
                                    <div className="text-6xl font-bold text-green-400 font-mono">
                                        {fingerCount}
                                    </div>
                                    <p className="text-slate-400 font-mono text-sm">FINGERS DETECTED</p>
                                    <div className="w-full h-1 bg-slate-700 rounded overflow-hidden">
                                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${fingerCount * 20}%` }} />
                                    </div>
                                </div>
                            )}

                            {/* FACE CONTROLS (Read Only Stats) */}
                            {activeMode === 'face' && (
                                <div className="space-y-4 text-center mt-10">
                                    <div className="text-6xl font-bold text-cyan-400 font-mono">
                                        {faceCount}
                                    </div>
                                    <p className="text-slate-400 font-mono text-sm">FACES SECURED</p>
                                    <div className={`px-4 py-2 rounded font-mono text-xs ${faceCount > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                        {faceCount > 0 ? 'ACCESS GRANTED' : 'NO SUBJECT'}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-slate-700">
                            <button
                                onClick={() => onComplete?.(100)}
                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg shadow-green-900/50 transition-all font-mono"
                            >
                                UPLOAD DATA TO CORE
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-component ---
const ControlBtn = ({ color, label, count, onClick }: any) => {
    const colors: any = {
        blue: "bg-blue-600 hover:bg-blue-500 border-blue-400",
        red: "bg-red-600 hover:bg-red-500 border-red-400",
        gray: "bg-slate-600 hover:bg-slate-500 border-slate-400"
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between w-full p-4 rounded border-l-4 ${colors[color]} bg-opacity-20 hover:bg-opacity-30 transition-all active:scale-95`}
        >
            <span className="font-mono text-xs font-bold text-white tracking-wider">{label}</span>
            <span className="bg-black/40 px-2 py-1 rounded text-xs font-mono text-white min-w-[30px]">{count}</span>
        </button>
    );
};

export default MiniMindChallenge;