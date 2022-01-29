interface PreviousValues {
    marginTop: string
    visibility: string
}

const delayFirstContentfulPaint = () => {
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

const delaySidebarRendering = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector<HTMLElement>('aside#extra aside.ad')
        if (!sidebar) {
            return console.error('Sidebar is not exists')
        }
        const firstElement = sidebar.querySelector<HTMLElement>('aside:first-of-type')
        if (!firstElement) {
            return console.error('Sidebar is broken')
        }
        const values: PreviousValues = {
            marginTop: firstElement.style.marginTop,
            visibility: sidebar.style.visibility,
        }
        sidebar.style.visibility = 'hidden'
        firstElement.style.marginTop = '3000px'
        setTimeout(() => {
            requestAnimationFrame(() => {
                firstElement.style.marginTop = values.marginTop
                sidebar.style.visibility = values.visibility
            })
        }, 5 * 1000);
    }, { once: true })
}

delaySidebarRendering()
delayFirstContentfulPaint()
