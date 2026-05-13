"use client";

import { buildNarrative, normalizeStageName } from "@/lib/assessment/narratives";
import { AdaptsStage, Role } from "@/lib/assessment/questions";
import { EnergyProfile } from "@/lib/assessment/scoring";
import Link from "next/link";

interface RoleScores {
  Activator: number;
  Stabilizer: number;
  Unifier: number;
  Driver: number;
  Spotter: number;
  Architect: number;
}

interface StageScores {
  "Access Readiness": number;
  "Alert the System": number;
  "Diagnose the Gaps": number;
  "Scale and Sustain": number;
  "Transform Through Alignment": number;
  "Participate Through Dialogue": number;
}

interface EnergyScores {
  Unifier: number;
  Achiever: number;
  Innovator: number;
  Organizer: number;
}

// interface EnergyProfile {
//   scores: EnergyScores;
//   strain: string;
//   depleted: string;
//   dominant: string;
//   secondary: string;
// }

interface DerivedData {
  primary_role: string;
  secondary_role: string;
  role_pair_title: string;
  energy_profile: EnergyProfile;
  top_adapts_stages: string[];
  bottom_adapts_stages: string[];
  change_capacity_score: number;
}

interface ProfileData {
  full_name: string;
  change_genius_role: string;
  change_genius_role_2: string;
  role_pair_title: string;
  primary_energy: string;
  top_adapts_stages: string[];
  bottom_adapts_stages: string[];
}

interface ResultsData {
  assessmentId: string;
  completedAt: string;
  roleScores: RoleScores;
  stageScores: StageScores;
  energyScores: EnergyScores;
  derived: DerivedData;
  profile: ProfileData;
}

