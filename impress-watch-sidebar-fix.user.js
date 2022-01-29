// ==UserScript==
// @name      Impress Watch: Sidebar fix
// @namespace https://github.com/sigsignv/userjs-impress-watch-sidebar-fix
// @version   0.1.0
// @author    Sigsign
// @license   MIT or Apache-2.0
// @match     https://*.watch.impress.co.jp/docs/*
// @run-at    document-start
// @noframes
// @grant     none
// ==/UserScript==
(function () {
'use strict';

const delayFirstContentfulPaint = () => {
    if (document.readyState !== 'loading') {
        return;
    }
    document.documentElement.style.visibility = 'hidden';
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.documentElement.style.visibility = '';
        });
    }, { once: true });
};
const delaySidebarRendering = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector('aside#extra aside.ad');
        if (!sidebar) {
            return console.error('Sidebar is not exists');
        }
        const firstElement = sidebar.querySelector('aside:first-of-type');
        if (!firstElement) {
            return console.error('Sidebar is broken');
        }
        const values = {
            marginTop: firstElement.style.marginTop,
            visibility: sidebar.style.visibility,
        };
        sidebar.style.visibility = 'hidden';
        firstElement.style.marginTop = '3000px';
        setTimeout(() => {
            requestAnimationFrame(() => {
                firstElement.style.marginTop = values.marginTop;
                sidebar.style.visibility = values.visibility;
            });
        }, 5 * 1000);
    }, { once: true });
};
delaySidebarRendering();
delayFirstContentfulPaint();

})();
