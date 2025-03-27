import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import styles from "./OfflineElem.module.css";
import { theme } from "../theme";
import { useEffect } from "react";

const LoadingText = ({ text = "Loading..." }) => {
  return (
    <div className={styles.loading}>
      {Array.from(text).map((letter, index) => (
        <span
          key={index}
          className={styles.loadingLetter}
          style={{ ["--index" as any]: index }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export const OfflineElem = () => {
  // Add effect to handle body styles when component mounts/unmounts
  useEffect(() => {
    // Save original styles
    const originalStyles = {
      margin: document.body.style.margin,
      padding: document.body.style.padding,
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      backgroundColor: document.body.style.backgroundColor,
    };

    // Apply new styles to body
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.backgroundColor = theme.palette.background.default;

    // Clean up function to restore original styles when component unmounts
    return () => {
      document.body.style.margin = originalStyles.margin;
      document.body.style.padding = originalStyles.padding;
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.height = originalStyles.height;
      document.body.style.backgroundColor = originalStyles.backgroundColor;
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: theme.palette.background.default,
          margin: 0,
          padding: 0,
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Typography variant="h4" align="center">
          Unable to connect to the server. Please check your connection.
        </Typography>
        <div className={styles.container}>
          <div>
            <svg
              width="725"
              height="120"
              viewBox="0 0 725 980"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="83db1a1b193bb516cce42d7f2d82920a 2" clipPath="url(#clip0)">
                <g>
                  <path
                    id={styles.steam1}
                    d="M334 272.304C335.347 227.685 347.068 214.806 383 186C403.053 167.91 411.743 159.688 414.5 112.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id={styles.steam2}
                    d="M217 251C218.958 185.665 235.993 166.806 288.218 124.626C317.363 98.1371 329.993 86.0973 334 17"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <path
                  id="Vector"
                  d="M697.86 473.399C681.01 457.699 663.21 450.999 637.94 450.999C620.32 450.999 606.73 454.259 591.41 461.909L582.03 466.699L583.18 462.099C585.1 454.249 588.73 359.289 587.58 350.669C586.82 345.499 584.52 340.709 581.45 337.839L576.47 333.249L296.75 332.869C142.82 332.689 14.93 333.259 12.82 334.219C10.52 334.979 6.88001 338.239 4.40001 341.299L0 346.659L1.34001 400.269C5.93001 611.059 50.35 800.219 120.23 906.669C137.27 932.709 170.77 966.789 186.86 974.639L198.16 979.999L296.76 978.849C407.42 977.319 399.19 978.469 419.48 961.999C457.58 930.599 496.44 860.909 524.21 773.989C529.57 757.139 535.5 742.589 538.76 738.189C547.57 726.129 565.18 714.449 605.58 694.149C660.53 666.389 679.48 653.179 696.9 630.199C715.09 606.079 724.28 577.359 724.28 544.429C724.28 512.269 716.24 490.819 697.86 473.399ZM547.37 405.429C541.63 550.549 512.14 703.139 469.25 810.929C447.23 866.259 418.9 912.019 394.2 931.739L384.82 939.209H201.02L182.45 920.639C160.82 898.619 148.18 880.629 130.76 846.359C78.3 743.159 47.9867 594.589 39.82 400.649L38.48 372.509H272.25L313.41 372.499H548.71L547.37 405.429ZM682.34 571.629C676.41 595.949 660.13 617.389 635.05 633.469C618.78 643.999 551.96 677.499 551.96 675.199C551.96 674.239 555.41 656.439 559.42 635.569C565.74 603.789 576.84 535.059 576.84 527.779C576.84 524.139 598.47 502.509 606.32 498.489C625.86 488.339 645.39 486.999 660.32 494.659C670.09 499.639 679.09 509.589 682.34 519.359C685.79 528.549 685.6 557.839 682.34 571.629Z"
                />
                <g id={styles.teaBag}>
                  <path
                    id="Vector_2"
                    d="M422.734 531.212C419.674 521.062 411.244 511.112 400.334 504.792C390.374 498.862 379.464 498.092 350.744 500.962L335.044 502.682L334.084 496.172C333.504 492.722 330.444 473.002 327.194 452.522C324.134 432.032 318.574 402.552 315.134 386.852L308.814 358.712L267.654 358.722L270.514 368.682C278.174 395.292 294.634 485.852 294.634 501.742C294.634 507.672 294.444 507.672 282.764 509.012C248.304 512.652 235.664 517.432 225.714 531.222C215.184 545.962 214.994 551.712 222.844 619.102C226.674 652.222 230.694 682.662 231.654 686.492C236.244 704.102 257.304 720.572 275.304 720.572C289.284 720.572 396.874 707.742 406.074 704.872C416.984 701.812 432.684 686.112 435.944 675.382C437.351 670.327 438.123 665.117 438.244 659.872C438.244 647.622 425.224 539.442 422.734 531.212ZM396.884 664.482C395.354 666.972 392.674 668.882 390.754 668.882C389.034 668.882 362.614 671.942 331.974 675.392C295.214 679.802 275.304 681.332 273.194 680.182C268.794 677.882 268.794 678.272 262.094 618.722C255.584 561.472 255.394 554.972 258.844 552.672C261.714 550.952 356.484 539.272 371.424 538.882C378.114 538.692 382.904 539.652 384.244 540.992C385.204 542.332 389.224 569.712 392.864 601.872C398.994 653.752 399.374 660.842 396.884 664.482H396.884Z"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="724.28" height="979.999" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <LoadingText text="Matcha...Offline" />
          </div>
          <div>
            <svg
              id={styles.server}
              width="725"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="0"
                x2="12"
                y2="250"
                className={styles.networkLine}
              />
              <line
                x1="10"
                y1="14"
                x2="14"
                y2="18"
                className={styles.networkError}
              />
              <line
                x1="14"
                y1="14"
                x2="10"
                y2="18"
                className={styles.networkError}
              />
            </svg>
          </div>
          <div>
            <svg
              id={styles.server}
              width="725"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 21H5C4.06812 21 3.60218 21 3.23463 20.8478C2.74458 20.6448 2.35523 20.2554 2.15224 19.7654C2 19.3978 2 18.9319 2 18C2 17.0681 2 16.6022 2.15224 16.2346C2.35523 15.7446 2.74458 15.3552 3.23463 15.1522C3.60218 15 4.06812 15 5 15H19C19.9319 15 20.3978 15 20.7654 15.1522C21.2554 15.3552 21.6448 15.7446 21.8478 16.2346C22 16.6022 22 17.0681 22 18C22 18.9319 22 19.3978 21.8478 19.7654C21.6448 20.2554 21.2554 20.6448 20.7654 20.8478C20.3978 21 19.9319 21 19 21H18"
                className={styles.serverPath}
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M2 12C2 11.0681 2 10.6022 2.15224 10.2346C2.35523 9.74458 2.74458 9.35523 3.23463 9.15224C3.60218 9 4.06812 9 5 9H19C19.9319 9 20.3978 9 20.7654 9.15224C21.2554 9.35523 21.6448 9.74458 21.8478 10.2346C22 10.6022 22 11.0681 22 12C22 12.9319 22 13.3978 21.8478 13.7654C21.6448 14.2554 21.2554 14.6448 20.7654 14.8478C20.3978 15 19.9319 15 19 15H5C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12Z"
                className={styles.serverPath}
                stroke-width="1.5"
              />
              <path
                d="M10 3H19C19.9319 3 20.3978 3 20.7654 3.15224C21.2554 3.35523 21.6448 3.74458 21.8478 4.23463C22 4.60218 22 5.06812 22 6C22 6.93188 22 7.39782 21.8478 7.76537C21.6448 8.25542 21.2554 8.64477 20.7654 8.84776C20.3978 9 19.9319 9 19 9H5C4.06812 9 3.60218 9 3.23463 8.84776C2.74458 8.64477 2.35523 8.25542 2.15224 7.76537C2 7.39782 2 6.93188 2 6C2 5.06812 2 4.60218 2.15224 4.23463C2.35523 3.74458 2.74458 3.35523 3.23463 3.15224C3.60218 3 4.06812 3 5 3H6"
                className={styles.serverPath}
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="5" cy="12" r="1" className={styles.serverDot} />
              <circle cx="5" cy="6" r="1" className={styles.serverDot} />
              <circle cx="5" cy="18" r="1" className={styles.serverDot} />
            </svg>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem" }}
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </Box>
    </ThemeProvider>
  );
};
