export function redirection(url) {
    // var returnURL=url;
    if (window.location.href.includes('github')) {
        url = "/dividedData/" + url;
    }
    else {
        url = "/" + url;
    }
    return url;
}


import { auth } from "./inicializarFB.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        const exemptKeywords = [
            'home.html',
            'login/login.html',
            'character/character_view',
            'users/user_view',
            'consent/consent_view',
            'relations_character/see_relations'
        ];

        const isExempt = exemptKeywords.some(keyword => currentUrl.includes(keyword));

        if (!isExempt) {
            window.location.href = redirection('login/login.html');
        } else {
            console.log('URL is exempt, no redirection.');
        }
    } else {
        console.log('User is authenticated:', user);
    }
});
