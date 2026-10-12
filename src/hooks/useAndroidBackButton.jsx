import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useNavigate } from "react-router-dom";

export default function useAndroidBackButton() {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = App.addListener(
            "backButton",
            ({ canGoBack }) => {

                if (canGoBack) {
                    navigate(-1);
                } else {
                    App.exitApp();
                }

            }
        );


        return () => {
            handler.remove();
        };

    }, [navigate]);
}