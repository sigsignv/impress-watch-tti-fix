// ==UserScript==
// @name        Impress Watch: TTI fix
// @description Reduce TTI (Time to Interactive) in Impress Watch
// @namespace   https://github.com/sigsignv/impress-watch-tti-fix
// @updateURL   https://github.com/sigsignv/impress-watch-tti-fix/raw/main/dist/impress-watch-tti-fix.user.js
// @version     0.5.2
// @author      Sigsign
// @license     Apache-2.0
// @match       https://*.watch.impress.co.jp/docs/*
// @run-at      document-start
// @noframes
// @grant       none
// ==/UserScript==
(function () {
'use strict';

/**
* First Contentful Paint を遅延させて CLS を防止する
*/
function delayFirstContentfulPaint() {
    if (document.readyState !== 'loading') {
        return;
    }
    document.documentElement.style.visibility = 'hidden';
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.documentElement.style.visibility = '';
        });
    });
}
/**
 * 画像のデコードを非同期化する
 */
function asyncImageDecoding() {
    const lazyLoad = async (img) => {
        const src = img.attributes.getNamedItem('ajax')?.value;
        if (!src) {
            return;
        }
        const url = new URL(src);
        if (!url.hostname.endsWith('.impress.co.jp')) {
            return;
        }
        img.loading = 'lazy';
        img.src = src;
        img.attributes.removeNamedItem('ajax');
    };
    document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'interactive') {
            return;
        }
        const images = document.querySelectorAll('img');
        for (const img of images) {
            img.decoding = 'async';
            lazyLoad(img);
        }
    });
}
/**
* アイドル状態になるまでサイドバーを隠して CLS を防止する
*/
function delaySidebarRendering() {
    document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector('aside#extra');
        if (!sidebar) {
            return;
        }
        requestAnimationFrame(() => {
            sidebar.style.display = 'none';
        });
        window.addEventListener('load', () => {
            const restoreSidebar = () => {
                requestAnimationFrame(() => {
                    const posY = window.scrollY;
                    sidebar.style.display = '';
                    document.body.classList.remove("ad-trace");
                    window.scroll(0, posY);
                });
            };
            setTimeout(() => {
                if (typeof window.requestIdleCallback === 'function') {
                    requestIdleCallback(restoreSidebar);
                }
                else {
                    restoreSidebar();
                }
            }, 3 * 1000);
        }, { once: true });
    }, { once: true });
}
/**
 * URL に応じて UserCSS を追加する
 */
function injectStyle(userStyle) {
    const url = new URL(document.URL);
    const canonical = `${url.hostname}${url.pathname}`;
    const rules = Object.entries(userStyle).filter(([key,]) => {
        return canonical.includes(key);
    }).flatMap(([, arr]) => arr);
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.append(...rules);
    if (document.readyState !== 'loading') {
        requestAnimationFrame(() => {
            document.head.appendChild(style);
        });
    }
    else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }
}
const UserStyle = {
    '.impress.co.jp': [
        `aside.ad .OUTBRAIN { display: none; }`,
        `#taboola-below-article-thumbnails-top-desktop { display: none; }`,
        `#taboola-below-article-thumbnails-bottom-desktop { display: none; }`,
        `article .main-contents .ad-inline { display: none; }`,
    ],
    'pc.watch.impress.co.jp': [
        `#pc-rakuten-ranking, #pc-amazon-ranking { display: none; }`,
    ],
};
delayFirstContentfulPaint();
asyncImageDecoding();
delaySidebarRendering();
injectStyle(UserStyle);

})();
