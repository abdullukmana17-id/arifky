import api from "./api";

export const SurahService = {

    /**
     * Mengambil seluruh daftar surah.
     */
    async getAll() {
        const response = await api.get("/surat");
        return response.data.data;
    },

    /**
     * Mengambil detail satu surah.
     */
    async getByNumber(number) {
        const response = await api.get(`/surat/${number}`);
        return response.data.data;
    },

    async getById(nomor) {
        const { data } = await api.get(`/surat/${nomor}`);
        return data.data;
    }

};