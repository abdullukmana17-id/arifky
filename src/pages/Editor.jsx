import { useRef, useState, useEffect } from "react";
import Textarea from "../components/Textarea";
import Tajwid from "../hooks/Tajwid";
import TutorialOverlay from "./TutorialOverlay"; // sesuaikan path import ini dengan lokasi file di proyekmu

import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";

const TUTORIAL_STORAGE_KEY = "editor_tutorial_seen";

const tutorialSteps = [
    {
        target: '[data-tutorial="editor-input"]',
        title: "Masukkan Teks Arab",
        description:
            "Tulis atau tempel ayat Arab di panel ini. Karakter non-Arab akan otomatis disaring agar teks tetap bersih.",
    },
    {
        target: '[data-tutorial="editor-result"]',
        title: "Hasil Deteksi Tajwid",
        description:
            "Hasil analisis muncul di sini, dengan setiap hukum tajwid ditandai warna berbeda agar mudah dibedakan.",
    },
    {
        target: '[data-tutorial="btn-paste"]',
        title: "Tempel dari Clipboard",
        description:
            "Klik tombol ini untuk menempelkan teks Arab yang sudah kamu salin dari sumber lain.",
    },
    {
        target: '[data-tutorial="btn-example"]',
        title: "Coba Contoh Teks",
        description:
            "Belum punya teks sendiri? Gunakan contoh ayat ini untuk melihat cara kerja deteksi tajwid.",
    },
    {
        target: '[data-tutorial="mobile-toggle"]',
        title: "Ganti Tampilan",
        description:
            "Pada layar kecil, gunakan tombol Input dan Hasil Deteksi ini untuk berpindah antara mengetik teks dan melihat hasilnya.",
    },
];

const readClipboard = async () => {
    if (Capacitor.isNativePlatform()) {
        const { value } = await Clipboard.read();
        return value;
    }

    return await navigator.clipboard.readText();
};

