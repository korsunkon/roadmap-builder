import React from "react";
import { LEFT_COL, COL_W } from "../../constants";

interface PeriodInfo {
  label: string;
  sub: string;
}

interface Props {
  periods: PeriodInfo[];
  totalH: number;
  totalW: number;
}

export const GridHeader: React.FC<Props> = ({ periods, totalH }) => {
  const elements: React.ReactNode[] = [];

  periods.forEach((_p, i) => {
    const x = LEFT_COL + i * COL_W;
    // Vertical column line
    elements.push(<line key={`gl${i}`} x1={x} y1={0} x2={x} y2={totalH} stroke="#ECECEC" strokeWidth={0.5} />);
    // Mid-period dashed line
    const mx = x + COL_W / 2;
    elements.push(<line key={`md${i}`} x1={mx} y1={0} x2={mx} y2={totalH} stroke="#F5F5F0" strokeWidth={0.5} strokeDasharray="3,4" />);
  });

  // Closing column line
  elements.push(<line key="clsln" x1={LEFT_COL + periods.length * COL_W} y1={0} x2={LEFT_COL + periods.length * COL_W} y2={totalH} stroke="#ECECEC" strokeWidth={0.5} />);
  // Left column border
  elements.push(<line key="vln" x1={LEFT_COL} y1={0} x2={LEFT_COL} y2={totalH} stroke="#E0E0E0" strokeWidth={1} />);

  return <>{elements}</>;
};
