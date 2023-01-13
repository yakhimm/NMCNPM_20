const getNumberOfPage = (totals) => {
  return [...Array(Math.ceil(totals / 10)).keys()];
};

module.exports = {
  getNumberOfPage,
  
  getDataRender: (recipesSearch, page, limit) => {
    return recipesSearch.slice((page - 1) * limit, (page - 1) * limit + limit);
  },
  isEqual: (str, pat) => {
    return str == pat;
  },
  prevPage: (page) => {
    return page >= 2 ? --page : page;
  },
  nextPage: (page, total) => {
    return Number(page) < getNumberOfPage(+total).length ? ++page : page;
  },
};
