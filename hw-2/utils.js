const getAutoSuggestUsers = (data = [], loginSubstring = '', limit = null) => {
  const sortedData = data.sort((a, b) => a.login.localeCompare(b.login));

  if (!loginSubstring && !limit) {
    return sortedData;
  }
  const filtered = sortedData
    .filter((el) => (el?.login && el.login.includes(loginSubstring)));

  return limit ? filtered.slice(0, limit) : filtered;
};

export default getAutoSuggestUsers;
