interface PreviousValues {
    marginTop: string
    visibility: string
}

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
        const sidebar = document.querySelector<HTMLElement>('aside#extra aside.ad')
        if (!sidebar) {
            return console.error('Sidebar is not exists')
        }
        // サイドバーの広告以外で一番上の要素
        const firstElement = sidebar.querySelector<HTMLElement>('aside:first-of-type')
        if (!firstElement) {
            return console.error('Sidebar is broken')
        }
        // 値を保存
        const values: PreviousValues = {
            marginTop: firstElement.style.marginTop,
            visibility: sidebar.style.visibility,
        }
        // サイドバーを隠す
        requestAnimationFrame(() => {
            sidebar.style.visibility = 'hidden'
            firstElement.style.marginTop = '3000px'
        })
        // 数秒後にサイドバーを戻す
        setTimeout(() => {
            requestAnimationFrame(() => {
                const posY = window.scrollY
                firstElement.style.marginTop = values.marginTop
                sidebar.style.visibility = values.visibility
                // スクロール位置が一定以上動いていたら戻す
                if (Math.abs(posY - window.scrollY) > 300) {
                    console.log('Restore scroll position')
                    window.scroll(0, posY)
                }
            })
        }, 5 * 1000);
    }, { once: true })
}

delaySidebarRendering()
delayFirstContentfulPaint()
