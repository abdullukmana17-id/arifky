import { useNavigate } from "react-router-dom";

const menuItems = [
    {
        to: "/tajwid",
        icon: "bi-magic",
        color: "rgb(0, 102, 153)",
        title: "Deteksi Tajwid",
        desc: "Coba deteksi otomatis",
    },
    {
        to: "/quran",
        icon: "bi-book",
        color: "rgb(0, 128, 0)",
        title: "Baca Al-Qur'an",
        desc: "Baca dengan highlight",
    },
    {
        to: "/settings/tajwid",
        icon: "bi-sliders",
        color: "rgb(179, 74, 0)",
        title: "Pengaturan",
        desc: "Atur hukum tajwid",
    },
    {
        to: "/faq",
        icon: "bi-question-circle",
        color: "rgb(129, 0, 194)",
        title: "FAQ",
        desc: "Pertanyaan umum",
    },
];

const quickSuggestions = [
    { label: "Apa itu ikhfa haqiqi?", to: "/faq" },
    { label: "Deteksi surah Al-Fatihah", to: "/tajwid" },
    { label: "Atur warna tajwid", to: "/settings/tajwid" },
];

export default function SplashScreen({ onFinish, userName = "" }) {
    const navigate = useNavigate();

    const goTo = (path) => {
        onFinish();
        navigate(path);
    };

    return (
        <div className="min-vh-100 bg-body d-flex flex-column splash">
            {/* Top bar */}
            <header className="py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-6 d-flex align-items-center gap-2">
                            <span
                                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-dark text-white"
                                style={{ width: 32, height: 32 }}
                            >
                                <i className="bi bi-moon-stars fs-6"></i>
                            </span>
                            <span className="fw-bold fs-5">Tajwid</span>
                        </div>
                        <div className="col-6 text-end">
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none text-body-secondary"
                                onClick={onFinish}
                            >
                                Lewati ke Beranda
                                <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="text-center mb-4">
                        <h1 className="display-6 fw-bold mb-2">
                            Selamat datang{userName ? `, ${userName}` : ""}
                        </h1>
                        <p className="text-body-secondary fs-6 mb-0">
                            Tajwid, teman belajar Al-Qur'an dengan deteksi hukum tajwid
                            otomatis untuk tugas apa pun yang kamu butuhkan.
                        </p>
                    </div>

                    {/* Menu cards */}
                    <div className="row g-2 justify-content-center mb-4">
                        {menuItems.map((item) => (
                            <div className="col-6" key={item.to}>
                                <button
                                    type="button"
                                    onClick={() => goTo(item.to)}
                                    className="btn btn-white border w-100 h-100 text-start rounded-4 p-3 d-flex flex-column gap-2 bg-body"
                                >
                                    <i
                                        className={`bi ${item.icon} fs-5`}
                                        style={{ color: item.color }}
                                    ></i>
                                    <span>
                                        <span className="d-block fw-semibold">
                                            {item.title}
                                        </span>
                                        <span className="d-block text-body-secondary small">
                                            {item.desc}
                                        </span>
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Quick suggestions */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {quickSuggestions.map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => goTo(s.to)}
                                className="btn btn-stylish rounded-0"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}