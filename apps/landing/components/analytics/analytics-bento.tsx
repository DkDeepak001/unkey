"use client";
import { motion } from "framer-motion";
import { Highlight, PrismTheme } from "prism-react-renderer";
import { useState } from "react";
import { AnalyticsStars } from "../svg/analytics-stars";
import { AnalyticsWebApp, AnalyticsWebAppMobile } from "../svg/analytics-web-app";

export const theme = {
  plain: {
    color: "#F8F8F2",
    backgroundColor: "#282A36",
  },
  styles: [
    {
      types: ["string"],
      style: {
        color: "#3CEEAE",
      },
    },
    {
      types: ["string-property"],
      style: {
        color: "#9D72FF",
      },
    },
    {
      types: ["number"],
      style: {
        color: "#FB3186",
      },
    },
  ],
} satisfies PrismTheme;

const codeBlock = `curl --request GET \\
    --url https://api.unkey.dev/v1/keys.getKey \\
    --header 'Authorization: <authorization>'
    {    
      "apiId": "api_1234",
      "createdAt": 123,
      "deletedAt": 123,
      "expires": 123,
      "id": "key_1234",
      "meta": {
        "roles": [
          "admin",
          "user"
        ],
        "stripeCustomerId": "cus_1234"
      }
    }
`;

export function AnalyticsBento() {
  const [showApi, toggleShowApi] = useState(true);

  return (
    <div className="flex justify-center relative w-full">
      <button
        type="button"
        onClick={() => toggleShowApi(!showApi)}
        className="bg-white top-0 absolute top-14 z-50 rounded-lg py-1.5 px-1 font-semibold text-sm flex items-center pr-3 w-[164px]"
      >
        <div className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 34 34"
            className="scale-90"
            fill="none"
          >
            <rect width="34" height="34" rx="8" fill="black" fillOpacity="0.08" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.5579 9.32588C22.8019 9.0818 23.1977 9.0818 23.4418 9.32588L24.674 10.5581C24.9181 10.8022 24.9181 11.1979 24.674 11.442L21.9114 14.2046L19.7953 12.0884L22.5579 9.32588ZM19.0882 12.7956L9.32564 22.5581C9.08156 22.8022 9.08156 23.1979 9.32564 23.442L10.5579 24.6742C10.8019 24.9183 11.1977 24.9183 11.4418 24.6742L21.2043 14.9117L19.0882 12.7956ZM24.3256 8.442C23.5934 7.70976 22.4062 7.70976 21.674 8.442L8.44175 21.6742C7.70952 22.4065 7.70952 23.5936 8.44175 24.3259L9.67399 25.5581C10.4062 26.2903 11.5934 26.2903 12.3256 25.5581L25.5579 12.3259C26.2901 11.5936 26.2901 10.4065 25.5579 9.67423L24.3256 8.442Z"
              fill="black"
            />
            <path
              opacity="0.4"
              d="M15.25 8.25L16 6.5L16.75 8.25L18.5 9L16.75 9.75L16 11.5L15.25 9.75L13.5 9L15.25 8.25Z"
              fill="black"
            />
            <path
              opacity="0.6"
              d="M8.5 11.5L9.5 9L10.5 11.5L13 12.5L10.5 13.5L9.5 16L8.5 13.5L6 12.5L8.5 11.5Z"
              fill="black"
            />
            <path
              opacity="0.9"
              d="M21.5 20.5L22.5 18L23.5 20.5L26 21.5L23.5 22.5L22.5 25L21.5 22.5L19 21.5L21.5 20.5Z"
              fill="black"
            />
          </svg>
        </div>
        {showApi ? "Hide API Code" : "Show API code"}
      </button>
      <div className="mt-[80px] w-full h-[640px] analytics-linear-gradient flex justify-center xl:justify-start items-end border rounded-3xl border-[.5px] border-white/10 relative">
        <LightSvg className="absolute top-[-180px] left:0 xl:left-[120px] xxl:left-[330px] z-50 pointer-events-none" />
        <AnalyticsStars />
        {showApi ? <AnalyticsApiView /> : <AnalyticsWebAppView />}
        <BentoText />
      </div>
    </div>
  );
}

