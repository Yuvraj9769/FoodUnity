import React from "react";
import style from "./PageLoader.module.css";

const PageLoader = () => {
  return (
    <div className={style["banter-loader"]}>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
      <div className={style["banter-loader__box"]}></div>
    </div>
  );
};

export default PageLoader;
