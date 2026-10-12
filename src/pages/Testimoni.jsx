import { useState, useEffect, useMemo } from "react";

// URL API spreadsheet (GET dipakai untuk mengambil data yang sudah diisi lewat Google Form)
const API_URL = "https://api.apispreadsheets.com/data/tCoLHSW1ugxnilOp/";
const API_ACCESS_KEY = "447710b26e96b6c8f69ec32ac9e65be1";
const API_SECRET_KEY = "4ae55d80b8b7140a66ec25a19db7af4e";
const GOOGLE_FORM_URL = "https://forms.gle/BMAoDbTQZ1JYC7N96";

const ratingColors = {
    5: "rgb(0, 128, 0)",
    4: "rgb(0, 102, 153)",
    3: "rgb(230, 126, 34)",
    2: "rgb(179, 74, 0)",
    1: "rgb(189, 15, 30)",
};

const ratingLabels = {
    5: "Sangat Puas",
    4: "Puas",
    3: "Cukup Puas",
    2: "Tidak Puas",
    1: "Sangat Tidak Puas",
};

// Menutupi sebagian email agar tidak ditampilkan penuh
function maskEmail(email = "") {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email || "Anonim";
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
}

// Kolom pertanyaan rating di Google Form panjang & mengandung newline,
// jadi dicari berdasarkan awalan teksnya saja supaya tidak rapuh.
function extractRatingKey(row) {
    return Object.keys(row).find((k) =>
        k.toLowerCase().trim().startsWith("seberapa puas")
    );
}

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date((value - 25569) * 86400 * 1000);

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

function normalizeRow(row, idx) {
    const ratingKey = extractRatingKey(row);
    const ratingRaw = ratingKey ? row[ratingKey] : row["Rating"];
    const rating = parseInt(String(ratingRaw).trim(), 10) || 0;

    return {
        id: idx,
        timestamp: row["Timestamp"] || "",
        nama: (row["Nama Anda"] || row["Nama"] || "").trim(),
        profesi: (row["Profesi Anda"] || row["Profesi"] || "").trim(),
        email: row["Email Address"] || row["Email"] || "",
        testimoni: (row["Testimoni Anda"] || row["Testimoni"] || "").trim(),
        rating,
    };
}

// Ubah "rgb(r, g, b)" jadi hex tanpa "#" (dipakai untuk parameter warna UI Avatars)
// supaya avatar tetap konsisten dengan palet warna rating yang sudah ada, tanpa menambah warna baru.
function rgbStringToHex(rgbString = "") {
    const match = rgbString.match(/\d+/g);
    if (!match || match.length < 3) return "6c757d"; // fallback abu-abu bootstrap
    return match
        .slice(0, 3)
        .map((n) => Number(n).toString(16).padStart(2, "0"))
        .join("");
}

// Avatar otomatis berdasarkan nama, warna latar mengikuti warna rating yang sudah ada
function getAvatarUrl(nama, rating) {
    const display = nama && nama.length > 0 ? nama : "Pengguna Anonim";
    const hex = rgbStringToHex(ratingColors[rating]);
    const params = new URLSearchParams({
        name: display,
        background: hex,
        color: "fff",
        bold: "true",
        size: "128",
    });
    return `https://ui-avatars.com/api/?${params.toString()}`;
}

