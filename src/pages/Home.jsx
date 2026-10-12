import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TutorialOverlay from "./TutorialOverlay"; // sesuaikan path import ini dengan lokasi file di proyekmu

const TUTORIAL_STORAGE_KEY = "tajwid_tutorial_seen";

const tutorialSteps = [
    {
        target: '[data-tutorial="cta-tajwid"]',
        title: "Mulai Deteksi Tajwid",
        description:
            "Klik tombol ini untuk langsung mencoba fitur deteksi hukum tajwid secara otomatis pada teks Al-Qur'an.",
    },
    {
        target: '[data-tutorial="cta-quran"]',
        title: "Baca Al-Qur'an",
        description:
            "Buka halaman Al-Qur'an lengkap, di mana hukum tajwid ditandai langsung dengan warna pada setiap ayat.",
    },
    {
        target: '[data-tutorial="tajwid-cards"]',
        title: "Pelajari Hukum Tajwid",
        description:
            "Lihat ringkasan hukum-hukum tajwid yang saat ini didukung oleh sistem deteksi dan highlight aplikasi.",
    },
];

export default function Home() {
    const [showTutorial, setShowTutorial] = useState(false);

    // Tampilkan otomatis saat kunjungan pertama
    useEffect(() => {
        const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (!seen) {
            // beri sedikit jeda agar layout & AOS selesai render dulu
            const t = setTimeout(() => setShowTutorial(true), 500);
            return () => clearTimeout(t);
        }
    }, []);

    const closeTutorial = () => {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
        setShowTutorial(false);
    };

    return (
        <>
            <section className="py-5 home">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11">
                            <h1 className="display-1" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Deteksi <span className="bg-dark text-white text-nowrap px-3 rounded-3">Tajwid</span>
                                Secara Otomatis
                            </h1>

                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Teknologi yang membantu mengenali hukum tajwid melalui penandaan warna sehingga membaca Al-Qur'an menjadi lebih mudah dipahami.
                            </p>

                            <div className="w-100 d-flex gap-1 flex-wrap">
                                <NavLink
                                    to="/tajwid"
                                    className="btn btn-lg btn-dark"
                                    data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                                    data-tutorial="cta-tajwid"
                                >
                                    Coba Sekarang
                                </NavLink>
                                <NavLink
                                    to="/quran"
                                    className="btn btn-lg btn-primary"
                                    data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                                    data-tutorial="cta-quran"
                                >
                                    Quran
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 border-top home overflow-hidden">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 text-center">
                            <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Hukum <span className="bg-dark text-white text-nowrap px-3 rounded-3">Tajwid</span>
                            </h1>
                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                beberapa hukum tajwid yang saat ini didukung oleh fitur deteksi dan <em>highlight</em> pada aplikasi.
                            </p>
                        </div>
                    </div>
                    <div
                        className="row justify-content-center mt-5 g-5"
                        data-tutorial="tajwid-cards"
                    >

                        {/* Izhar Halqi */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(179, 74, 0)" }}
                                data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(179, 74, 0)" }}
                                    >
                                        Izhar Halqi
                                    </h3>

                                    <p className="mb-0">
                                        Apabila nun sukun <span className="font-lpmq fs-5">نْ</span>
                                        atau tanwin (<span className="font-lpmq fs-5">ً ٍ ٌ</span>)
                                        bertemu dengan huruf
                                        <span className="font-lpmq fs-5"> ء هـ ع ح غ خ</span>,
                                        maka dibaca jelas tanpa dengung.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Idgham Bighunnah */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(0, 128, 0)" }}
                                data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(0, 128, 0)" }}
                                    >
                                        Idgham Bighunnah
                                    </h3>

                                    <p className="mb-0">
                                        Apabila nun sukun (<span className="font-lpmq fs-5">نْ</span>)
                                        atau tanwin (<span className="font-lpmq fs-5">ً ٍ ٌ</span>)
                                        bertemu dengan huruf
                                        <span className="font-lpmq fs-5"> ي ن م و</span>,
                                        maka dibaca melebur disertai dengung selama 2–3 harakat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Idgham Bilaghunnah */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(0, 102, 153)" }}
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(0, 102, 153)" }}
                                    >
                                        Idgham Bilaghunnah
                                    </h3>

                                    <p className="mb-0">
                                        Apabila nun sukun (
                                        <span className="font-lpmq fs-5">نْ</span>
                                        ) atau tanwin (
                                        <span className="font-lpmq fs-5">ً ٍ ٌ</span>
                                        ) bertemu dengan huruf
                                        <span className="font-lpmq fs-5"> ل ر</span>,
                                        maka dibaca melebur ke dalam huruf berikutnya
                                        <strong> tanpa dengung</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ikhfa Haqiqi */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(189, 15, 30)" }}
                                data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(189, 15, 30)" }}
                                    >
                                        Ikhfa Haqiqi
                                    </h3>

                                    <p className="mb-0">
                                        Apabila nun sukun (<span className="font-lpmq fs-5">نْ</span>)
                                        atau tanwin (<span className="font-lpmq fs-5">ً ٍ ٌ</span>)
                                        bertemu dengan huruf
                                        <span className="font-lpmq fs-5">
                                            {" "}
                                            ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
                                        </span>
                                        , maka dibaca samar dengan dengung selama 2–3 harakat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Iqlab */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(0, 128, 128)" }}
                                data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(0, 128, 128)" }}
                                    >
                                        Iqlab
                                    </h3>

                                    <p className="mb-0">
                                        Apabila nun sukun (<span className="font-lpmq fs-5">نْ</span>)
                                        atau tanwin (<span className="font-lpmq fs-5">ً ٍ ٌ</span>)
                                        bertemu huruf <span className="font-lpmq fs-5">ب</span>,
                                        maka bunyi nun berubah menjadi mim (
                                        <span className="font-lpmq fs-5">م</span>) dan dibaca
                                        berdengung selama 2–3 harakat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mad Thabi'i */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(129, 0, 194)" }}
                                data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(129, 0, 194)" }}
                                    >
                                        Mad Thabi'i
                                    </h3>

                                    <p className="mb-0">
                                        Mad asli yang terdapat dalam satu kata dan dibaca
                                        sepanjang <strong>2 harakat (1 alif)</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gunnah */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(230, 126, 34)" }}
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(230, 126, 34)" }}
                                    >
                                        Gunnah
                                    </h3>

                                    <p className="mb-0">
                                        Apabila terdapat huruf nun atau mim bertasydid
                                        (<span className="font-lpmq fs-5">نّ مّ</span>),
                                        maka dibaca dengan dengung selama
                                        <strong> 2 harakat</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ikhfa Syafawi */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(128, 0, 128)" }}
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(128, 0, 128)" }}
                                    >
                                        Ikhfa Syafawi
                                    </h3>

                                    <p className="mb-0">
                                        Apabila mim sukun (
                                        <span className="font-lpmq fs-5">مْ</span>
                                        ) bertemu dengan huruf ba (
                                        <span className="font-lpmq fs-5">ب</span>
                                        ),
                                        maka dibaca samar disertai dengung selama
                                        <strong> 2 harakat</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mad 'Aridh Lis-Sukun */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(75, 0, 130)" }}
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(75, 0, 130)" }}
                                    >
                                        Mad 'Aridh Lis-Sukun
                                    </h3>

                                    <p className="mb-0">
                                        Mad yang terjadi ketika huruf mad (
                                        <span className="font-lpmq fs-5">ا و ي</span>
                                        ) bertemu dengan huruf yang menjadi sukun karena
                                        <strong> waqaf (berhenti)</strong>. Bacaan dapat dipanjangkan
                                        <strong> 2, 4, atau 6 harakat</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Idgham Mimi */}
                        <div className="col-11 col-md-6">
                            <div
                                className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                style={{ borderLeft: "8px solid rgb(0, 128, 128)" }}
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                <div className="corner top left"></div>
                                <div className="corner top right"></div>
                                <div className="corner bottom left"></div>
                                <div className="corner bottom right"></div>

                                <div className="card-body">
                                    <h3
                                        className="mb-3"
                                        style={{ color: "rgb(0, 128, 128)" }}
                                    >
                                        Idgham Mimi
                                    </h3>

                                    <p className="mb-0">
                                        Apabila mim sukun (
                                        <span className="font-lpmq fs-5">مْ</span>
                                        ) bertemu dengan huruf mim (
                                        <span className="font-lpmq fs-5">م</span>
                                        ),
                                        maka mim sukun dilebur ke dalam mim berikutnya
                                        dan dibaca dengan <strong>dengung selama 2 harakat</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

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