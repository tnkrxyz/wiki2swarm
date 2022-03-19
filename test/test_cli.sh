#! /bin/bash

./src/index.js

./src/index.js --help

 #Mirror a single zim url
./src/index.js https://download.kiwix.org/zim/wikipedia/wikipedia_en_ray_charles_mini_2022-02.zim \
    -v --bee-api-url  https://gateway-proxy-bee-0-0.gateway.ethswarm.org/

# Mirror multiple urls
./src/index.js https://download.kiwix.org/zim/wikipedia/wikipedia_en_ray_charles_mini_2022-02.zim \
               https://download.kiwix.org/zim/wikipedia/wikipedia_bm_all_maxi_2022-02.zim \
    --bee-api-url  https://gateway-proxy-bee-0-0.gateway.ethswarm.org/ -v

# use feed upload (won't work without valid bee-debug-api-url, stamp, identity, and password)
./src/index.js https://download.kiwix.org/zim/wikipedia/wikipedia_en_ray_charles_mini_2022-02.zim \
               https://download.kiwix.org/zim/wikipedia/wikipedia_bm_all_maxi_2022-02.zim \
    --bee-api-url  https://gateway-proxy-bee-0-0.gateway.ethswarm.org/ \
    --bee-debug-api-url  http://localhost:1635 \
    --stamp be47c1cfae803a1354f62ff855618a1f0360f710b5cb7d524a1a0449567c759a \
    --identity main --password 0xfedcba0987654321 --feed