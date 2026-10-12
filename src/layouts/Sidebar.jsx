import Brand from "./Brand"
import Nav from "./Nav";
import {
    PrimaryToggleButton
} from "../layouts/index.jsx";

const MENUS = [
    {
        to: "/",
        title: "Beranda",
        label: (
            <>
                <i className="bi bi-folder-symlink-fill opacity-50"></i>
                <span className="ms-2">Beranda</span>
            </>
        ),
    },
    {
        to: "/quran",
        title: "Al - Qur`an",
        label: (
            <>
                <i className="bi bi-folder-symlink-fill opacity-50"></i>
                <span className="ms-2">Al - Qur`an</span>
            </>
        ),
    },
    {
        to: "/tajwid",
        title: "Highlight Tajwid",
        label: (
            <>
                <i className="bi bi-folder-symlink-fill opacity-50"></i>
                <span className="ms-2">Highlight Tajwid</span>
            </>
        ),
    },
    {
        to: "/faq",
        title: "FAQ",
        label: (
            <>
                <i className="bi bi-question-circle-fill opacity-50"></i>
                <span className="ms-2">FAQ</span>
            </>
        ),
    },
    {
        to: "/settings/tajwid",
        title: "Atur Warna Tajwid",
        label: (
            <>
                <i className="bi bi-palette-fill opacity-50"></i>
                <span className="ms-2">Atur Warna Tajwid</span>
            </>
        ),
    },
    {
        to: "/testimoni",
        title: "Testimoni",
        label: (
            <>
                <i className="bi bi-chat-quote-fill opacity-50"></i>
                <span className="ms-2">Testimoni</span>
            </>
        ),
    },
];

export default function Sidebar() {

    return (
        <>
            <div className="w-100 h-100 d-flex flex-column pt-2">
                <div className="container h-100">
                    <div className="row h-100 flex-nowrap flex-column align-items-start g-2">
                        <div className="col-12 px-0 pt-1 d-flex align-items-center justify-content-start mb-3 nav-menu">
                            <Brand />
                        </div>
                        <div className="col-12 px-0 nav-menu">
                            <Nav menus={MENUS} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}