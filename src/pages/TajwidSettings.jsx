import { useState } from "react";
import Textarea from "../components/Textarea";
import {
    defaultTajwidColors,
    getTajwidColors,
    saveTajwidColors,
    resetTajwidColors,
} from "../hooks/TajwidColors";
import Tajwid from "../hooks/Tajwid";

const defaultSampleText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ مِنْ بَعْدِ مَا جَاءَهُمُ الْعِلْمُ";

function rgbToHex({ r, g, b }) {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    return (
        "#" +
        [clamp(r), clamp(g), clamp(b)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")
    );
}

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

export default function TajwidSettings() {
    const [colors, setColors] = useState(getTajwidColors());
    const [saved, setSaved] = useState(false);
    const [previewText, setPreviewText] = useState(defaultSampleText);

    const updateColor = (name, hex) => {
        const { r, g, b } = hexToRgb(hex);
        setColors((prev) => ({
            ...prev,
            [name]: { ...prev[name], r, g, b },
        }));
        setSaved(false);
    };

    const updateAlpha = (name, alpha) => {
        setColors((prev) => ({
            ...prev,
            [name]: { ...prev[name], alpha: parseFloat(alpha) },
        }));
        setSaved(false);
    };

    const handleSave = () => {
        saveTajwidColors(colors);
        setSaved(true);
    };

    const handleResetAll = () => {
        resetTajwidColors();
        setColors(getTajwidColors());
        setSaved(false);
    };

    const handleResetOne = (name) => {
        setColors((prev) => ({
            ...prev,
            [name]: { ...defaultTajwidColors[name] },
        }));
        setSaved(false);
    };

    return (
        <section className="editor tajwid-settings py-5 min-vh-100">
            <div className="container">

                <div className="row justify-content-center">
                    <div className="col-11 col-sm-10 text-center">
                        <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                            Atur Warna{" "}
                            <span className="bg-dark text-white text-nowrap px-3 rounded-3">
                                Tajwid
                            </span>
                        </h1>

                        <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                            Sesuaikan warna penanda untuk setiap hukum tajwid sesuai selera Anda. Perubahan baru tersimpan permanen setelah menekan tombol "Simpan Perubahan".
                        </p>
                    </div>
                </div>

                {/* Pratinjau langsung, memakai draft warna (belum tentu tersimpan) */}
                <div className="row justify-content-center g-1">
                    <div className="col-11 col-md-12 px-4">
                        <div
                            className="card border border-secondary-subtle rounded-0 shadow-sm mx-2"
                            data-aos="fade-up"
                            data-aos-anchor-placement="bottom-bottom"
                        >
                            <div className="corner top left"></div>
                            <div className="corner top right"></div>
                            <div className="corner bottom left"></div>
                            <div className="corner bottom right"></div>

                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                    <h3 className="h5 mb-0">Pratinjau</h3>
                                    {previewText !== defaultSampleText && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-dark rounded-0"
                                            onClick={() => setPreviewText(defaultSampleText)}
                                        >
                                            Gunakan Teks Contoh
                                        </button>
                                    )}
                                </div>

                                <p className="fs-2 font-lpmq text-end mb-4" dir="rtl" lang="ar">
                                    {previewText.trim() ? (
                                        <Tajwid text={previewText} colorOverrides={colors} />
                                    ) : (
                                        <span className="font-secondary text-body-secondary fs-6">
                                            Tulis atau tempel teks Arab di bawah untuk melihat pratinjau.
                                        </span>
                                    )}
                                </p>

                                <Textarea
                                    id="preview-text"
                                    label="Teks pratinjau (bisa diganti)"
                                    placeholder="Tulis atau tempel ayat/teks Arab di sini..."
                                    value={previewText}
                                    className="font-lpmq fs-4"
                                    dir="rtl"
                                    onChange={(e) => setPreviewText(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daftar hukum tajwid & pengaturan warnanya */}
                <div className="row justify-content-center g-1 mt-1">
                    <div className="col-11 col-md-12 px-4 d-flex flex-column gap-3">
                        {Object.keys(defaultTajwidColors).map((name) => {
                            const value = colors[name] || defaultTajwidColors[name];
                            return (
                                <div
                                    key={name}
                                    className="card border border-secondary-subtle rounded-0 shadow-sm mx-2"
                                    style={{
                                        borderLeft: `8px solid rgb(${value.r}, ${value.g}, ${value.b})`,
                                    }}
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="bottom-bottom"
                                >
                                    <div className="corner top left"></div>
                                    <div className="corner top right"></div>
                                    <div className="corner bottom left"></div>
                                    <div className="corner bottom right"></div>

                                    <div className="card-body d-flex flex-wrap align-items-center gap-3">
                                        <div className="flex-grow-1" style={{ minWidth: 160 }}>
                                            <h3 className="h6 mb-0 font-secondary">{name}</h3>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <label className="small font-secondary text-muted mb-0" htmlFor={`color-${name}`}>
                                                Warna
                                            </label>
                                            <input
                                                id={`color-${name}`}
                                                type="color"
                                                className="form-control form-control-color"
                                                value={rgbToHex(value)}
                                                onChange={(e) => updateColor(name, e.target.value)}
                                                title={`Pilih warna untuk ${name}`}
                                            />
                                        </div>

                                        <div className="d-flex align-items-center gap-2" style={{ minWidth: 200 }}>
                                            <label className="small font-secondary text-muted mb-0" htmlFor={`alpha-${name}`}>
                                                Opacity latar
                                            </label>
                                            <input
                                                id={`alpha-${name}`}
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max="0.5"
                                                step="0.01"
                                                value={value.alpha}
                                                onChange={(e) => updateAlpha(name, e.target.value)}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary rounded-0"
                                            onClick={() => handleResetOne(name)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div
                        className="col-9 col-sm-7 col-md-6 col-lg-4 col-xl-3 mt-4 d-flex align-items-center justify-content-center gap-2"
                        data-aos="fade-up"
                        data-aos-anchor-placement="bottom-bottom"
                    >
                        <button type="button" className="btn btn-primary btn-stylish rounded-0 w-100" onClick={handleSave}>
                            <i className="bi bi-check2-circle me-2"></i>
                            Simpan Perubahan
                        </button>
                    </div>

                    <div
                        className="col-9 col-sm-7 col-md-6 col-lg-4 col-xl-3 mt-4 d-flex align-items-center justify-content-center gap-2"
                        data-aos="fade-up"
                        data-aos-anchor-placement="bottom-bottom"
                    >
                        <button type="button" className="btn btn-primary btn-stylish rounded-0 w-100" onClick={handleResetAll}>
                            <i className="bi bi-arrow-counterclockwise me-2"></i>
                            Reset Semua ke Default
                        </button>
                    </div>

                    {saved && (
                        <div className="col-11 text-center mt-2">
                            <small className="text-success font-secondary">Tersimpan!</small>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}