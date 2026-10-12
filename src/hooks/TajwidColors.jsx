const STORAGE_KEY = "tajwid_colors";
export const TAJWID_COLORS_EVENT = "tajwid-colors-updated";

/**
 * Warna default untuk tiap hukum tajwid.
 * r, g, b: komponen warna teks/border (0-255)
 * alpha  : opacity untuk warna latar (background)
 */
export const defaultTajwidColors = {
    "Izhar Halqi": { r: 179, g: 74, b: 0, alpha: 0.1 },
    "Idgham Bigunnah": { r: 0, g: 128, b: 0, alpha: 0.1 },
    "Idgham Bilagunnah": { r: 0, g: 128, b: 0, alpha: 0.1 },
    "Iqlab": { r: 0, g: 128, b: 128, alpha: 0.1 },
    "Ikhfa": { r: 189, g: 15, b: 30, alpha: 0.1 },
    "Mad Tabi'i": { r: 129, g: 0, b: 194, alpha: 0.05 },
    "Ghunnah": { r: 0, g: 102, b: 204, alpha: 0.003 },
    "Ikhfa Syafawi": { r: 255, g: 140, b: 0, alpha: 0.003 },
    "Mad arid lissukun": { r: 129, g: 0, b: 194, alpha: 0.003 },
    "Idgham Mimi": { r: 0, g: 150, b: 136, alpha: 0.003 },
};

/**
 * Ambil warna tajwid saat ini (hasil gabungan default + kustomisasi tersimpan).
 */
export function getTajwidColors() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultTajwidColors };

        const parsed = JSON.parse(raw);
        // Gabungkan supaya hukum baru yang belum pernah dikustomisasi tetap punya default
        const merged = { ...defaultTajwidColors };
        Object.keys(parsed).forEach((name) => {
            if (merged[name]) {
                merged[name] = { ...merged[name], ...parsed[name] };
            }
        });
        return merged;
    } catch {
        return { ...defaultTajwidColors };
    }
}

/**
 * Simpan warna tajwid ke localStorage dan beri tahu komponen lain (tab yang sama)
 * agar langsung memperbarui tampilan.
 */
export function saveTajwidColors(colors) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    window.dispatchEvent(new Event(TAJWID_COLORS_EVENT));
}

/**
 * Kembalikan semua warna ke default pabrik.
 */
export function resetTajwidColors() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(TAJWID_COLORS_EVENT));
}

/**
 * Ubah objek {r,g,b,alpha} menjadi properti CSS siap pakai.
 */
export function toCss(value) {
    if (!value) return { color: undefined, backgroundColor: undefined };
    const { r, g, b, alpha } = value;
    return {
        color: `rgb(${r}, ${g}, ${b})`,
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    };
}