function AnalyticsApiView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileInView="visible"
      className="w-full "
    >
      <div className="w-full bg-[#000000] bg-opacity-02 analytics-background-gradient xxl:mr-10 overflow-x-hidden overflow-y-hidden border-white/10 border border-b-0 border-l-0  border-r-0 flex-col md:flex-row relative rounded-tr-3xl rounded-tl-3xl h-[600px] xl:h-[576px] flex">
        <div className="flex flex-col w-[216px] h-full text-white text-sm pt-6 px-4 font-mono md:border-r md:border-white/5">
          <div className="flex items-center cursor-pointer bg-white/5 py-1 px-2 rounded-lg w-[184px]">
            <TerminalIcon className="w-6 h-6" />
            <div className="ml-3">cURL</div>
          </div>
        </div>
        <div className="text-white pt-4 pl-8 flex text-xs sm:text-sm w-full font-mono">
          <Editor theme={theme} codeBlock={codeBlock} language="tsx" />
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsWebAppView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileInView="visible"
      className="w-full"
    >
      <div className="max-w-[1221px] relative overflow-hidden w-full analytics-background-gradient h-[600px] xl:h-[576px]  w-full  mr-10">
        <AnalyticsWebApp className="hidden md:flex" />
        <AnalyticsWebAppMobile />
      </div>
    </motion.div>
  );
}

