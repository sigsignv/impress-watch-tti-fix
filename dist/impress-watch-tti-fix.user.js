// ==UserScript==
// @name        Impress Watch: TTI fix
// @description Reduce TTI (Time to Interactive) in Impress Watch
// @namespace   https://github.com/sigsignv/impress-watch-tti-fix
// @version     0.4.0
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
            const comebackSidebar = () => {
                requestAnimationFrame(() => {
                    const posY = window.scrollY;
                    sidebar.style.display = '';
                    window.scroll(0, posY);
                });
            };
            if (typeof window.requestIdleCallback === 'function') {
                requestIdleCallback(comebackSidebar);
            }
            else {
                setTimeout(comebackSidebar, 1);
            }
        }, { once: true });
    }, { once: true });
}
delayFirstContentfulPaint();
asyncImageDecoding();
delaySidebarRendering();

})();
