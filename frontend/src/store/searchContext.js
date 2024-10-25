import { createContext } from "react";

const searchContext = createContext({
  searchData: {
    searchQuery: "",
  },
  setSearchData: () => {},
  handleOnChange: () => {},
  checkKey: () => {},
});

export default searchContext;
