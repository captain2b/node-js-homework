const getAutoSuggestUsers = (data = [], loginSubstring = '', limit = null) => {
  if (!loginSubstring && !limit) {
    return data;
  }
  const filtered = data
    // .sort()
    .filter((el) => (el?.login && el.login.includes(loginSubstring)));

  return limit ? filtered.slice(0, limit) : filtered;
};

export default getAutoSuggestUsers;
