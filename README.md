# Impress Watch Sidebar fix

Impress Watch 各媒体のサイドバーで発生するレイアウトシフトを減らします。

## Summary

Impress Watch ではサイドバーに広告を挿入する際に複数回のレイアウトシフトが発生します。

サイドバーのレイアウトシフトに伴ってスクロール位置がジャンプするなど閲覧に支障があるため、次の対策を行います。

* 一時的にサイドバーを `visibility: hidden` で隠します
* 一時的に広告エリアを `margin-top` で広げておき、レイアウトシフトを防ぎます
* 広告のロードが終了したタイミングを見計らって、サイドバーを復元します

## Author

Sigsign <<sig@signote.cc>>

## License

Apache-2.0
