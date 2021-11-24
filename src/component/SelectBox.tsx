import { Select } from "@material-ui/core";
import { MCode } from "@model/Common";
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";

type Props = {
  value?: string | number;
  codes: MCode[];
  onSelected?: (value: MCode) => void;
  className?: string;
  onClick?: (oldValue: string | number) => void;
  style?: React.CSSProperties;
};
const SelectBox: React.FC<Props> = ({
  value,
  codes,
  onSelected,
  className,
  style,
  onClick = () => {},
}) => {
  const [state, setState] = useState<string | number | undefined>(value);

  useEffect(() => {
    setState(value);
  }, [value]);
  return (
    <select
      style={style}
      className={className}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(`onChange:e: React.ChangeEvent<HTMLSelectElement>`);
        e.preventDefault();
        const newValue = codes.find((v) => v.code === e.target.value);
        newValue && onSelected && onSelected(newValue);
      }}
      onClick={(e: React.MouseEvent<HTMLSelectElement>) => {
        console.log(`selectbox: ${e.currentTarget}`);
        // option click 처리
        // 선택된 값 click시 해당 값을 비교하여 처리 해야함.
        console.log(`selectbox.detail: ${e.detail}`);
        console.log(`e.currentTarget.value: ${e.currentTarget.value}`);
        if (e.detail === 0) {
          // console.log(e.currentTarget.value);
          onClick && onClick(e.currentTarget.value);
          // on()
        }
      }}
      onBlur={() => {
        // console.log(`onBlur`);
      }}
      onFocus={() => {
        // console.log(`onFocus`);
      }}
      value={state}
    >
      {/* {!state && <option value={""}>선택해주세요</option>} */}
      {codes.map((v, i) => (
        <option key={uniqueId(`selectBox_${i}`)} value={v.code}>
          {v.label}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
