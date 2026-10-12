import { useEffect, useRef, useState } from "react";
import { getTajwidColors, toCss, TAJWID_COLORS_EVENT } from "./TajwidColors";
const { Tooltip } = window.bootstrap;

const arabicChars = {
    alif: "\u0627",
    ba: "\u0628",
    ta: "\u062A",
    tsa: "\u062B",
    jim: "\u062C",
    ha: "\u062D",
    kho: "\u062E",
    dal: "\u062F",
    dzal: "\u0630",
    ra: "\u0631",
    zai: "\u0632",
    sin: "\u0633",
    syin: "\u0634",
    shod: "\u0635",
    dhod: "\u0636",
    tho: "\u0637",
    zho: "\u0638",
    ain: "\u0639",
    ghain: "\u063A",
    fa: "\u0641",
    qof: "\u0642",
    kaf: "\u0643",
    lam: "\u0644",
    mim: "\u0645",
    nun: "\u0646",
    waw: "\u0648",
    ha2: "\u0647",
    hamzah: "\u0621",
    ya: "\u064A",

    maddah: "\u0653",
    small_madd: "\u06E4",

    fathah: "\u064E",
    kasrah: "\u0650",
    dhammah: "\u064F",
    sukun: "\u0652",
    tasydid: "\u0651",
    tanwin_a: "\u064B",
    tanwin_i: "\u064D",
    tanwin_u: "\u064C",
    fathah_alif: "\u0649",
    fathah_superscript: "\u0670",
    kasrah_superscript: "\u0656",
    dhammah_inverted: "\u0657",

    lam_alif: "\u0644\u0627",
    ta_marbuta: "\u0629",
    alif_mad: "\u0622",
    alif_hamzah_atas: "\u0623",
    alif_hamzah_bawah: "\u0625",
    hamzah_below: "\u0655",
    waw_hamzah: "\u0624",
    ya_hamzah: "\u0626",

    space: "\u0020"
};

const arabicGroups = {
    letters: [
        arabicChars.alif,
        arabicChars.ba,
        arabicChars.ta,
        arabicChars.tsa,
        arabicChars.jim,
        arabicChars.ha,
        arabicChars.kho,
        arabicChars.dal,
        arabicChars.dzal,
        arabicChars.ra,
        arabicChars.zai,
        arabicChars.sin,
        arabicChars.syin,
        arabicChars.shod,
        arabicChars.dhod,
        arabicChars.tho,
        arabicChars.zho,
        arabicChars.ain,
        arabicChars.ghain,
        arabicChars.fa,
        arabicChars.qof,
        arabicChars.kaf,
        arabicChars.lam,
        arabicChars.mim,
        arabicChars.nun,
        arabicChars.waw,
        arabicChars.ha2,
        arabicChars.hamzah,
        arabicChars.ya,
        arabicChars.ta_marbuta
    ].join(""),

    tanwin: [
        arabicChars.tanwin_a,
        arabicChars.tanwin_i,
        arabicChars.tanwin_u
    ].join(""),

    harakat: [
        arabicChars.fathah,
        arabicChars.kasrah,
        arabicChars.dhammah,
        arabicChars.sukun,
        arabicChars.tasydid
    ].join(""),

    diacritics: [
        arabicChars.fathah,
        arabicChars.kasrah,
        arabicChars.dhammah,
        arabicChars.sukun,
        arabicChars.tasydid,
        arabicChars.tanwin_a,
        arabicChars.tanwin_i,
        arabicChars.tanwin_u,
        arabicChars.maddah,
        arabicChars.small_madd,
        arabicChars.fathah_superscript,
        arabicChars.kasrah_superscript,
        arabicChars.dhammah_inverted,
        arabicChars.hamzah_below
    ].join(""),

    idzhar: [
        arabicChars.hamzah,
        arabicChars.ha2,
        arabicChars.ain,
        arabicChars.ha,
        arabicChars.ghain,
        arabicChars.kho,
        arabicChars.alif_hamzah_bawah,
        arabicChars.alif_hamzah_atas,
        arabicChars.waw_hamzah,
        arabicChars.ya_hamzah
    ].join(""),

    idgham: {
        maal_gunnah: [
            arabicChars.ya,
            arabicChars.nun,
            arabicChars.mim,
            arabicChars.waw
        ].join(""),

        bila_gunnah: [
            arabicChars.lam,
            arabicChars.ra
        ].join(""),

        all: [
            arabicChars.ya,
            arabicChars.nun,
            arabicChars.mim,
            arabicChars.waw,
            arabicChars.lam,
            arabicChars.ra
        ].join("")
    },

    iqlab: arabicChars.ba,

    ikhfa: [
        arabicChars.ta,
        arabicChars.tsa,
        arabicChars.jim,
        arabicChars.dal,
        arabicChars.dzal,
        arabicChars.zai,
        arabicChars.sin,
        arabicChars.syin,
        arabicChars.shod,
        arabicChars.dhod,
        arabicChars.tho,
        arabicChars.zho,
        arabicChars.fa,
        arabicChars.qof,
        arabicChars.kaf
    ].join(""),

    marks: "\u0610-\u061A\u064B-\u0652\u0653-\u065F\u0670\u06D6-\u06ED",
    nonQuranicLetters: "\u06D5"
};

