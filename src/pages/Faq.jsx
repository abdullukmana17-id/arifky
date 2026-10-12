import { useState } from "react";
import { NavLink } from "react-router-dom";

const faqs = [
    {
        question: "Apa itu tajwid dan kenapa penting?",
        answer:
            "Tajwid adalah ilmu tentang cara membaca Al-Qur'an dengan benar sesuai kaidah pengucapan huruf dan hukum bacaannya. Menerapkan tajwid membantu menjaga makna ayat tidak berubah akibat kesalahan pelafalan.",
    },
    {
        question: "Bagaimana aplikasi ini mendeteksi hukum tajwid?",
        answer:
            "Aplikasi memindai teks Arab yang kamu masukkan menggunakan pola pencocokan huruf dan harakat untuk setiap hukum tajwid, lalu menandai bagian yang cocok dengan warna berbeda sehingga mudah dikenali sekaligus diberi keterangan saat disentuh atau di-hover.",
    },
    {
        question: "Hukum tajwid apa saja yang didukung saat ini?",
        answer:
            "Saat ini didukung Izhar Halqi, Idgham Bighunnah, Idgham Bilaghunnah, Iqlab, Ikhfa Haqiqi, Mad Thabi'i, Ghunnah, Ikhfa Syafawi, Mad 'Aridh Lis-Sukun, dan Idgham Mimi. Ringkasannya bisa dilihat di halaman utama.",
    },
    {
        question: "Apakah warna penanda tiap hukum tajwid bisa diubah?",
        answer:
            "Bisa. Buka halaman Atur Warna Tajwid untuk memilih warna dan opacity latar sesuai selera, lengkap dengan pratinjau langsung sebelum disimpan.",
    },
    {
        question: "Kenapa hasil deteksi kurang akurat pada teks tertentu?",
        answer:
            "Deteksi tajwid sangat bergantung pada harakat (tanda baca) yang lengkap dan benar. Teks tanpa harakat, atau dengan harakat yang tidak standar, bisa membuat beberapa hukum tajwid tidak terdeteksi atau salah ditandai.",
    },
    {
        question: "Bagaimana cara menempelkan teks dari clipboard?",
        answer:
            "Salin teks Arab dari sumber mana pun, lalu di halaman Editor tekan tombol Tempel Teks, atau langsung tempel (Ctrl+V) di kotak input. Karakter non-Arab akan otomatis disaring.",
    },
    {
        question: "Apakah aplikasi ini bisa memutar bacaan Al-Qur'an?",
        answer:
            "Ya. Buka sebuah surah dari halaman Quran, lalu tekan tombol putar pada ayat yang diinginkan. Ayat berikutnya akan diputar otomatis secara berurutan.",
    },
    {
        question: "Apakah aplikasi ini bisa dipakai tanpa koneksi internet?",
        answer:
            "Deteksi tajwid pada teks yang kamu masukkan sendiri berjalan sepenuhnya di perangkat. Namun fitur yang mengambil data seperti daftar surah, teks ayat, dan audio murottal tetap memerlukan koneksi internet.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <>
            <section className="faq py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 text-center">
                            <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Pertanyaan{" "}
                                <span className="bg-dark text-white text-nowrap px-3 rounded-3">
                                    Umum
                                </span>
                            </h1>

                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Jawaban singkat untuk pertanyaan yang paling sering diajukan seputar deteksi tajwid, cara pakai, dan fitur aplikasi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq pb-5 overflow-hidden">
                <div className="container">
                    <div className="row justify-content-center g-3">
                        {faqs.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div className="col-11 col-md-12 px-4" key={item.question}>
                                    <div
                                        className={`card border rounded-0 shadow-sm mx-2 ${
                                            isOpen ? "border-dark" : "border-secondary-subtle"
                                        }`}
                                    >
                                        <div className="corner top left"></div>
                                        <div className="corner top right"></div>
                                        <div className="corner bottom left"></div>
                                        <div className="corner bottom right"></div>

                                        <div className="card-body">
                                            <button
                                                type="button"
                                                className="btn w-100 text-start d-flex align-items-center justify-content-between gap-3 p-0 border-0 bg-transparent"
                                                onClick={() => toggle(index)}
                                                aria-expanded={isOpen}
                                            >
                                                <h3 className="h6 mb-0 font-secondary">
                                                    {item.question}
                                                </h3>
                                                <i
                                                    className={`bi ${
                                                        isOpen ? "bi-dash-lg" : "bi-plus-lg"
                                                    } fs-5 flex-shrink-0`}
                                                ></i>
                                            </button>

                                            {isOpen && (
                                                <div className="pt-3 mt-3 border-top">
                                                    <p className="mb-0">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="row justify-content-center mt-5">
                        <div className="col-11 col-sm-10 text-center" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                            <p className="fs-5 mb-3">
                                Masih punya pertanyaan lain? Coba langsung fitur deteksi tajwidnya.
                            </p>

                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <NavLink to="/tajwid" className="btn btn-lg btn-dark">
                                    Coba Deteksi Tajwid
                                </NavLink>
                                <NavLink to="/settings/tajwid" className="btn btn-lg btn-primary">
                                    Atur Warna Tajwid
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}