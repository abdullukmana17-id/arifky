import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { SurahService } from "../services/surah.services";
import Tajwid from "../hooks/Tajwid";

export default function Ayah() {
    const { nomor } = useParams();

    const [surah, setSurah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedAyat, setCopiedAyat] = useState(null);

    const audioRef = useRef(new Audio());

    // index ayat yang sedang diputar
    const [currentIndex, setCurrentIndex] = useState(-1);

    // ref setiap ayat
    const ayatRefs = useRef({});

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const data = await SurahService.getById(nomor);

                setSurah(data);
                setCurrentIndex(-1);

                audioRef.current.pause();
                audioRef.current.src = "";
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();

        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, [nomor]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            const nextIndex = currentIndex + 1;

            if (surah && nextIndex < surah.ayat.length) {
                playIndex(nextIndex);
            } else {
                setCurrentIndex(-1);
            }
        };

        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentIndex, surah]);

    async function copyArabicText(ayat) {
        try {
            await navigator.clipboard.writeText(ayat.teksArab);

            setCopiedAyat(ayat.nomorAyat);

            setTimeout(() => {
                setCopiedAyat((prev) =>
                    prev === ayat.nomorAyat ? null : prev
                );
            }, 2000);
        } catch (err) {
            console.error(err);
            alert("Gagal menyalin teks.");
        }
    }

    async function playIndex(index) {
        if (!surah) return;

        const ayat = surah.ayat[index];

        if (!ayat) {
            setCurrentIndex(-1);
            return;
        }

        const audio = audioRef.current;

        audio.pause();

        audio.src = ayat.audio["02"];
        audio.currentTime = 0;

        try {
            await audio.play();

            setCurrentIndex(index);

            ayatRefs.current[ayat.nomorAyat]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (err) {
            console.error(err);
        }
    }

    function playAyat(index) {
        if (currentIndex === index) {
            audioRef.current.pause();
            setCurrentIndex(-1);
            return;
        }

        playIndex(index);
    }

    if (loading) {
        return (
            <section className="ayah py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 text-center">

                            <h1 className="display-3">
                                Memuat Surah
                            </h1>

                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!surah) {
        return (
            <section className="ayah py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 text-center">

                            <h1 className="display-3">
                                Surah tidak ditemukan
                            </h1>
                            <NavLink
                                to="/quran"
                                className="btn btn-primary rounded-0 mt-3"
                            >
                                Kembali
                            </NavLink>

                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="ayah py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 text-center">

                            <h1 className="display-3" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                {surah.namaLatin}
                            </h1>

                            <p className="mb-0" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                <span className="badge border rounded-0 text-body">
                                    {surah.arti}
                                </span>

                                <span className="badge border rounded-0 text-body ms-2">
                                    {surah.jumlahAyat} Ayat
                                </span>

                                <span className="badge border rounded-0 text-body ms-2">
                                    {surah.tempatTurun}
                                </span>
                            </p>

                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-5 surah">
                <div className="container">

                    <div className="row justify-content-center g-4">

                        {surah.ayat.map((ayat, index) => (

                            <div
                                key={ayat.nomorAyat}
                                className="col-12"
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                                ref={(el) => {
                                    ayatRefs.current[ayat.nomorAyat] = el;
                                }}
                            >

                                <div
                                    className={`card border rounded-0 h-100 mx-2 ${currentIndex === index
                                            ? "border-success shadow"
                                            : "border-secondary-subtle shadow-sm"
                                        }`}
                                >

                                    <div className="corner top left"></div>
                                    <div className="corner top right"></div>
                                    <div className="corner bottom left"></div>
                                    <div className="corner bottom right"></div>

                                    <div className="card-header d-flex align-items-center gap-2 bg-light-subtle">
                                        <span className="badge bg-dark rounded-0 fs-4">
                                            {ayat.nomorAyat}
                                        </span>

                                        <button
                                            className={`btn rounded-0 h-100 d-flex align-items-center display-6 ${currentIndex === index
                                                ? "btn-danger"
                                                : "btn-primary"
                                                }`}
                                            onClick={() => playAyat(index)}
                                        >
                                            <i
                                                className={`bi ${currentIndex === index
                                                    ? "bi-stop-fill"
                                                    : "bi-play-fill"
                                                    }`}
                                            />
                                        </button>
                                        <button
                                            className={`btn rounded-0 h-100 d-flex align-items-center display-6 ms-auto btn-dark`}
                                            onClick={() => copyArabicText(ayat)}
                                            title="Salin teks Arab"
                                        >
                                            <i
                                                className={`bi me-2 ${copiedAyat === ayat.nomorAyat
                                                    ? "bi-check-lg"
                                                    : "bi-copy"
                                                    }`}
                                            />
                                            Salin Teks Arab
                                        </button>
                                    </div>
                                    <div className="card-body">

                                        <p
                                            dir="rtl"
                                            className="fs-2 text-end font-lpmq"
                                        >
                                            <Tajwid text={ayat.teksArab} />
                                        </p>

                                        <p className="fw-semibold">
                                            {ayat.teksLatin}
                                        </p>

                                        <p className="mb-0">
                                            {ayat.teksIndonesia}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            </section>
        </>
    );
}