/**
 * Definisi pola tajwid TANPA warna — warna kini dikelola terpisah lewat
 * tajwidColors.js supaya bisa dikustomisasi pengguna.
 */
const tajwids = [
    {
        name: "Izhar Halqi",
        priority: 2,
        pattern: [
            [
                `${arabicChars.nun}${arabicChars.sukun}`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.idzhar}])`
            ].join(""),

            [
                `[${arabicGroups.letters}][${arabicGroups.tanwin}]`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.idzhar}])`
            ].join("")
        ],
        flags: "g",
        className: "idzhar"
    },
    {
        name: "Idgham Bigunnah",
        priority: 2,
        pattern: [
            [
                `${arabicChars.nun}${arabicChars.sukun}`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.idgham.maal_gunnah}])`
            ].join(""),
            [
                `[${arabicGroups.letters}][${arabicGroups.tanwin}]`,
                `${arabicChars.alif}?`,
                `(?:${arabicChars.fathah_alif})?`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.idgham.maal_gunnah}])`
            ].join("")
        ],
        flags: "g",
        className: "idgham"
    },
    {
        name: "Idgham Bilagunnah",
        priority: 2,
        pattern: [
            [
                `${arabicChars.nun}${arabicChars.sukun}`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.idgham.bila_gunnah}])`
            ].join(""),
            [
                `[${arabicGroups.letters}][${arabicGroups.tanwin}]`,
                `${arabicChars.alif}?`,
                `${arabicChars.fathah_alif}?`,
                `${arabicChars.space}?`,
                `(?=[${arabicGroups.idgham.bila_gunnah}])`
            ].join("")
        ],
        flags: "g",
        className: "idgham"
    },
    {
        name: "Iqlab",
        priority: 2,
        pattern: [
            [
                `${arabicChars.nun}${arabicChars.sukun}`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.iqlab}])`
            ].join(""),
            [
                `[${arabicGroups.letters}][${arabicGroups.tanwin}]`,
                `(?:[${arabicGroups.marks}${arabicChars.space}${arabicGroups.nonQuranicLetters}]*)?`,
                `(?=[${arabicGroups.iqlab}])`
            ].join("")
        ],
        flags: "g",
        className: "iqlab"
    },
    {
        name: "Ikhfa",
        priority: 3,
        pattern: [
            [
                `${arabicChars.nun}`,
                `${arabicChars.sukun}?`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.ikhfa}])`
            ].join(""),
            [
                `[${arabicGroups.letters}][${arabicGroups.tanwin}]`,
                `${arabicChars.alif}?`,
                `(?:${arabicChars.space})?`,
                `(?=[${arabicGroups.ikhfa}])`
            ].join("")
        ],
        flags: "g",
        className: "ikhfa"
    },
    {
        name: "Mad Tabi'i",
        priority: 4,
        pattern: [
            [
                `(?<=`,
                `${arabicChars.fathah}`,
                `)`,
                `${arabicChars.alif}`,
                `(?!`,
                `${arabicChars.fathah}|`,
                `${arabicChars.dhammah}|`,
                `${arabicChars.kasrah}|`,
                `${arabicChars.lam}|`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}|`,
                `${arabicChars.space}${arabicChars.alif}${arabicChars.lam}|`,
                `[${arabicGroups.letters}]${arabicChars.tasydid}`,
                `)`,
                `(?=.{5,})`,
            ].join(""),
            [
                `(?<=`,
                `${arabicChars.dhammah}`,
                `)`,
                `(?<!${arabicChars.alif_hamzah_atas})`,
                `${arabicChars.waw}`,
                `${arabicChars.sukun}?`,
                `(?!`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}|`,
                `\\u06DF`,
                `)`,
                `(?=.{5,})`,
            ].join(""),
            [
                `(?<=`,
                `${arabicChars.kasrah}`,
                `)`,
                `${arabicChars.ya}`,
                `${arabicChars.sukun}?`,
                `(?!`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}`,
                `)`,
                `(?=.{5,})`,
            ].join(""),
            [
                `[${arabicGroups.letters}]`,
                `${arabicChars.tasydid}?`,
                `${arabicChars.fathah}?`,
                `${arabicChars.fathah_superscript}`,
                `(?![${arabicChars.small_madd}${arabicChars.maddah}])`
            ].join(""),
        ],
        flags: "g",
        className: "mad-tabii"
    },
    {
        name: "Ghunnah",
        priority: 1,
        pattern: [
            [
                `[${arabicChars.nun}${arabicChars.mim}]`,
                `${arabicChars.tasydid}`,
                `(?![${arabicChars.maddah}${arabicChars.small_madd}])`
            ].join(""),
        ],
        flags: "g",
        className: "ghunnah"
    },
    {
        name: "Ikhfa Syafawi",
        priority: 1,
        pattern: [
            [
                `${arabicChars.mim}${arabicChars.sukun}`,
                `(?:${arabicChars.space})?`,
                `(?=`,
                `${arabicChars.ba}`,
                `)`
            ].join(""),
        ],
        flags: "g",
        className: "ikhfa-syafawi"
    },
    {
        name: "Mad arid lissukun",
        priority: 4,
        pattern: [
            [
                `(?<=`,
                `${arabicChars.fathah}`,
                `)`,
                `${arabicChars.alif}`,
                `(?!`,
                `${arabicChars.fathah}|`,
                `${arabicChars.dhammah}|`,
                `${arabicChars.kasrah}|`,
                `${arabicChars.lam}|`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}|`,
                `${arabicChars.space}${arabicChars.alif}${arabicChars.lam}|`,
                `[${arabicGroups.letters}]${arabicChars.tasydid}`,
                `)`,
                `(?=.{0,5}$)`,
            ].join(""),
            [
                `(?<=`,
                `${arabicChars.dhammah}`,
                `)`,
                `${arabicChars.waw}`,
                `${arabicChars.sukun}?`,
                `(?!`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}`,
                `)`,
                `(?=.{0,5}$)`,
            ].join(""),
            [
                `(?<=`,
                `${arabicChars.kasrah}`,
                `)`,
                `${arabicChars.ya}`,
                `${arabicChars.sukun}?`,
                `(?!`,
                `${arabicChars.small_madd}|`,
                `${arabicChars.maddah}`,
                `)`,
                `(?=.{0,5}$)`,
            ].join("")
        ],
        flags: "g",
        className: "mad-arid"
    },
    {
        name: "Idgham Mimi",
        priority: 1,
        pattern: [
            `${arabicChars.mim}${arabicChars.sukun}`,
            `(?:${arabicChars.space})?`,
            `(?=`,
            `${arabicChars.mim}`,
            `)`
        ].join(""),
        flags: "g",
        className: "idgham-mimi"
    },
];

