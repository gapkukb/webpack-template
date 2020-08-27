export const getParams = (location?: string):URLSearchParams => {
    return new URLSearchParams(location || window.location.search.substring(1))
}
