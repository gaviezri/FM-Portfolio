"use client";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();
    return (
        <div
            onClick={() => {
                router.push("/");
            }}
            className="font-light"
        >
            Florencia Michelli
        </div>
    );
};

export default Logo;