interface ResultsPageProps {
  hasPaid: boolean;
  onboarded: boolean;
  results: ResultsData | null;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const STAGE_TO_LETTER: Record<string, string> = {
  "Alert the System": "A",
  "Diagnose the Gaps": "D",
  "Access Readiness": "A2",
  "Participate Through Dialogue": "P",
  "Transform Through Alignment": "T",
  "Scale and Sustain": "S",
};

// Ordered ADAPTS stages for score bar
const ADAPTS_ORDER = [
  "Alert the System",
  "Diagnose the Gaps",
  "Access Readiness",
  "Participate Through Dialogue",
  "Transform Through Alignment",
  "Scale and Sustain",
] as const;

const ADAPTS_LABELS: Record<string, string> = {
  "Alert the System": "Alert",
  "Diagnose the Gaps": "Diagnose",
  "Access Readiness": "Access",
  "Participate Through Dialogue": "Participate",
  "Transform Through Alignment": "Transform",
  "Scale and Sustain": "Scale",
};

// Colour helpers
const stageColour = (
  stage: string,
  topStages: string[],
  bottomStages: string[],
) => {
  if (topStages.includes(stage)) return "#12A74C";
  if (bottomStages.includes(stage)) return "#EF4444";
  return "#6B7280";
};

// ─── ADAPTS SVG wired to real top/bottom stages
const ADAPTS_SVG = ({
  topStages,
  bottomStages,
}: {
  topStages: string[];
  bottomStages: string[];
}) => {
  const fill = (stage: string) => stageColour(stage, topStages, bottomStages);

  const blockA1 = fill("Alert the System");
  const blockD = fill("Diagnose the Gaps");
  const blockA2 = fill("Access Readiness");
  const blockP = fill("Participate Through Dialogue");
  const blockT = fill("Transform Through Alignment");
  const blockS = fill("Scale and Sustain");

  return (
    <svg
      width="789"
      height="319"
      viewBox="0 0 789 319"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Block A (Alert the System) */}
      <path
        opacity="0.94"
        d="M49.6719 34.001C53.9563 30.041 53.9602 26.5716 50.7754 20.1963C49.6463 18.2231 49 15.9373 49 13.501C49.0003 6.04536 55.0443 0.000976562 62.5 0.000976562C69.9557 0.000976563 75.9997 6.04536 76 13.501C75.9999 16.3767 75.0999 19.0425 73.5674 21.2324C72.2363 23.5997 68.6459 31.0732 74.5 34.001L125 34.001L125 83.6719C128.96 87.9566 132.429 87.9604 138.805 84.7754C140.778 83.6462 143.064 83 145.5 83C152.956 83 158.999 89.0446 159 96.5C159 103.956 152.956 110 145.5 110C142.624 110 139.959 109.1 137.769 107.567C135.401 106.236 127.928 102.647 125 108.5L125 159.002L0 159.002L0 108.602C2.97579 103.84 9.56578 107.404 11.4727 108.577C11.6295 108.682 11.7882 108.783 11.9492 108.882C11.9821 108.904 12 108.915 12 108.915V108.912C14.1883 110.237 16.755 111.001 19.5 111.001C27.5079 111.001 34 104.509 34 96.501C34 88.493 27.5079 82.0012 19.5 82.001C16.7552 82.001 14.1882 82.7639 12 84.0889V84.083C5.49986 88.0009 0.999854 85.001 0 83.001L0 34.001L49.6719 34.001ZM48 139.501C48 142.246 48.7629 144.813 50.0879 147.001H50.082C53.9999 153.501 51 158.001 49 159.001L74.6006 159.001C69.8388 156.025 73.4026 149.435 74.5762 147.528C74.6806 147.372 74.7824 147.213 74.8809 147.052C74.903 147.019 74.9141 147.001 74.9141 147.001H74.9111C76.2363 144.813 77 142.246 77 139.501C76.9997 131.493 70.508 125.001 62.5 125.001C54.492 125.001 48.0003 131.493 48 139.501Z"
        fill={blockA1}
      />
      {/* Block T (Transform) */}
      <path
        opacity="0.94"
        d="M629.003 83.6729C632.963 87.9573 636.432 87.9612 642.808 84.7764C644.781 83.6472 647.067 83.001 649.503 83.001C656.959 83.0012 663.003 89.0453 663.003 96.501C663.003 103.957 656.959 110.001 649.503 110.001C646.627 110.001 643.961 109.101 641.771 107.568C639.404 106.237 631.931 102.647 629.003 108.501V159.001H579.332C575.047 162.961 575.044 166.43 578.229 172.806C579.358 174.779 580.004 177.065 580.004 179.501C580.004 186.956 573.959 193 566.504 193.001C559.048 193.001 553.004 186.957 553.004 179.501C553.004 176.625 553.904 173.96 555.437 171.77C556.768 169.402 560.357 161.929 554.504 159.001H504.002V34.001H554.402C559.164 36.9768 555.6 43.5668 554.427 45.4736C554.322 45.6305 554.22 45.7892 554.122 45.9502C554.1 45.9831 554.089 46.001 554.089 46.001H554.092C552.767 48.1893 552.003 50.756 552.003 53.501C552.003 61.5089 558.495 68.001 566.503 68.001C574.511 68.001 581.003 61.5089 581.003 53.501C581.003 50.7562 580.24 48.1892 578.915 46.001H578.921C575.003 39.5008 578.003 35.0008 580.003 34.001H629.003V83.6729ZM523.503 82.001C520.758 82.001 518.191 82.7639 516.003 84.0889V84.083C509.503 88.0009 505.003 85.001 504.003 83.001V108.602C506.979 103.84 513.569 107.404 515.476 108.577C515.632 108.682 515.791 108.783 515.952 108.882C515.985 108.904 516.003 108.915 516.003 108.915V108.912C518.191 110.237 520.758 111.001 523.503 111.001C531.511 111.001 538.003 104.509 538.003 96.501C538.003 88.493 531.511 82.0012 523.503 82.001Z"
        fill={blockT}
      />
      {/* Block D (Diagnose) */}
      <path
        opacity="0.94"
        d="M251 209.673C254.96 213.957 258.429 213.961 264.805 210.776C266.778 209.647 269.064 209.001 271.5 209.001C278.956 209.001 285 215.045 285 222.501C285 229.957 278.956 236.001 271.5 236.001C268.624 236.001 265.958 235.101 263.769 233.568C261.401 232.237 253.928 228.647 251 234.501V285.001H201.329C197.044 288.961 197.041 292.43 200.226 298.806C201.355 300.779 202.001 303.065 202.001 305.501C202.001 312.956 195.956 319 188.501 319.001C181.045 319.001 175.001 312.957 175.001 305.501C175.001 302.625 175.901 299.96 177.434 297.77C178.765 295.402 182.354 287.929 176.501 285.001H126V234.602C128.976 229.84 135.566 233.404 137.473 234.577C137.629 234.682 137.788 234.783 137.949 234.882C137.982 234.904 138 234.915 138 234.915V234.912C140.188 236.237 142.755 237.001 145.5 237.001C153.508 237.001 160 230.509 160 222.501C160 214.493 153.508 208.001 145.5 208.001C142.755 208.001 140.188 208.764 138 210.089V210.083C131.5 214.001 127 211.001 126 209.001V160.001H176.399C181.161 162.977 177.597 169.567 176.424 171.474C176.319 171.63 176.218 171.789 176.119 171.95C176.097 171.983 176.086 172.001 176.086 172.001H176.089C174.764 174.189 174 176.756 174 179.501C174 187.509 180.492 194.001 188.5 194.001C196.508 194.001 203 187.509 203 179.501C203 176.756 202.237 174.189 200.912 172.001H200.918C197 165.501 200 161.001 202 160.001H251V209.673Z"
        fill={blockD}
      />
      {/* Block P (Participate) */}
      <path
        opacity="0.94"
        d="M427.672 160.001C431.956 156.041 431.96 152.572 428.775 146.196C427.646 144.223 427 141.937 427 139.501C427 132.045 433.044 126.001 440.5 126.001C447.956 126.001 454 132.045 454 139.501C454 142.377 453.1 145.043 451.567 147.232C450.236 149.6 446.646 157.073 452.5 160.001H503V209.672C506.96 213.957 510.429 213.96 516.805 210.775C518.778 209.646 521.064 209 523.5 209C530.956 209 536.999 215.045 537 222.5C537 229.956 530.956 236 523.5 236C520.624 236 517.959 235.1 515.769 233.567C513.401 232.236 505.928 228.647 503 234.5L503 285.002H378L378 234.602C380.976 229.84 387.566 233.404 389.473 234.577C389.629 234.682 389.788 234.783 389.949 234.882C389.982 234.904 390 234.915 390 234.915V234.912C392.188 236.237 394.755 237.001 397.5 237.001C405.508 237.001 412 230.509 412 222.501C412 214.493 405.508 208.001 397.5 208.001C394.755 208.001 392.188 208.764 390 210.089V210.083C383.5 214.001 379 211.001 378 209.001V160.001H427.672ZM426 265.501C426 268.246 426.763 270.813 428.088 273.001H428.082C432 279.501 429 284.001 427 285.001H452.601C447.839 282.025 451.403 275.435 452.576 273.528C452.681 273.372 452.782 273.213 452.881 273.052C452.903 273.019 452.914 273.001 452.914 273.001H452.911C454.236 270.813 455 268.246 455 265.501C455 257.493 448.508 251.001 440.5 251.001C432.492 251.001 426 257.493 426 265.501Z"
        fill={blockP}
      />
      {/* Ghost block (P overlap) */}
      <path
        d="M377.002 209.673C380.962 213.957 384.431 213.961 390.807 210.776C392.78 209.647 395.066 209.001 397.502 209.001C404.958 209.001 411.002 215.045 411.002 222.501C411.002 229.957 404.958 236.001 397.502 236.001C394.626 236.001 391.96 235.101 389.771 233.568C387.403 232.237 379.93 228.647 377.002 234.501V285.001H327.331C323.046 288.961 323.043 292.43 326.228 298.806C327.357 300.779 328.003 303.065 328.003 305.501C328.003 312.956 321.958 319 314.503 319.001C307.047 319.001 301.003 312.957 301.003 305.501C301.003 302.625 301.903 299.96 303.436 297.77C304.767 295.402 308.356 287.929 302.503 285.001H252.001V160.001H302.401C307.163 162.977 303.599 169.567 302.426 171.474C302.321 171.63 302.22 171.789 302.121 171.95C302.099 171.983 302.088 172.001 302.088 172.001H302.091C300.766 174.189 300.002 176.756 300.002 179.501C300.002 187.509 306.494 194.001 314.502 194.001C322.51 194.001 329.002 187.509 329.002 179.501C329.002 176.756 328.239 174.189 326.914 172.001H326.92C323.002 165.501 326.002 161.001 328.002 160.001H377.002V209.673ZM271.502 208.001C268.757 208.001 266.19 208.764 264.002 210.089V210.083C257.502 214.001 253.002 211.001 252.002 209.001V234.602C254.978 229.84 261.568 233.404 263.475 234.577C263.631 234.682 263.79 234.783 263.951 234.882C263.984 234.904 264.002 234.915 264.002 234.915V234.912C266.19 236.237 268.757 237.001 271.502 237.001C279.51 237.001 286.002 230.509 286.002 222.501C286.002 214.493 279.51 208.001 271.502 208.001Z"
        fill={blockD}
        fillOpacity="0.35"
      />
      {/* Ghost block (A1 top-right area overlap) */}
      <path
        d="M251.001 83.6729C254.961 87.9573 258.43 87.9612 264.806 84.7764C266.779 83.6472 269.065 83.001 271.501 83.001C278.957 83.0012 285.001 89.0453 285.001 96.501C285.001 103.957 278.957 110.001 271.501 110.001C268.625 110.001 265.959 109.101 263.77 107.568C261.402 106.237 253.929 102.647 251.001 108.501V159.001H201.33C197.045 162.961 197.042 166.43 200.227 172.806C201.356 174.779 202.002 177.065 202.002 179.501C202.002 186.956 195.957 193 188.502 193.001C181.046 193.001 175.002 186.957 175.002 179.501C175.002 176.625 175.902 173.96 177.435 171.77C178.766 169.402 182.355 161.929 176.502 159.001H126.001V108.602C128.977 103.84 135.567 107.404 137.474 108.577C137.63 108.682 137.789 108.783 137.95 108.882C137.983 108.904 138.001 108.915 138.001 108.915V108.912C140.189 110.237 142.756 111.001 145.501 111.001C153.509 111.001 160.001 104.509 160.001 96.501C160.001 88.493 153.509 82.0012 145.501 82.001C142.756 82.001 140.189 82.7639 138.001 84.0889V84.083C131.501 88.0009 127.001 85.001 126.001 83.001V34.001H176.4C181.162 36.9768 177.598 43.5668 176.425 45.4736C176.32 45.6305 176.219 45.7892 176.12 45.9502C176.098 45.9831 176.087 46.001 176.087 46.001H176.09C174.765 48.1893 174.001 50.756 174.001 53.501C174.001 61.5089 180.493 68.001 188.501 68.001C196.509 68.001 203.001 61.5089 203.001 53.501C203.001 50.7562 202.238 48.1892 200.913 46.001H200.919C197.001 39.5008 200.001 35.0008 202.001 34.001H251.001V83.6729Z"
        fill={blockA1}
        fillOpacity="0.35"
      />
      {/* Ghost block (P top area) */}
      <path
        d="M427.672 34C431.956 30.04 431.96 26.5706 428.775 20.1953C427.646 18.2221 427 15.9363 427 13.5C427 6.04438 433.044 0 440.5 0C447.956 0 454 6.04438 454 13.5C454 16.3757 453.1 19.0416 451.567 21.2314C450.236 23.5987 446.646 31.0723 452.5 34L503 34L503 83.6709C506.96 87.9556 510.429 87.9594 516.805 84.7744C518.778 83.6453 521.064 82.999 523.5 82.999C530.956 82.999 536.999 89.0436 537 96.499C537 103.955 530.956 109.999 523.5 109.999C520.624 109.999 517.959 109.099 515.769 107.566C513.401 106.235 505.928 102.646 503 108.499V159.001H378V108.601C380.976 103.839 387.566 107.403 389.473 108.576C389.629 108.681 389.788 108.782 389.949 108.881C389.982 108.903 390 108.914 390 108.914V108.911C392.188 110.236 394.755 111 397.5 111C405.508 111 412 104.508 412 96.5C412 88.492 405.508 82.0003 397.5 82C394.755 82 392.188 82.7629 390 84.0879V84.082C383.5 87.9999 379 85 378 83V34H427.672ZM426 139.5C426 142.245 426.763 144.812 428.088 147H428.082C432 153.5 429 158 427 159H452.601C447.839 156.024 451.403 149.434 452.576 147.527C452.681 147.371 452.782 147.212 452.881 147.051C452.903 147.018 452.914 147 452.914 147H452.911C454.236 144.812 455 142.245 455 139.5C455 131.492 448.508 125 440.5 125C432.492 125 426 131.492 426 139.5Z"
        fill={blockP}
        fillOpacity="0.35"
      />
      {/* Ghost block (S bottom-right) */}
      <path
        d="M629.003 208.673C632.963 212.957 636.432 212.961 642.808 209.776C644.781 208.647 647.067 208.001 649.503 208.001C656.959 208.001 663.003 214.045 663.003 221.501C663.003 228.957 656.959 235.001 649.503 235.001C646.627 235.001 643.961 234.101 641.771 232.568C639.404 231.237 631.931 227.647 629.003 233.501V284.001H579.332C575.047 287.961 575.044 291.43 578.229 297.806C579.358 299.779 580.004 302.065 580.004 304.501C580.004 311.957 573.959 318.001 566.503 318.001C559.047 318.001 553.004 311.957 553.004 304.501C553.004 301.625 553.904 298.96 555.437 296.77C556.768 294.402 560.357 286.929 554.504 284.001H504.002V159.001H554.402C559.164 161.977 555.6 168.567 554.427 170.474C554.322 170.63 554.22 170.789 554.122 170.95C554.1 170.983 554.089 171.001 554.089 171.001H554.092C552.767 173.189 552.003 175.756 552.003 178.501C552.003 186.509 558.495 193.001 566.503 193.001C574.511 193.001 581.003 186.509 581.003 178.501C581.003 175.756 580.24 173.189 578.915 171.001H578.921C575.003 164.501 578.003 160.001 580.003 159.001H629.003V208.673ZM523.503 207.001C520.758 207.001 518.191 207.764 516.003 209.089V209.083C509.503 213.001 505.003 210.001 504.003 208.001V233.602C506.979 228.84 513.569 232.404 515.476 233.577C515.632 233.682 515.791 233.783 515.952 233.882C515.985 233.904 516.003 233.915 516.003 233.915V233.912C518.191 235.237 520.758 236.001 523.503 236.001C531.511 236.001 538.003 229.509 538.003 221.501C538.003 213.493 531.511 207.001 523.503 207.001Z"
        fill={blockT}
        fillOpacity="0.35"
      />
      {/* Block S (Scale and Sustain) */}
      <path
        opacity="0.94"
        d="M679.672 159.001C683.956 155.041 683.96 151.572 680.775 145.196C679.646 143.223 679 140.937 679 138.501C679 131.045 685.044 125.001 692.5 125.001C699.956 125.001 706 131.045 706 138.501C706 141.377 705.1 144.043 703.567 146.232C702.236 148.6 698.646 156.073 704.5 159.001H755V208.672C758.96 212.957 762.429 212.96 768.805 209.775C770.778 208.646 773.064 208 775.5 208C782.956 208 788.999 214.045 789 221.5C789 228.956 782.956 235 775.5 235C772.624 235 769.959 234.1 767.769 232.567C765.401 231.236 757.928 227.647 755 233.5V284.002H630V233.602C632.976 228.84 639.566 232.404 641.473 233.577C641.629 233.682 641.788 233.783 641.949 233.882C641.982 233.904 642 233.915 642 233.915V233.912C644.188 235.237 646.755 236.001 649.5 236.001C657.508 236.001 664 229.509 664 221.501C664 213.493 657.508 207.001 649.5 207.001C646.755 207.001 644.188 207.764 642 209.089V209.083C635.5 213.001 631 210.001 630 208.001V159.001H679.672ZM678 264.501C678 267.246 678.763 269.813 680.088 272.001H680.082C684 278.501 681 283.001 679 284.001H704.601C699.839 281.025 703.403 274.435 704.576 272.528C704.681 272.372 704.782 272.213 704.881 272.052C704.903 272.019 704.914 272.001 704.914 272.001H704.911C706.236 269.813 707 267.246 707 264.501C707 256.493 700.508 250.001 692.5 250.001C684.492 250.001 678 256.493 678 264.501Z"
        fill={blockS}
      />
      {/* Block A2 (Access Readiness) – replaces original grey top-right block */}
      <path
        opacity="0.94"
        d="M377.004 83.6729C380.964 87.9573 384.433 87.9612 390.809 84.7764C392.782 83.6472 395.068 83.001 397.504 83.001C404.96 83.0012 411.004 89.0453 411.004 96.501C411.004 103.957 404.96 110.001 397.504 110.001C394.628 110.001 391.962 109.101 389.772 107.568C387.405 106.237 379.932 102.647 377.004 108.501V159.001H327.333C323.048 162.961 323.045 166.43 326.229 172.806C327.359 174.779 328.005 177.065 328.005 179.501C328.005 186.956 321.96 193 314.505 193.001C307.049 193.001 301.005 186.957 301.005 179.501C301.005 176.625 301.905 173.96 303.438 171.77C304.769 169.402 308.358 161.929 302.505 159.001H252.004V108.602C254.98 103.84 261.57 107.404 263.477 108.577C263.633 108.682 263.792 108.783 263.953 108.882C263.986 108.904 264.004 108.915 264.004 108.915V108.912C266.192 110.237 268.759 111.001 271.504 111.001C279.512 111.001 286.004 104.509 286.004 96.501C286.004 88.493 279.512 82.0012 271.504 82.001C268.759 82.001 266.192 82.7639 264.004 84.0889V84.083C257.504 88.0009 253.004 85.001 252.004 83.001V34.001H302.403C307.165 36.9768 303.601 43.5668 302.428 45.4736C302.323 45.6305 302.221 45.7892 302.123 45.9502C302.101 45.9831 302.09 46.001 302.09 46.001H302.093C300.768 48.1893 300.004 50.756 300.004 53.501C300.004 61.5089 306.496 68.001 314.504 68.001C322.512 68.001 329.004 61.5089 329.004 53.501C329.004 50.7562 328.241 48.1892 326.916 46.001H326.922C323.004 39.5008 326.004 35.0008 328.004 34.001H377.004V83.6729Z"
        fill={blockA2}
      />

      {/* Letter overlays – always white */}
      <path
        d="M57.0909 113H43.4545L58.8182 66.4545H76.0909L91.4545 113H77.8182L67.6364 79.2727H67.2727L57.0909 113ZM54.5455 94.6364H80.1818V104.091H54.5455V94.6364Z"
        fill="white"
      />
      <path
        d="M190.909 250H173V203.455H190.727C195.515 203.455 199.652 204.386 203.136 206.25C206.636 208.098 209.333 210.765 211.227 214.25C213.136 217.72 214.091 221.879 214.091 226.727C214.091 231.576 213.144 235.742 211.25 239.227C209.356 242.697 206.674 245.364 203.205 247.227C199.735 249.076 195.636 250 190.909 250ZM185.636 239.273H190.455C192.758 239.273 194.72 238.902 196.341 238.159C197.977 237.417 199.22 236.136 200.068 234.318C200.932 232.5 201.364 229.97 201.364 226.727C201.364 223.485 200.924 220.955 200.045 219.136C199.182 217.318 197.909 216.038 196.227 215.295C194.561 214.553 192.515 214.182 190.091 214.182H185.636V239.273Z"
        fill="white"
      />
      <path
        d="M554.727 91.6364V81.4545H595.182V91.6364H581.182V128H568.727V91.6364H554.727Z"
        fill="white"
      />
      <path
        d="M704.091 207C703.97 205.485 703.402 204.303 702.386 203.455C701.386 202.606 699.864 202.182 697.818 202.182C696.515 202.182 695.447 202.341 694.614 202.659C693.795 202.962 693.189 203.379 692.795 203.909C692.402 204.439 692.197 205.045 692.182 205.727C692.152 206.288 692.25 206.795 692.477 207.25C692.72 207.689 693.098 208.091 693.614 208.455C694.129 208.803 694.788 209.121 695.591 209.409C696.394 209.697 697.348 209.955 698.455 210.182L702.273 211C704.848 211.545 707.053 212.265 708.886 213.159C710.72 214.053 712.22 215.106 713.386 216.318C714.553 217.515 715.409 218.864 715.955 220.364C716.515 221.864 716.803 223.5 716.818 225.273C716.803 228.333 716.038 230.924 714.523 233.045C713.008 235.167 710.841 236.78 708.023 237.886C705.22 238.992 701.848 239.545 697.909 239.545C693.864 239.545 690.333 238.947 687.318 237.75C684.318 236.553 681.985 234.712 680.318 232.227C678.667 229.727 677.833 226.53 677.818 222.636H689.818C689.894 224.061 690.25 225.258 690.886 226.227C691.523 227.197 692.417 227.932 693.568 228.432C694.735 228.932 696.121 229.182 697.727 229.182C699.076 229.182 700.205 229.015 701.114 228.682C702.023 228.348 702.712 227.886 703.182 227.295C703.652 226.705 703.894 226.03 703.909 225.273C703.894 224.561 703.659 223.939 703.205 223.409C702.765 222.864 702.038 222.379 701.023 221.955C700.008 221.515 698.636 221.106 696.909 220.727L692.273 219.727C688.152 218.833 684.902 217.341 682.523 215.25C680.159 213.144 678.985 210.273 679 206.636C678.985 203.682 679.773 201.098 681.364 198.886C682.97 196.659 685.189 194.924 688.023 193.682C690.871 192.439 694.136 191.818 697.818 191.818C701.576 191.818 704.826 192.447 707.568 193.705C710.311 194.962 712.424 196.735 713.909 199.023C715.409 201.295 716.167 203.955 716.182 207H704.091Z"
        fill="white"
      />
      <path
        d="M431 239V192.455H451.091C454.545 192.455 457.568 193.136 460.159 194.5C462.75 195.864 464.765 197.78 466.205 200.25C467.644 202.72 468.364 205.606 468.364 208.909C468.364 212.242 467.621 215.129 466.136 217.568C464.667 220.008 462.598 221.886 459.932 223.205C457.28 224.523 454.182 225.182 450.636 225.182H438.636V215.364H448.091C449.576 215.364 450.841 215.106 451.886 214.591C452.947 214.061 453.758 213.311 454.318 212.341C454.894 211.371 455.182 210.227 455.182 208.909C455.182 207.576 454.894 206.439 454.318 205.5C453.758 204.545 452.947 203.818 451.886 203.318C450.841 202.803 449.576 202.545 448.091 202.545H443.636V239H431Z"
        fill="white"
      />
      <path
        d="M307.091 127H293.455L308.818 80.4545H326.091L341.455 127H327.818L317.636 93.2727H317.273L307.091 127ZM304.545 108.636H330.182V118.091H304.545V108.636Z"
        fill="white"
      />
    </svg>
  );
};

