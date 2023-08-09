# perf_example

一個首頁性能優化的範例

[優化前頁面](https://outshaker.github.io/perf_example/origin/) ^[1]
[優化後頁面](https://outshaker.github.io/perf_example/improved/) [評測頁面](https://googlechrome.github.io/lighthouse/viewer/?psiurl=https%3A%2F%2Foutshaker.github.io%2Fperf_example%2Fimproved%2F&strategy=desktop&category=performance)

透過以下方式改善網頁性能指標：

- 使用 webp 圖片格式減少網頁流量，加快頁面載入速度
- 利用 github pages CDN 所提供的 gzip 壓縮傳輸檔案，減少網頁流量
- 使用 link "preload" 預加載首頁圖，加快 FCP, LCP
- 使用 link "preload" 預加載字型檔案
- 調整 css, js 在網頁中的順序，讓網頁解析流程更順暢

評測結果：

![20230809-211224](https://github.com/outshaker/perf_example/assets/536861/ce90bad4-e593-4058-8025-24be3bf870b6)

[1]: 該網頁因為 NO_FCP, NO_LCP 等錯誤沒辦法順利取得評測成績，只能側面透過[其他間接方式](https://pagespeed.web.dev/analysis/https-icybox-de-en/mhvqfqio9b?form_factor=desktop)判斷網頁的性能分數大致落在哪裡