export function Editor({
  codeBlock,
  language,
  theme,
}: { codeBlock: string; language: string; theme?: PrismTheme }) {
  return (
    <Highlight theme={theme} code={codeBlock} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="leading-10">
          {tokens.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: I got nothing better right now
            <div key={`${line}-${i}`} {...getLineProps({ line })}>
              <span className="line-number">{i + 1}</span>
              {line.map((token, key) => (
                <span key={`${key}-${token}`} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
    // </motion.div>
  );
}

export function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9864 5.36932C18.2076 5.13794 18.5073 5.00771 18.82 5.0072V5C19.1328 5.00051 19.4326 5.13074 19.6538 5.36214C19.875 5.59352 19.9993 5.90721 20 6.23444C20 6.82321 19.606 7.28113 19.0871 7.41197L13.5224 17.3725C13.5623 17.5034 13.5973 17.6342 13.5973 17.7651C13.5968 18.0923 13.4725 18.406 13.2513 18.6374C13.0301 18.8688 12.7303 18.999 12.4175 18.9995C12.1049 18.999 11.8048 18.8688 11.5839 18.6374C11.3627 18.406 11.2382 18.0923 11.2377 17.7651C11.2377 17.1704 11.6478 16.6974 12.183 16.5797L17.7195 6.65246C17.6752 6.52294 17.6402 6.38687 17.6402 6.24164C17.6409 5.9144 17.7652 5.60072 17.9864 5.36932ZM18.3643 6.71855C18.4852 6.84504 18.649 6.91611 18.82 6.91611C18.991 6.91611 19.155 6.84504 19.2758 6.71855C19.3967 6.59207 19.4646 6.42052 19.4646 6.24164C19.4646 6.06275 19.3967 5.89121 19.2758 5.76472C19.155 5.63824 18.991 5.56718 18.82 5.56718C18.649 5.56718 18.4852 5.63824 18.3643 5.76472C18.2435 5.89121 18.1754 6.06275 18.1754 6.24164C18.1754 6.42052 18.2435 6.59207 18.3643 6.71855ZM11.9616 18.242C12.0827 18.3685 12.2465 18.4396 12.4175 18.4396C12.5885 18.4396 12.7525 18.3685 12.8734 18.242C12.9942 18.1155 13.0621 17.9439 13.0621 17.7651C13.0621 17.5862 12.9942 17.4146 12.8734 17.2882C12.7525 17.1617 12.5885 17.0906 12.4175 17.0906C12.2465 17.0906 12.0827 17.1617 11.9616 17.2882C11.8408 17.4146 11.7729 17.5862 11.7729 17.7651C11.7729 17.9439 11.8408 18.1155 11.9616 18.242Z"
        fill="url(#paint0_linear_840_1992)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8178 6.24152C12.8178 5.56123 13.3435 5.00929 13.9937 5.00708C14.3044 5.00825 14.6024 5.13751 14.8231 5.36688C15.044 5.59687 15.169 5.90888 15.1714 6.23497C15.1714 6.82374 14.7773 7.28166 14.2585 7.4125L8.69378 17.3732C8.73367 17.5039 8.76867 17.6347 8.76867 17.7656C8.7682 18.0929 8.64385 18.4065 8.42268 18.6379C8.20151 18.8693 7.90172 18.9995 7.58887 19C7.27601 18.9995 6.97622 18.8693 6.75505 18.6377C6.53388 18.4061 6.4093 18.0923 6.40906 17.765C6.40906 17.1703 6.81921 16.6973 7.3544 16.5795L12.8972 6.65235C12.8528 6.52282 12.8178 6.38675 12.8178 6.24152ZM13.5418 6.71844C13.6629 6.84493 13.8266 6.91598 13.9976 6.91598C14.1686 6.91598 14.3327 6.84493 14.4535 6.71844C14.5744 6.59195 14.6422 6.4204 14.6422 6.24152C14.6422 6.06264 14.5744 5.89108 14.4535 5.7646C14.3327 5.63811 14.1686 5.56705 13.9976 5.56705C13.8266 5.56705 13.6629 5.63811 13.5418 5.7646C13.4209 5.89108 13.353 6.06264 13.353 6.24152C13.353 6.4204 13.4209 6.59195 13.5418 6.71844ZM7.133 18.2425C7.25408 18.369 7.41786 18.4401 7.58887 18.4401C7.75988 18.4401 7.92389 18.369 8.04474 18.2425C8.16559 18.116 8.23348 17.9446 8.23348 17.7656C8.23348 17.5867 8.16559 17.4151 8.04474 17.2887C7.92389 17.1622 7.75988 17.0912 7.58887 17.0912C7.41786 17.0912 7.25408 17.1622 7.133 17.2887C7.01215 17.4151 6.94426 17.5867 6.94426 17.7656C6.94426 17.9446 7.01215 18.116 7.133 18.2425Z"
        fill="url(#paint1_linear_840_1992)"
      />
      <path
        d="M13.9937 5.00708C13.9951 5.00708 13.9962 5.00707 13.9976 5.00707H13.9913C13.992 5.00707 13.993 5.00708 13.9937 5.00708Z"
        fill="url(#paint2_linear_840_1992)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.00732 10.5274C5.78615 10.7588 5.48636 10.889 5.1735 10.8895L5.1798 10.883C4.86718 10.8824 4.56715 10.7522 4.34622 10.5208C4.12505 10.2894 4.00047 9.97574 4 9.64851C4 9.0532 4.40384 8.58088 4.93787 8.46312C4.96377 8.45755 4.98896 8.45029 5.01416 8.44305C5.06572 8.42819 5.11704 8.41341 5.17304 8.41341C5.69376 8.41341 6.1221 8.7719 6.27842 9.26253C6.31784 9.39337 6.35354 9.52422 6.35354 9.65506C6.35284 9.98228 6.22849 10.296 6.00732 10.5274ZM5.62937 9.17814C5.50852 9.05165 5.34451 8.98059 5.1735 8.98059C5.00273 8.98059 4.83872 9.05165 4.71787 9.17814C4.59678 9.30461 4.52889 9.47617 4.52889 9.65506C4.52889 9.83392 4.59678 10.0055 4.71787 10.132C4.83872 10.2585 5.00273 10.3295 5.1735 10.3295C5.34451 10.3295 5.50852 10.2585 5.62937 10.132C5.75022 10.0055 5.81811 9.83392 5.81811 9.65506C5.81811 9.47617 5.75022 9.30461 5.62937 9.17814Z"
        fill="url(#paint3_linear_840_1992)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.27842 13.5769C6.31784 13.7077 6.35354 13.8386 6.35354 13.9694L6.3596 13.9628C6.35914 14.2901 6.23479 14.6038 6.01362 14.8352C5.79245 15.0666 5.49266 15.1968 5.1798 15.1973C4.86718 15.1968 4.56715 15.0666 4.34622 14.8352C4.12505 14.6038 4.00047 14.2901 4 13.9628C4 13.3675 4.40384 12.8946 4.93787 12.7768C4.96423 12.7713 4.99013 12.764 5.01579 12.7567C5.06688 12.7422 5.11774 12.7277 5.17304 12.7277C5.69446 12.7277 6.1221 13.0862 6.27842 13.5769ZM4.71787 13.4925C4.59678 13.619 4.52889 13.7905 4.52889 13.9694C4.52889 14.1483 4.59678 14.3198 4.71787 14.4463C4.83872 14.5728 5.00273 14.6439 5.1735 14.6439C5.34451 14.6439 5.50852 14.5728 5.62937 14.4463C5.75022 14.3198 5.81811 14.1483 5.81811 13.9694C5.81811 13.7905 5.75022 13.619 5.62937 13.4925C5.50852 13.366 5.34451 13.2949 5.1735 13.2949C5.00273 13.2949 4.83872 13.366 4.71787 13.4925Z"
        fill="url(#paint4_linear_840_1992)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_840_1992"
          x1="4.15606"
          y1="3.49029"
          x2="4.15606"
          y2="19.8307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_840_1992"
          x1="4.15606"
          y1="3.49029"
          x2="4.15606"
          y2="19.8307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_840_1992"
          x1="4.15606"
          y1="3.49029"
          x2="4.15606"
          y2="19.8307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_840_1992"
          x1="4.15606"
          y1="3.49029"
          x2="4.15606"
          y2="19.8307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_840_1992"
          x1="4.15606"
          y1="3.49029"
          x2="4.15606"
          y2="19.8307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BentoText() {
  return (
    <div className="flex flex-col text-white absolute left-[20px] sm:left-[40px] xl:left-[40px] bottom-[40px] max-w-[286px]">
      <div className="flex w-full items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23 5.5C23 6.88071 21.8807 8 20.5 8C19.1193 8 18 6.88071 18 5.5C18 4.11929 19.1193 3 20.5 3C21.8807 3 23 4.11929 23 5.5ZM22 5.5C22 6.32843 21.3284 7 20.5 7C19.6716 7 19 6.32843 19 5.5C19 4.67157 19.6716 4 20.5 4C21.3284 4 22 4.67157 22 5.5ZM6.6786 4L6.7 4H15V5H6.7C6.1317 5 5.73554 5.00039 5.42712 5.02559C5.12454 5.05031 4.95069 5.0964 4.81901 5.16349C4.53677 5.3073 4.3073 5.53677 4.16349 5.81901C4.0964 5.95069 4.05031 6.12454 4.02559 6.42712C4.00039 6.73554 4 7.1317 4 7.7V16.3C4 16.8683 4.00039 17.2645 4.02559 17.5729C4.05031 17.8755 4.0964 18.0493 4.16349 18.181C4.3073 18.4632 4.53677 18.6927 4.81901 18.8365C4.95069 18.9036 5.12454 18.9497 5.42712 18.9744C5.73554 18.9996 6.1317 19 6.7 19H18.3C18.8683 19 19.2645 18.9996 19.5729 18.9744C19.8755 18.9497 20.0493 18.9036 20.181 18.8365C20.4632 18.6927 20.6927 18.4632 20.8365 18.181C20.9036 18.0493 20.9497 17.8755 20.9744 17.5729C20.9996 17.2645 21 16.8683 21 16.3V11H22V16.3V16.3214C22 16.8633 22 17.3004 21.9711 17.6543C21.9413 18.0187 21.8784 18.3388 21.7275 18.635C21.4878 19.1054 21.1054 19.4878 20.635 19.7275C20.3388 19.8784 20.0187 19.9413 19.6543 19.9711C19.3004 20 18.8635 20 18.3217 20H18.3216H18.3216H18.3216H18.3214H18.3H6.7H6.67858H6.67844H6.67839H6.67835H6.67831C6.13655 20 5.69957 20 5.34569 19.9711C4.98126 19.9413 4.66117 19.8784 4.36502 19.7275C3.89462 19.4878 3.51217 19.1054 3.27248 18.635C3.12159 18.3388 3.05868 18.0187 3.02891 17.6543C2.99999 17.3004 3 16.8633 3 16.3214V16.3V7.7V7.6786C3 7.1367 2.99999 6.69963 3.02891 6.34569C3.05868 5.98126 3.12159 5.66117 3.27248 5.36502C3.51217 4.89462 3.89462 4.51217 4.36502 4.27248C4.66117 4.12159 4.98126 4.05868 5.34569 4.02891C5.69963 3.99999 6.1367 3.99999 6.6786 4ZM8 16V8H9V16H8ZM12 12V16H13V12H12ZM16 16V10H17V16H16Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
        <h3 className="ml-4 text-lg font-medium text-white">Realtime Analytics</h3>
      </div>
      <p className="mt-4 text-white/60 leading-6">
        Access real-time insights into your API usage through our dashboard, or build your own on
        top of our APi.
      </p>
    </div>
  );
}

export function LightSvg({ className }: { className?: string }) {
  return (
    <svg
      width={706}
      height={773}
      viewBox="0 0 706 773"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity={0.2}>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#a)"
        >
          <ellipse
            cx={24.471}
            cy={219.174}
            rx={24.471}
            ry={219.174}
            transform="rotate(15.067 -346.215 1160.893)skewX(.027)"
            fill="url(#b)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "color-dodge",
          }}
          filter="url(#c)"
        >
          <ellipse
            cx={355.612}
            cy={332.214}
            rx={19.782}
            ry={219.116}
            fill="url(#d)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#e)"
        >
          <ellipse
            cx={16.707}
            cy={284.877}
            rx={16.707}
            ry={284.877}
            transform="rotate(-15.013 621.533 -1357.818)skewX(-.027)"
            fill="url(#f)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#g)"
        >
          <ellipse
            cx={16.707}
            cy={134.986}
            rx={16.707}
            ry={134.986}
            transform="rotate(-15.013 606.533 -1243.985)skewX(-.027)"
            fill="url(#h)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#i)"
        >
          <ellipse
            cx={353.187}
            cy={420.944}
            rx={16.61}
            ry={285.056}
            fill="url(#j)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#k)"
        >
          <ellipse
            cx={353.187}
            cy={420.944}
            rx={16.61}
            ry={285.056}
            fill="url(#l)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#m)"
        >
          <ellipse cx={353} cy={253.199} rx={240} ry={140.1} fill="url(#n)" fillOpacity={0.5} />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#o)"
        >
          <ellipse
            cx={353}
            cy={184.456}
            rx={119.813}
            ry={71.357}
            fill="url(#p)"
            fillOpacity={0.5}
          />
        </g>
        <g
          style={{
            mixBlendMode: "lighten",
          }}
          filter="url(#q)"
        >
          <ellipse
            cx={353}
            cy={189.873}
            rx={100.778}
            ry={59.963}
            fill="url(#r)"
            fillOpacity={0.5}
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="b"
          x1={24.471}
          y1={0}
          x2={24.471}
          y2={438.347}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="d"
          x1={355.612}
          y1={113.099}
          x2={355.612}
          y2={551.33}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="f"
          x1={16.707}
          y1={0}
          x2={16.707}
          y2={569.753}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="h"
          x1={16.707}
          y1={0}
          x2={16.707}
          y2={269.972}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="j"
          x1={353.187}
          y1={135.888}
          x2={353.187}
          y2={706}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="l"
          x1={353.187}
          y1={135.888}
          x2={353.187}
          y2={706}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="n"
          x1={353}
          y1={113.099}
          x2={353}
          y2={393.298}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="p"
          x1={353}
          y1={113.099}
          x2={353}
          y2={255.814}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="r"
          x1={353}
          y1={129.91}
          x2={353}
          y2={249.836}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter
          id="a"
          x={128.273}
          y={69.424}
          width={256.71}
          height={557.026}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="c"
          x={269.08}
          y={46.349}
          width={173.065}
          height={571.731}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="e"
          x={320.576}
          y={43.543}
          width={284.36}
          height={683.943}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="g"
          x={288.78}
          y={43.505}
          width={210.431}
          height={394.435}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="i"
          x={269.827}
          y={69.138}
          width={166.719}
          height={703.612}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="k"
          x={269.827}
          y={69.138}
          width={166.719}
          height={703.612}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={33.375} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="m"
          x={0.5}
          y={0.599}
          width={705}
          height={505.199}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={56.25} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="o"
          x={120.687}
          y={0.599}
          width={464.627}
          height={367.715}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={56.25} result="effect1_foregroundBlur_840_2403" />
        </filter>
        <filter
          id="q"
          x={139.723}
          y={17.41}
          width={426.555}
          height={344.925}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={56.25} result="effect1_foregroundBlur_840_2403" />
        </filter>
      </defs>
    </svg>
  );
}