// ─── Stage score bar
const StageBar = ({
  stage,
  score,
  isTop,
  isBottom,
}: {
  stage: string;
  score: number;
  isTop: boolean;
  isBottom: boolean;
}) => {
  const colour = isTop ? "#12A74C" : isBottom ? "#EF4444" : "#6B7280";
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          fontSize: 13,
        }}
      >
        <span style={{ color: "var(--text-secondary, #9ca3af)" }}>
          {ADAPTS_LABELS[stage]}
        </span>
        <span style={{ color: colour, fontWeight: 600 }}>{score}</span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: colour,
            borderRadius: 3,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
};

export default function ResultsPage({
  hasPaid,
  onboarded,
  results,
}: ResultsPageProps) {
  if (!hasPaid) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h3>Complete payment to unlock your results</h3>
        <Link
          href="/payment?plan=individual"
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Unlock Assessment →
        </Link>
      </div>
    );
  }

  if (!onboarded) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3>You haven't taken the assessment yet</h3>
        <Link
          href="/assessment"
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Take Assessment →
        </Link>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3>Could not load results</h3>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
          style={{ marginTop: 24 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const { derived, completedAt, stageScores, energyScores, roleScores } =
    results;
  const primary = derived.primary_role;
  const secondary = derived.secondary_role;
  const pairingTitle = derived.role_pair_title;
  const date = formatDate(completedAt);
  const topStages = derived.top_adapts_stages;
  const bottomStages = derived.bottom_adapts_stages;
  const energyProfile = derived.energy_profile;
  const capacityScore = derived.change_capacity_score;

  // Build genius cards from real data
  const geniusCards = [
    {
      type: "genius",
      letter: primary?.[0] || "U",
      name: primary,
      desc: `You naturally excel here. You derive real energy and joy from the ${primary} role — it's where you're most alive.`,
    },
    {
      type: "genius",
      letter: secondary?.[0] || "A",
      name: secondary,
      desc: `Your secondary genius. You are highly capable here and contribute well without significant strain.`,
    },
    // Top ADAPTS stages → competency
    ...topStages.map((stage) => ({
      type: "competency",
      letter: ADAPTS_LABELS[stage]?.[0] || stage[0],
      name: ADAPTS_LABELS[stage] || stage,
      desc: `A natural strength. You thrive in the "${stage}" phase of change — this is one of your highest-scoring ADAPTS stages (${stageScores[stage as keyof typeof stageScores]}).`,
    })),
    // Bottom ADAPTS stages → frustration
    ...bottomStages.map((stage) => ({
      type: "frustration",
      letter: ADAPTS_LABELS[stage]?.[0] || stage[0],
      name: ADAPTS_LABELS[stage] || stage,
      desc: `An area of strain. Extended time in the "${stage}" phase can drain your energy. Your score here is ${stageScores[stage as keyof typeof stageScores]} — consider partnering with others who thrive here.`,
    })),
  ];

  const normalizedStageScores = Object.fromEntries(
    Object.entries(stageScores).map(([k, v]) => [normalizeStageName(k), v])
  ) as Record<AdaptsStage, number>;

  const narrative = buildNarrative({
    primary_role: derived.primary_role as Role,
    secondary_role: derived.secondary_role as Role,
    role_pair_title: derived.role_pair_title,
    energy_profile: derived.energy_profile,
    stage_scores: normalizedStageScores,
    top_adapts_stages: derived.top_adapts_stages as AdaptsStage[],
    bottom_adapts_stages: derived.bottom_adapts_stages as AdaptsStage[],
  });

  return (
    <>
      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Change Genius</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {primary} · {secondary}
          </div>
          <div className="stat-sub">
            <span className="stat-dot" style={{ background: "var(--green)" }} />
            Your natural gifts
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Pairing</div>
          <div className="stat-value" style={{ fontSize: 19 }}>
            {pairingTitle}
          </div>
          <div className="stat-sub">
            <span className="stat-dot" style={{ background: "var(--brand)" }} />
            {primary?.[0]}
            {secondary?.[0]} | {secondary?.[0]}
            {primary?.[0]}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Change Capacity</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {capacityScore}
            <span style={{ fontSize: 13, opacity: 0.5 }}>/100</span>
          </div>
          <div className="stat-sub">
            <span className="stat-dot" style={{ background: "var(--muted)" }} />
            Assessed {date}
          </div>
        </div>
      </div>

      {/* ADAPTS SVG */}
      <div className="puzzle-wrap">
        <div className="puzzle-title">Your ADAPTS Profile</div>
        <div className="puzzle-svg-container">
          <ADAPTS_SVG topStages={topStages} bottomStages={bottomStages} />
        </div>

        {/* Stage score bars beneath the SVG */}
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 32px",
          }}
        >
          {ADAPTS_ORDER.map((stage) => (
            <StageBar
              key={stage}
              stage={stage}
              score={stageScores[stage]}
              isTop={topStages.includes(stage)}
              isBottom={bottomStages.includes(stage)}
            />
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 12,
            fontSize: 12,
            color: "var(--text-secondary, #9ca3af)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#12A74C",
                display: "inline-block",
              }}
            />
            Top stages
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#EF4444",
                display: "inline-block",
              }}
            />
            Bottom stages
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#6B7280",
                display: "inline-block",
              }}
            />
            Neutral
          </span>
        </div>
      </div>

      {/* Energy Profile Card */}
      <div className="pairing-card" style={{ marginBottom: 16 }}>
        <div className="pairing-label">Energy Profile</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",

            gap: 12,
            marginTop: 12,
          }}
        >
          {(Object.entries(energyScores) as [string, number][])
            .sort(([, a], [, b]) => b - a)
            .map(([energy, score]) => {
              const isDominant = energy === energyProfile.dominant;
              const isSecondary = energy === energyProfile.secondary;
              const isDepleted = energy === energyProfile.depleted;
              const isStrain = energy === energyProfile.strain;
              const colour = isDominant
                ? "#12A74C"
                : isSecondary
                  ? "#3B82F6"
                  : isDepleted
                    ? "#EF4444"
                    : "#9CA3AF";
              const tag = isDominant
                ? "Dominant"
                : isSecondary
                  ? "Secondary"
                  : isStrain
                    ? "Strain"
                    : isDepleted
                      ? "Depleted"
                      : "";
              return (
                <div
                  key={energy}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${colour}33`,
                    borderRadius: 10,
                    padding: "12px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: colour,
                    }}
                  >
                    {score}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                    {energy}
                  </div>
                  {tag && (
                    <div
                      style={{
                        fontSize: 10,
                        marginTop: 4,
                        color: colour,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {tag}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Pairing Card */}
      <div className="pairing-card">
        <div className="pairing-label">Your Unique Pairing</div>
        <div className="pairing-name">{pairingTitle}</div>
        <div className="pairing-code">
          {primary?.[0]}
          {secondary?.[0]} | {secondary?.[0]}
          {primary?.[0]}
        </div>
        <div className="pairing-desc">{narrative.pairing_description}</div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "16px 0 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {narrative.pairing_benefits.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: 14,
                color: "var(--text-secondary, #9ca3af)",
              }}
            >
              <span style={{ color: "#12A74C", marginTop: 2, flexShrink: 0 }}>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-secondary, #9ca3af)",
              marginBottom: 10,
            }}
          >
            Watch Outs
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {narrative.pairing_watchouts.map((w, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 14,
                  color: "var(--text-secondary, #9ca3af)",
                }}
              >
                <span style={{ color: "#EF4444", marginTop: 2, flexShrink: 0 }}>
                  ⚠
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role Scores */}
      <div className="pairing-card" style={{ marginBottom: 16 }}>
        <div className="pairing-label">Role Score Breakdown</div>
        <div style={{ marginTop: 14 }}>
          {(Object.entries(roleScores) as [string, number][])
            .sort(([, a], [, b]) => b - a)
            .map(([role, score]) => {
              const isPrimary = role === primary;
              const isSecondary = role === secondary;
              const colour = isPrimary
                ? "#12A74C"
                : isSecondary
                  ? "#3B82F6"
                  : "#6B7280";
              return (
                <div key={role} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: 13,
                    }}
                  >
                    <span>
                      {role}
                      {isPrimary && (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 10,
                            color: "#12A74C",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Primary
                        </span>
                      )}
                      {isSecondary && (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 10,
                            color: "#3B82F6",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Secondary
                        </span>
                      )}
                    </span>
                    <span style={{ color: colour, fontWeight: 600 }}>
                      {score}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${score}%`,
                        background: colour,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Genius cards grid */}
      <div className="results-grid">
        {geniusCards.map((card, idx) => (
          <div key={idx} className="genius-card">
            <div className={`genius-header ${card.type}`}>
              <div>
                <div className={`genius-type ${card.type}`}>
                  {card.type === "genius"
                    ? "Change Genius"
                    : card.type === "competency"
                      ? "Change Competency"
                      : "Change Frustration"}
                </div>
                <div className="genius-name">{card.name}</div>
              </div>
              <div className={`genius-letter ${card.type}`}>{card.letter}</div>
            </div>
            <div className="genius-body">{card.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