function StarRating({ rating }) {
    return (
        <div className="mb-2" aria-label={`Rating ${rating} dari 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    style={{
                        color: i <= rating ? (ratingColors[rating] || "rgb(230, 126, 34)") : "#dcdcdc",
                        fontSize: "1.3rem",
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default function Testimoni() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        let isMounted = true;

        fetch(API_URL, {
            headers: {
                accessKey: API_ACCESS_KEY,
                secretKey: API_SECRET_KEY,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat data");
                return res.json();
            })
            .then((json) => {
                if (!isMounted) return;
                // apispreadsheets biasanya mengembalikan { data: [...] }
                const rows = Array.isArray(json) ? json : json.data || [];
                const normalized = rows
                    .map(normalizeRow)
                    .filter((t) => t.testimoni.length > 0);
                normalized.reverse(); // tampilkan yang terbaru lebih dulu
                setTestimonials(normalized);
                setLoading(false);
            })
            .catch(() => {
                if (!isMounted) return;
                setError(true);
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        if (activeFilter === "all") return testimonials;
        return testimonials.filter((t) => t.rating === Number(activeFilter));
    }, [testimonials, activeFilter]);

    // Ringkasan rating: rata-rata keseluruhan + jumlah per bintang untuk ditampilkan di atas
    const summary = useMemo(() => {
        const total = testimonials.length;
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        testimonials.forEach((t) => {
            if (counts[t.rating] !== undefined) counts[t.rating] += 1;
        });
        const totalBintang = testimonials.reduce((sum, t) => sum + t.rating, 0);
        const average = total > 0 ? totalBintang / total : 0;
        return { total, counts, average };
    }, [testimonials]);

    const filterOptions = [
        { value: "all", label: "Semua Rating" },
        { value: "5", label: "★★★★★ — Sangat Puas" },
        { value: "4", label: "★★★★ — Puas" },
        { value: "3", label: "★★★ — Cukup Puas" },
        { value: "2", label: "★★ — Tidak Puas" },
        { value: "1", label: "★ — Sangat Tidak Puas" },
    ];

    return (
        <>
            <section className="py-5 home">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-11 col-sm-10 text-center">
                            <h1 className="display-2" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Apa Kata <span className="bg-dark text-white text-nowrap px-3 rounded-3">Pengguna</span>
                            </h1>
                            <p className="fs-4" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                                Testimoni dari pengguna yang sudah mencoba fitur deteksi tajwid.
                            </p>

                            <a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-lg btn-dark mt-2"
                                data-aos="fade-up"
                                data-aos-anchor-placement="bottom-bottom"
                            >
                                Berikan Testimoni Anda
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 border-top home overflow-hidden">
                <div className="container">
                    {/* Ringkasan rating keseluruhan */}
                    {!loading && !error && summary.total > 0 && (
                        <div className="row justify-content-center mb-5">
                            <div className="col-11 col-lg-9">
                                <div
                                    className="card border border-secondary-subtle rounded-0 shadow-sm p-4 position-relative"
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="bottom-bottom"
                                >
                                    <div className="corner top left"></div>
                                    <div className="corner top right"></div>
                                    <div className="corner bottom left"></div>
                                    <div className="corner bottom right"></div>

                                    <div className="row align-items-center g-4">
                                        {/* Angka rata-rata + bintang */}
                                        <div className="col-12 col-md-4 text-center text-md-start">
                                            <div className="display-3 fw-bold lh-1">
                                                {summary.average.toFixed(1)}
                                            </div>
                                            <StarRating rating={Math.round(summary.average)} />
                                            <p className="text-muted mb-0">
                                                {summary.total} Testimoni
                                            </p>
                                        </div>

                                        {/* Breakdown per bintang */}
                                        <div className="col-12 col-md-8">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = summary.counts[star];
                                                const pct =
                                                    summary.total > 0
                                                        ? (count / summary.total) * 100
                                                        : 0;
                                                return (
                                                    <div
                                                        className="d-flex align-items-center gap-3 mb-2"
                                                        key={star}
                                                    >
                                                        <small
                                                            className="text-muted"
                                                            style={{ width: 14 }}
                                                        >
                                                            {star}
                                                        </small>
                                                        <span
                                                            style={{
                                                                color: ratingColors[star],
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                        <div
                                                            className="flex-grow-1"
                                                            style={{
                                                                height: 8,
                                                                background: "#eee",
                                                                borderRadius: 4,
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: `${pct}%`,
                                                                    height: "100%",
                                                                    background: ratingColors[star],
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <small
                                                            className="text-muted text-end"
                                                            style={{ width: 32 }}
                                                        >
                                                            {count}
                                                        </small>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row justify-content-center mb-4">
                        <div className="col-11 col-sm-6 col-md-4">
                            <label htmlFor="filterRating" className="form-label fw-semibold">
                                Filter berdasarkan rating
                            </label>
                            <select
                                id="filterRating"
                                className="form-select"
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                            >
                                {filterOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row justify-content-center g-5">
                        {loading && (
                            <div className="col-11 text-center">
                                <p className="fs-5">Memuat testimoni...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="col-11 text-center">
                                <p className="fs-5 text-danger">
                                    Gagal memuat testimoni. Silakan coba lagi nanti.
                                </p>
                            </div>
                        )}

                        {!loading && !error && filtered.length === 0 && (
                            <div className="col-11 text-center">
                                <p className="fs-5">Belum ada testimoni untuk filter ini.</p>
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            filtered.map((t) => (
                                <div className="col-11 col-md-6" key={t.id}>
                                    <div
                                        className="card border border-secondary-subtle rounded-0 h-100 shadow-sm"
                                        style={{ borderLeft: `8px solid ${ratingColors[t.rating] || "#999"}` }}
                                        data-aos="fade-up"
                                        data-aos-anchor-placement="bottom-bottom"
                                    >
                                        <div className="corner top left"></div>
                                        <div className="corner top right"></div>
                                        <div className="corner bottom left"></div>
                                        <div className="corner bottom right"></div>

                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <img
                                                    src={getAvatarUrl(t.nama, t.rating)}
                                                    alt={t.nama || "Pengguna Anonim"}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-circle flex-shrink-0"
                                                    style={{ objectFit: "cover" }}
                                                />
                                                <div>
                                                    <strong className="d-block">
                                                        {t.nama || "Pengguna Anonim"}
                                                    </strong>
                                                    {t.profesi && (
                                                        <small className="text-muted d-block">{t.profesi}</small>
                                                    )}
                                                </div>
                                            </div>

                                            <StarRating rating={t.rating} />
                                            <p className="mb-3 flex-grow-1">"{t.testimoni}"</p>
                                            <div className="mt-auto">
                                                <small className="text-muted d-block">
                                                    {maskEmail(t.email)}
                                                </small>
                                                {t.timestamp && (
                                                    <small className="text-muted d-block">
                                                        {formatDate(t.timestamp)}
                                                    </small>
                                                )}
                                                <small
                                                    className="fw-semibold d-block mt-1"
                                                    style={{ color: ratingColors[t.rating] || "#999" }}
                                                >
                                                    {ratingLabels[t.rating] || "Tanpa Rating"}
                                                </small>
                                            </div>
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