/**
 * Gabungkan definisi pola tajwid dengan warna (dari state/pengaturan) menjadi
 * satu array siap dipakai untuk pencarian match.
 */
function buildTajwidsWithColors(colors) {
    return tajwids.map((rule) => ({
        ...rule,
        ...toCss(colors[rule.name]),
    }));
}

function resolveConflicts(matches) {
    if (matches.length === 0) return [];

    const sorted = [...matches].sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        return a.priority - b.priority;
    });

    const accepted = [];

    for (const candidate of sorted) {
        if (accepted.length === 0) {
            accepted.push(candidate);
            continue;
        }

        const last = accepted[accepted.length - 1];
        const overlaps = candidate.start < last.end;

        if (!overlaps) {
            accepted.push(candidate);
        } else if (candidate.start === last.start) {
            // abaikan, yang sudah diterima punya priority lebih tinggi
        } else {
            if (candidate.priority < last.priority) {
                accepted.pop();
                accepted.push(candidate);
            }
        }
    }

    return accepted;
}

/**
 * @param {string} text
 * @param {object} [colorOverrides] - jika diisi (mis. dari halaman pengaturan
 *   untuk pratinjau langsung), warna ini dipakai alih-alih localStorage dan
 *   komponen tidak akan mendengarkan event perubahan warna global.
 */
