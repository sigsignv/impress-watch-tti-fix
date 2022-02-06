# Impress Watch Sidebar fix

[Impress Watch](https://www.watch.impress.co.jp/) のサイドバーで発生するレイアウトシフトを減らします。

## Summary

Impress Watch ではサイドバーに広告を挿入する際に複数回のレイアウトシフトが発生します。

このレイアウトシフトによってスクロール位置がジャンプするなど閲覧に支障があるため、次の対策を行います。

* 一時的にサイドバーを `display: none` で隠します
* サイドバーを隠している間に広告が挿入されるため、レイアウトシフトは回避されます
* 広告のロードが終了したタイミングを見計らってサイドバーを復元します

## Install

[dist/impress-watch-sidebar-fix.user.js](https://github.com/sigsignv/impress-watch-sidebar-fix/raw/main/dist/impress-watch-sidebar-fix.user.js)

## Author

Sigsign <<sig@signote.cc>>

## License

Apache-2.0
