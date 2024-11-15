export function redirection(url){
    // var returnURL=url;
    if (window.location.href.includes('github')) {
        returnURL = "/dividedData/"+url;
    }
    return url;
}