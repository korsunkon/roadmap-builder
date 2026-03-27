import React from "react";

interface Props {
  todayX: number;
  totalH: number;
  visible: boolean;
}

export const TodayMarker: React.FC<Props> = ({ todayX, totalH, visible }) => {
  if (!visible) return null;
  return (
    <>
      <rect x={todayX - 32} y={2} width={64} height={20} rx={3} fill="#222" />
      <text x={todayX} y={15} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#fff" letterSpacing={1} fontFamily="Inter,sans-serif">
        СЕГОДНЯ
      </text>
      <line x1={todayX} y1={24} x2={todayX} y2={totalH} stroke="#222" strokeWidth={1.5} strokeDasharray="5,4" opacity={0.4} />
    </>
  );
};