export default function Tajwid({ text, colorOverrides }) {
    const [colors, setColors] = useState(colorOverrides || getTajwidColors());

    // Mode pratinjau terkontrol: ikuti prop setiap kali berubah
    useEffect(() => {
        if (colorOverrides) setColors(colorOverrides);
    }, [colorOverrides]);

    // Mode normal: dengarkan perubahan pengaturan warna (tab sama & tab lain)
    useEffect(() => {
        if (colorOverrides) return;
        const handler = () => setColors(getTajwidColors());
        window.addEventListener(TAJWID_COLORS_EVENT, handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener(TAJWID_COLORS_EVENT, handler);
            window.removeEventListener("storage", handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorOverrides]);

    const coloredTajwids = buildTajwidsWithColors(colors);
    const rawMatches = [];

    coloredTajwids.forEach(({ pattern, flags, className, color, name, backgroundColor, priority }) => {
        const patterns = Array.isArray(pattern) ? pattern : [pattern];

        patterns.forEach((p) => {
            const regex = new RegExp(p, flags);

            text.replace(regex, (match, ...args) => {
                const offset = args[args.length - 2];

                rawMatches.push({
                    start: offset,
                    end: offset + match.length,
                    match,
                    className,
                    color,
                    name,
                    backgroundColor,
                    priority
                });
            });
        });
    });

    const matches = resolveConflicts(rawMatches);

    const parts = [];
    let lastIndex = 0;

    matches.forEach((m, i) => {
        if (m.start > lastIndex) {
            parts.push(text.slice(lastIndex, m.start));
        }

        parts.push(
            <TajwidSpan
                key={`${m.start}-${i}`}
                {...m}
            />
        );

        lastIndex = m.end;
    });

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
}

function TajwidSpan({ match, name, className, color, backgroundColor }) {
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (!tooltipRef.current) return;

        const tooltip = new Tooltip(tooltipRef.current, {
            boundary: document.body
        });

        return () => tooltip.dispose();
    }, []);

    return (
        <span
            ref={tooltipRef}
            style={{
                backgroundColor: backgroundColor || undefined,
                color: color || undefined,
                borderColor: backgroundColor || undefined,
                cursor: "pointer"
            }}
            data-bs-toggle="tooltip"
            data-bs-custom-class="tajwid"
            data-bs-html="true"
            data-bs-placement="top"
            data-bs-title={`<small>${name}</small>`}
            className={`rounded-1 border-0 ${className}`}
        >
            {match}
        </span>
    );
}

/**
 * Menerima array penggalan teks Arab, menggabungkannya, melakukan highlight
 * tajwid, lalu memotong kembali sesuai panjang fragment asli.
 *
 * @param {string[]} fragments - Array penggalan teks Arab
 * @returns {Array<Array<string|JSX.Element>>} - Array of parts per fragment
 */
export function highlightAndSplit(fragments) {
    const colors = getTajwidColors();
    const coloredTajwids = buildTajwidsWithColors(colors);

    const offsets = [];
    let joined = "";

    for (const frag of fragments) {
        offsets.push({ start: joined.length, end: joined.length + frag.length });
        joined += frag;
    }

    const rawMatches = [];

    coloredTajwids.forEach(({ pattern, flags, className, color, name, backgroundColor, priority }) => {
        const patterns = Array.isArray(pattern) ? pattern : [pattern];

        patterns.forEach((p) => {
            const regex = new RegExp(p, flags);

            joined.replace(regex, (match, ...args) => {
                const offset = args[args.length - 2];
                rawMatches.push({
                    start: offset,
                    end: offset + match.length,
                    match,
                    className,
                    color,
                    name,
                    backgroundColor,
                    priority
                });
            });
        });
    });

    const matches = resolveConflicts(rawMatches);

    return offsets.map(({ start: fragStart, end: fragEnd }, fragIdx) => {
        const parts = [];
        let cursor = fragStart;

        for (const m of matches) {
            if (m.end <= fragStart) continue;
            if (m.start >= fragEnd) break;

            const clipStart = Math.max(m.start, fragStart);
            const clipEnd = Math.min(m.end, fragEnd);

            if (clipStart > cursor) {
                parts.push(joined.slice(cursor, clipStart));
            }

            parts.push(
                <TajwidSpan
                    key={`${fragIdx}-${m.start}-${clipStart}`}
                    {...m}
                    match={joined.slice(clipStart, clipEnd)}
                />
            );

            cursor = clipEnd;
        }

        if (cursor < fragEnd) {
            parts.push(joined.slice(cursor, fragEnd));
        }

        return parts;
    });
}