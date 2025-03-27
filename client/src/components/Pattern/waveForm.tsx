import { theme } from "@/components/theme";
import "./waveMoves.css";

export const WaveForm: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div style={patternStyle}>{children}</div>
    </>
  );
};

const patternStyle = {
  minHeight: "100vh",
  minWidth: "100vw",
  "--s": "100px" /* control the size */,
  "--c1": theme.palette.background.default,
  "--c2": theme.palette.secondary.main,
  "--_g":
    "var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%, var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%, var(--c1) 76% 86%, var(--c2) 86% 96%",
  background:
    "radial-gradient(100% 100% at 100% 0, var(--c1) 4%, var(--_g), #0008 96%, #0000), radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, var(--_g), var(--c1) 96%) var(--c1)",
  backgroundSize: "var(--s) var(--s)",
  animation: "waveMoves 8s infinite ease-in-out",
};
