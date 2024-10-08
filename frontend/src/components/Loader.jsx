import style from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={style["spinnerContainer"]}>
      <div className={style["spinner"]}></div>
      <div className={style["loader"]}>
        <p>User Creation</p>
        <div className={style["words"]}>
          <span className={style["word"]}></span>
          <span className={style["word"]}>Full name</span>
          <span className={style["word"]}>Username</span>
          <span className={style["word"]}>Email</span>
          <span className={style["word"]}>✅</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
