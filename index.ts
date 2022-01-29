/**
* First Contentful Paint (FCP) を DOMContentLoaded 以降に遅延させてチラつきを防止する
*/
function delayFirstContentfulPaint() {
    if (document.readyState !== 'loading') {
        return
    }
    document.documentElement.style.visibility = 'hidden'
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.documentElement.style.visibility = ''
        })
    }, { once: true })
}

/**
* サイドバーを一時的に隠すことでレイアウトシフトの回数を減らす
*/
function delaySidebarRendering() {
    document.addEventListener('DOMContentLoaded', () => {
        // サイドバー
        const sidebar = document.querySelector<HTMLElement>('aside#extra')
        if (!sidebar) {
            return console.error('Sidebar is not exists')
        }
        // サイドバーを隠す
        requestAnimationFrame(() => {
            sidebar.style.display = 'none'
        })
        // 数秒後にサイドバーを戻す
        setTimeout(() => {
            requestAnimationFrame(() => {
                const posY = window.scrollY
                sidebar.style.display = ''
                window.scroll(0, posY)
            })
        }, 10 * 1000);
    }, { once: true })
}

delaySidebarRendering()
delayFirstContentfulPaint()