export default function Editor() {
    const containerRef = useRef(null);

    const [leftWidth, setLeftWidth] = useState(50);
    const [text, setText] = useState("");
    const [mode, setMode] = useState("input");
    const [showTutorial, setShowTutorial] = useState(false);

    // Tampilkan tutorial otomatis saat kunjungan pertama
    useEffect(() => {
        const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (!seen) {
            const t = setTimeout(() => setShowTutorial(true), 500);
            return () => clearTimeout(t);
        }
    }, []);

    const closeTutorial = () => {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
        setShowTutorial(false);
    };

    // Pastikan panel yang relevan sedang tampil (khusus layar kecil)
    // sebelum overlay menyorotnya.
    const handleTutorialStepChange = (index, step) => {
        if (step.target === '[data-tutorial="editor-input"]') {
            setMode("input");
        } else if (step.target === '[data-tutorial="editor-result"]') {
            setMode("result");
        }
    };

    function onlyArabic(text) {
        return text.replace(
            /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g,
            ""
        );
    }

    const handleMouseDown = () => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            let newWidth =
                ((e.clientX - rect.left) / rect.width) * 100;

            // batas minimum dan maksimum panel kiri
            newWidth = Math.max(20, Math.min(80, newWidth));

            setLeftWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    };

    function handleChange(e) {
        const arabicText = onlyArabic(e.target.value);

        setText(arabicText);
    }

    const handlePaste = async () => {
        try {
            const clipboardText = await readClipboard();

            const arabicText = onlyArabic(clipboardText);

            if (!arabicText.trim()) {
                alert("Clipboard tidak berisi teks Arab");
                return;
            }

            setText((prev) =>
                prev
                    ? prev + "\n" + arabicText
                    : arabicText
            );

        } catch (err) {
            console.error("Clipboard Error:", err);

            alert(
                err?.message ||
                JSON.stringify(err) ||
                "Gagal membaca clipboard"
            );
        }
    };

    const handlePasteEvent = (e) => {
        e.preventDefault();

        const pastedText = e.clipboardData.getData("text");

        const arabicText = onlyArabic(pastedText);

        if (!arabicText.trim()) {
            return;
        }

        setText((prev) =>
            prev
                ? prev + "\n" + arabicText
                : arabicText
        );
    };

    const handleClear = () => {
        setText("");
    };

    const handleExampleText = () => {
        setText(
            "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ"
        );
    };

    return (
        <>
            <section className="editor py-5 min-vh-100">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 text-center">

                            <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Deteksi{" "}
                                <span className="bg-dark text-white text-nowrap px-3 rounded-3">
                                    Tajwid
                                </span>
                            </h1>

                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Masukkan teks Arab Al-Qur'an untuk mendeteksi hukum tajwid dengan <em>highlight</em> otomatis pada setiap bacaan.
                            </p>

                        </div>
                    </div>


                    <div className="row justify-content-center g-1">
                        <div className="col-11 col-md-12 px-4">

                            <div className="card border border-secondary-subtle rounded-0 shadow-sm mx-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">

                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>


                                <div className="card-body p-0">

                                    <div
                                        className="editor-split"
                                        ref={containerRef}
                                    >

                                        <div
                                            className={`editor-panel d-md-block flex-grow-1 ${mode === "result" ? "d-none" : ""}`}
                                            style={{
                                                width: `${leftWidth}%`
                                            }}
                                            data-tutorial="editor-input"
                                        >
                                            <Textarea
                                                id="quran-editor"
                                                label="Masukkan Ayat"
                                                placeholder="Masukkan teks Arab"
                                                value={text}
                                                className="font-lpmq fs-4"
                                                onChange={handleChange}
                                                onPaste={handlePasteEvent}
                                            />
                                        </div>


                                        <div
                                            className="editor-divider"
                                            onMouseDown={handleMouseDown}
                                        />


                                        <div
                                            className={`editor-panel p-3 d-md-block flex-grow-1 ${mode === "input" ? "d-none" : ""}`}
                                            style={{
                                                width: `${100 - leftWidth}%`
                                            }}
                                            data-tutorial="editor-result"
                                        >
                                            {text ? (

                                                <p
                                                    dir="rtl"
                                                    className="fs-4 text-end font-lpmq"
                                                >
                                                    <Tajwid text={text} />
                                                </p>
                                            ) : (
                                                <p className="mb-0 font-secondary">
                                                    Belum ada teks arab yang dimasukkan
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="col-11 text-center" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                            <small className="text-body-secondary">
                                Masukkan teks Arab Al-Qur'an dengan harakat untuk mendapatkan hasil deteksi tajwid yang lebih akurat.
                            </small>
                        </div>

                        <div data-aos="fade-up" data-aos-anchor-placement="bottom-bottom" className="col-9 col-sm-7 col-md-6 col-lg-4 col-xl-3 mt-3 d-flex align-items-center justify-content-center gap-2">
                            <button className="btn btn-primary btn-stylish rounded-0 w-100" onClick={handlePaste} data-tutorial="btn-paste">
                                <i className="bi bi-clipboard me-2"></i>
                                Tempel Teks
                            </button>
                        </div>
                        <div data-aos="fade-up" data-aos-anchor-placement="bottom-bottom" className="col-9 col-sm-7 col-md-6 col-lg-4 col-xl-3 mt-3 d-flex align-items-center justify-content-center gap-2">
                            <button className="btn btn-primary btn-stylish rounded-0 w-100" onClick={handleClear} disabled={!text}>
                                <i className="bi bi-trash3 me-2"></i>
                                Hapus
                            </button>
                        </div>
                        <div data-aos="fade-up" data-aos-anchor-placement="bottom-bottom" className="col-9 col-sm-7 col-md-6 col-lg-4 col-xl-3 mt-3 d-flex align-items-center justify-content-center gap-2">
                            <button className="btn btn-primary btn-stylish rounded-0 w-100" onClick={handleExampleText} data-tutorial="btn-example">
                                <i className="bi bi-file-earmark-text me-2"></i>
                                Contoh Teks
                            </button>
                        </div>
                    </div>

                </div>
            </section>
            <section className="py-2 editor position-sticky bottom-0 d-lg-none border-top bg-body" data-tutorial="mobile-toggle">
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex align-items-center justify-content-center gap-2">
                            <button
                                className={`btn rounded-0 ${mode === "input"
                                    ? "btn-primary"
                                    : "btn-outline-dark"
                                    }`}
                                onClick={() => setMode("input")}
                            >
                                Input
                            </button>


                            <button
                                className={`btn rounded-0 ${mode === "result"
                                    ? "btn-primary"
                                    : "btn-outline-dark"
                                    }`}
                                onClick={() => setMode("result")}
                            >
                                Hasil Deteksi
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tombol bantuan mengambang untuk memutar ulang tutorial kapan saja */}
            <button
                type="button"
                className="btn btn-dark rounded-circle position-fixed d-flex align-items-center justify-content-center"
                style={{ bottom: 80, right: 24, width: 48, height: 48, zIndex: 1500, fontWeight: "bold" }}
                onClick={() => setShowTutorial(true)}
                aria-label="Bantuan / Tutorial"
                title="Lihat tutorial"
            >
                ?
            </button>

            <TutorialOverlay
                steps={tutorialSteps}
                open={showTutorial}
                onClose={closeTutorial}
                onStepChange={handleTutorialStepChange}
            />
        </>
    );
}