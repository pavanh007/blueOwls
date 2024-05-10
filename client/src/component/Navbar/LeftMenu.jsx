import React from "react";
import { Input } from "antd";
const { Search } = Input;

const LeftMenu = ({ mode }) => {
  const onSearch = (value, _e, info) => {};
  return (
    <div style={{ textAlign: "center" }}>
      <Search
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        placeholder="Input search text"
        onSearch={onSearch}
        enterButton
      />
    </div>
  );
};

export default LeftMenu;
