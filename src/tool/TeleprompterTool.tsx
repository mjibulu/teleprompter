import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Expand, FlipHorizontal2, Pause, Play, RotateCcw } from "lucide-react";
import { DownloadButton } from "../components/DownloadButton";
import { countTeleprompterWords, estimateSpeakingSeconds, formatTeleprompterClock, getTeleprompterProgress, getTeleprompterRemainingSeconds, } from "../lib/public-tools/teleprompter";
const SESSION_KEY = "teleprompter:script:v1";
const DEFAULT_SCRIPT = `Good morning and welcome.

Paste or write your script here, then choose a comfortable reading speed and font size.

Press play when you are ready. Keep your eyes near the center guide and use the keyboard controls to stay focused on your delivery.`;
type PlaybackState = "idle" | "countdown" | "playing" | "paused" | "finished";
type TextAlign = "left" | "center";
export function TeleprompterTool() {
    const [script, setScript] = useState(DEFAULT_SCRIPT);
    const [speed, setSpeed] = useState(45);
    const [fontSize, setFontSize] = useState(54);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [columnWidth, setColumnWidth] = useState(82);
    const [textAlign, setTextAlign] = useState<TextAlign>("center");
    const [guideVisible, setGuideVisible] = useState(true);
    const [mirrored, setMirrored] = useState(false);
    const [startDelay, setStartDelay] = useState(3);
    const [countdown, setCountdown] = useState(0);
    const [playback, setPlayback] = useState<PlaybackState>("idle");
    const [fullscreen, setFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [fileError, setFileError] = useState("");
    const [sessionRestored, setSessionRestored] = useState(false);
    const stageRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);
    const lastTimeRef = useRef(0);
    const lastProgressUpdateRef = useRef(0);
    const trackedStartRef = useRef(false);
    const words = useMemo(() => countTeleprompterWords(script), [script]);
    const speakingEstimate = estimateSpeakingSeconds(words);
    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            try {
                const saved = window.sessionStorage.getItem(SESSION_KEY);
                if (saved !== null)
                    setScript(saved.slice(0, 30000));
            }
            catch {
                // The editor remains usable if browser storage is blocked.
            }
            setSessionRestored(true);
        });
        return () => window.cancelAnimationFrame(frame);
    }, []);
    useEffect(() => {
        if (!sessionRestored)
            return;
        try {
            window.sessionStorage.setItem(SESSION_KEY, script);
        }
        catch {
            // Session recovery is optional.
        }
    }, [script, sessionRestored]);
    const updateStageProgress = useCallback(() => {
        const stage = stageRef.current;
        if (!stage)
            return;
        setProgress(getTeleprompterProgress(stage.scrollTop, stage.scrollHeight, stage.clientHeight));
        setRemainingSeconds(getTeleprompterRemainingSeconds(stage.scrollTop, stage.scrollHeight, stage.clientHeight, speed));
    }, [speed]);
    const reset = useCallback(() => {
        setPlayback("idle");
        setCountdown(0);
        if (stageRef.current)
            stageRef.current.scrollTop = 0;
        setProgress(0);
        lastTimeRef.current = 0;
    }, []);
    const startOrToggle = useCallback(() => {
        setPlayback((current) => {
            if (current === "playing")
                return "paused";
            if (current === "paused")
                return "playing";
            if (current === "countdown") {
                setCountdown(0);
                return "idle";
            }
            if (current === "finished" && stageRef.current)
                stageRef.current.scrollTop = 0;
            if (startDelay > 0) {
                setCountdown(startDelay);
                return "countdown";
            }
            if (!trackedStartRef.current) {
                trackedStartRef.current = true;
            }
            return "playing";
        });
    }, [startDelay]);
    const toggleFullscreen = useCallback(async () => {
        const preview = previewRef.current;
        if (!preview)
            return;
        try {
            if (document.fullscreenElement)
                await document.exitFullscreen();
            else
                await preview.requestFullscreen();
        }
        catch {
            // The preview remains usable when fullscreen is blocked.
        }
    }, []);
    useEffect(() => {
        if (playback !== "countdown")
            return;
        const timer = window.setTimeout(() => {
            if (countdown <= 1) {
                setCountdown(0);
                setPlayback("playing");
                if (!trackedStartRef.current) {
                    trackedStartRef.current = true;
                }
            }
            else {
                setCountdown((current) => current - 1);
            }
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [countdown, playback]);
    useEffect(() => {
        const handleFullscreen = () => setFullscreen(document.fullscreenElement === previewRef.current);
        document.addEventListener("fullscreenchange", handleFullscreen);
        return () => document.removeEventListener("fullscreenchange", handleFullscreen);
    }, []);
    useEffect(() => {
        updateStageProgress();
    }, [columnWidth, fontSize, lineHeight, script, updateStageProgress]);
    useEffect(() => {
        if (playback !== "playing") {
            lastTimeRef.current = 0;
            if (frameRef.current)
                cancelAnimationFrame(frameRef.current);
            return;
        }
        const step = (time: number) => {
            const stage = stageRef.current;
            if (!stage)
                return;
            if (lastTimeRef.current)
                stage.scrollTop += (speed * (time - lastTimeRef.current)) / 1000;
            lastTimeRef.current = time;
            if (time - lastProgressUpdateRef.current >= 150) {
                lastProgressUpdateRef.current = time;
                updateStageProgress();
            }
            if (stage.scrollTop + stage.clientHeight >= stage.scrollHeight - 2) {
                setPlayback("finished");
                updateStageProgress();
                return;
            }
            frameRef.current = requestAnimationFrame(step);
        };
        frameRef.current = requestAnimationFrame(step);
        return () => {
            if (frameRef.current)
                cancelAnimationFrame(frameRef.current);
        };
    }, [playback, speed, updateStageProgress]);
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            const target = event.target;
            if (target instanceof Element &&
                target.matches("input, textarea, select, [contenteditable='true']")) {
                return;
            }
            if (event.code === "Space") {
                event.preventDefault();
                startOrToggle();
            }
            else if (event.key.toLocaleLowerCase() === "r") {
                reset();
            }
            else if (event.key.toLocaleLowerCase() === "m") {
                setMirrored((current) => !current);
            }
            else if (event.key.toLocaleLowerCase() === "f") {
                void toggleFullscreen();
            }
            else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSpeed((current) => Math.min(180, current + 5));
            }
            else if (event.key === "ArrowDown") {
                event.preventDefault();
                setSpeed((current) => Math.max(5, current - 5));
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [reset, startOrToggle, toggleFullscreen]);
    const updateScript = (value: string) => {
        setScript(value.slice(0, 30000));
        setFileError("");
        reset();
    };
    const importScript = async (file: File | undefined) => {
        if (!file)
            return;
        if (file.size > 200000) {
            setFileError("Choose a plain-text file smaller than 200 KB.");
            return;
        }
        if (!file.type.startsWith("text/") && !/\.(txt|md)$/iu.test(file.name)) {
            setFileError("Choose a .txt or .md plain-text script.");
            return;
        }
        try {
            updateScript(await file.text());
        }
        catch {
            setFileError("The selected script could not be read.");
        }
    };
    const playbackLabel = playback === "playing"
        ? "Pause"
        : playback === "paused"
            ? "Resume"
            : playback === "countdown"
                ? "Cancel countdown"
                : playback === "finished"
                    ? "Play again"
                    : startDelay ? `Start in ${startDelay} seconds` : "Play";
    return (<div className="teleprompter">
      <section className="teleprompter-editor" aria-labelledby="teleprompter-editor-title">
        <div className="teleprompter-section-heading">
          <div>
            <h2 id="teleprompter-editor-title">Script</h2>
            <p>{words.toLocaleString()} words · about {formatTeleprompterClock(speakingEstimate)} at 150 WPM</p>
          </div>
          <DownloadButton content={script} filename="teleprompter-script.txt" toolSlug="teleprompter">
            Download .txt
          </DownloadButton>
        </div>
        <label className="sr-only" htmlFor="teleprompter-script">Script text</label>
        <textarea id="teleprompter-script" value={script} onChange={(event) => updateScript(event.target.value)} rows={13} placeholder="Paste or write your script…"/>
        <div className="teleprompter-editor-actions">
          <label className="secondary-button file-button">
            Import .txt or .md
            <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => { void importScript(event.target.files?.[0]); event.currentTarget.value = ""; }}/>
          </label>
          <button type="button" className="secondary-button" onClick={() => updateScript("")} disabled={!script}>Clear script</button>
        </div>
        {fileError ? <p className="validation-message error" role="alert">{fileError}</p> : null}
      </section>

      <section className="teleprompter-settings" aria-labelledby="teleprompter-settings-title">
        <div className="teleprompter-section-heading">
          <div>
            <h2 id="teleprompter-settings-title">Reading setup</h2>
            <p>Fine-tune the stage before going fullscreen.</p>
          </div>
        </div>
        <div className="tool-preset-bar" aria-label="Scroll speed presets">
          <span>Speed</span>
          {[["Slow", 25], ["Natural", 45], ["Fast", 75]].map(([label, value]) => (<button key={label} type="button" className={speed === value ? "secondary-button active" : "secondary-button"} aria-pressed={speed === value} onClick={() => setSpeed(value as number)}>
              {label}
            </button>))}
        </div>
        <label htmlFor="teleprompter-speed"><span>Scroll speed</span><strong>{speed} px/s</strong></label>
        <input id="teleprompter-speed" type="range" min="5" max="180" step="5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}/>
        <label htmlFor="teleprompter-font"><span>Font size</span><strong>{fontSize}px</strong></label>
        <input id="teleprompter-font" type="range" min="28" max="110" step="2" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))}/>
        <label htmlFor="teleprompter-spacing"><span>Line spacing</span><strong>{lineHeight.toFixed(1)}</strong></label>
        <input id="teleprompter-spacing" type="range" min="1.1" max="2.2" step="0.1" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))}/>
        <label htmlFor="teleprompter-width"><span>Text width</span><strong>{columnWidth}%</strong></label>
        <input id="teleprompter-width" type="range" min="45" max="96" step="1" value={columnWidth} onChange={(event) => setColumnWidth(Number(event.target.value))}/>
        <div className="teleprompter-choice-grid">
          <label htmlFor="teleprompter-align">Text alignment</label>
          <select id="teleprompter-align" value={textAlign} onChange={(event) => setTextAlign(event.target.value as TextAlign)}>
            <option value="center">Centred</option>
            <option value="left">Left aligned</option>
          </select>
          <label htmlFor="teleprompter-delay">Start countdown</label>
          <select id="teleprompter-delay" value={startDelay} onChange={(event) => setStartDelay(Number(event.target.value))}>
            <option value="0">None</option><option value="3">3 seconds</option><option value="5">5 seconds</option>
          </select>
        </div>
        <div className="teleprompter-toggle-grid">
          <button type="button" className={mirrored ? "secondary-button active" : "secondary-button"} aria-pressed={mirrored} onClick={() => setMirrored((current) => !current)}>
            <FlipHorizontal2 size={17} aria-hidden="true"/> Mirror text
          </button>
          <button type="button" className={guideVisible ? "secondary-button active" : "secondary-button"} aria-pressed={guideVisible} onClick={() => setGuideVisible((current) => !current)}>
            Reading guide
          </button>
        </div>
      </section>

      <div className="teleprompter-preview" ref={previewRef}>
        <div className="teleprompter-stage" ref={stageRef} tabIndex={0} aria-label="Teleprompter reading stage" onScroll={() => playback !== "playing" && updateStageProgress()} onWheel={() => playback === "playing" && setPlayback("paused")}>
          {guideVisible ? <div className="teleprompter-guide" aria-hidden="true"/> : null}
          {playback === "countdown" ? <div className="teleprompter-countdown" aria-live="assertive">{countdown}</div> : null}
          <div className={mirrored ? "teleprompter-script mirrored" : "teleprompter-script"} style={{ fontSize: `${fontSize}px`, lineHeight, width: `${columnWidth}%`, textAlign }}>
            {script || "Enter a script to begin."}
          </div>
        </div>

        <div className="teleprompter-preview-status">
          <div className="teleprompter-progress-track" role="progressbar" aria-label="Script progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }}/>
          </div>
          <span>{progress}% · about {formatTeleprompterClock(remainingSeconds)} remaining</span>
        </div>

        <div className="teleprompter-controls">
          <button type="button" className="primary-button" onClick={startOrToggle} disabled={!script.trim()}>
            {playback === "playing" ? <Pause size={18} aria-hidden="true"/> : <Play size={18} aria-hidden="true"/>}
            {playbackLabel}
          </button>
          <button type="button" className="secondary-button" onClick={reset}>
            <RotateCcw size={17} aria-hidden="true"/> Reset
          </button>
          <button type="button" className="secondary-button" onClick={() => void toggleFullscreen()}>
            <Expand size={17} aria-hidden="true"/> {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <span>Space play/pause · ↑/↓ speed · R reset · M mirror · F fullscreen</span>
        </div>
      </div>
    </div>);
}
