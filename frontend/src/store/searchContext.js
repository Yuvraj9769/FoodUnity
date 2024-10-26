import { createContext } from "react";

const searchContext = createContext({
  searchData: {
    searchQuery: "",
  },
  setSearchData: () => {},
  handleOnChange: () => {},
  checkKey: () => {},
  isFilterOn: false,
  checkandSetFilter: () => {},
});

export default searchContext;
