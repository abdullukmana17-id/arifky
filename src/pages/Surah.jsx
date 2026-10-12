import { useState, useEffect, useMemo } from "react";
import { SurahService } from "../services/surah.services";
import Input from "../components/Input";
import { NavLink } from "react-router-dom";
import TutorialOverlay from "./TutorialOverlay";

const TUTORIAL_STORAGE_KEY = "surah_tutorial_seen";

const tutorialSteps = [
    {
        target: '[data-tutorial="search-surah"]',
        title: "Cari Surah",
        description:
            "Ketik nama surah, arti, atau nomor surah di sini untuk langsung menemukan surah yang kamu cari.",
    },
    {
        target: '[data-tutorial="surah-list"]',
        title: "Daftar Surah",
        description:
            "Semua surah Al-Qur'an ditampilkan di sini lengkap dengan jumlah ayat dan tempat turunnya.",
    },
    {
        target: '[data-tutorial="read-surah"]',
        title: "Mulai Membaca",
        description:
            "Klik tombol ini untuk membaca surah dengan fitur deteksi dan highlight hukum tajwid secara otomatis.",
    },
];

export default function Surah() {

    const [surahs, setSurahs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {

        async function load() {
            try {
                const data = await SurahService.getAll();
                setSurahs(data);
            } catch (err) {
                console.error(err);
            }
        }

        load();

    }, []);

    // Tampilkan otomatis saat kunjungan pertama, setelah daftar surah dimuat
    useEffect(() => {
        if (surahs.length === 0) return;
        const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (!seen) {
            const t = setTimeout(() => setShowTutorial(true), 500);
            return () => clearTimeout(t);
        }
    }, [surahs]);

    const closeTutorial = () => {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
        setShowTutorial(false);
    };

    const filteredSurahs = useMemo(() => {

        const q = keyword.toLowerCase().trim();

        if (!q) return surahs;

        return surahs.filter((surah) =>
            surah.namaLatin.toLowerCase().includes(q) ||
            surah.arti.toLowerCase().includes(q) ||
            surah.nomor.toString().includes(q)
        );

    }, [keyword, surahs]);

    return (
        <>
            <section className="surah py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 text-center">
                            <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Daftar <span className="bg-dark text-white text-nowrap px-3 rounded-3">Surah</span>
                            </h1>

                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Pilih salah satu surah Al-Qur'an untuk mulai membaca dengan fitur
                                deteksi dan <em>highlight</em> hukum tajwid.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-3 position-sticky top-0 z-3 bg-body surah">
                <div className="container">
                    <div className="row justify-content-center">
                        <div
                            className="col-11 col-md-12"
                            data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            data-tutorial="search-surah"
                        >
                            <Input
                                id="search-surah"
                                label="Cari Surah"
                                placeholder="Nama surah, arti, atau nomor"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="surah pt-3 pb-5 overflow-hidden">
                <div className="container">
                    <div className="row g-5 justify-content-center" data-tutorial="surah-list">
                        {filteredSurahs.map((surah, index) => (
                            <div className="col-11 col-md-12 px-4" key={surah.nomor}>
                                <div
                                    data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                                    className="card border border-secondary-subtle rounded-0 h-100 shadow-sm mx-2"
                                >
                                    <div className="corner top left"></div>
                                    <div className="corner top right"></div>
                                    <div className="corner bottom left"></div>
                                    <div className="corner bottom right"></div>

                                    <div className="card-body">
                                        <h3
                                            className="mb-3"
                                        >
                                            <span className="bg-dark px-2 text-white me-1 fs-4">{surah.nomor}</span>
                                            {surah.namaLatin}
                                        </h3>

                                        <p tabIndex={0} className="description" dangerouslySetInnerHTML={{ __html: surah.deskripsi }} />
                                        <p className="mb-0 text-muted">
                                            <span className="badge border rounded-0 text-body">{surah.jumlahAyat} Ayat</span>
                                            <span className="badge border rounded-0 text-body ms-1">Turun di {surah.tempatTurun}</span>
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0 pb-3">
                                        <NavLink
                                            to={`/surahs/${surah.nomor}`}
                                            className="btn btn-primary ms-2 rounded-0"
                                            {...(index === 0 ? { "data-tutorial": "read-surah" } : {})}
                                        >
                                            Baca Sekarang
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tombol bantuan mengambang untuk memutar ulang tutorial kapan saja */}
            <button
                type="button"
                className="btn btn-dark rounded-circle position-fixed d-flex align-items-center justify-content-center"
                style={{ bottom: 24, right: 24, width: 48, height: 48, zIndex: 1500, fontWeight: "bold" }}
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
            />
        </>
    )
}