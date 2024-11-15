export function redirection(url){
    // var returnURL=url;
    if (window.location.href.includes('github')) {
        url = "/dividedData/"+url;
    }
    else{
        url = "/"+url;
    }
    return url;
}