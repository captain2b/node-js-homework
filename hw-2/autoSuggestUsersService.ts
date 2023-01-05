
export interface User {
 login: string;
}
const autoSuggestUsersService = (data: User[] = [], loginSubstring = '', limit: number | string | undefined = undefined) => {
    const sortedData = data.sort((a, b) => a.login.localeCompare(b.login));

    if (!loginSubstring && !limit) {
        return sortedData;
    }
    const filtered = sortedData
        .filter((el) => (el?.login && el.login.includes(loginSubstring)));

    return limit ? filtered.slice(0, Number(limit)) : filtered;
};

export default autoSuggestUsersService;
