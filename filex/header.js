Vue.component('search-bar', {
    template:
        `
      <div class="sPanel" :class="{'is:on': searchPanel}" >
        <div class="sPanel_wrap" style="z-index: 9999" >
            <header class="sPanel_head">
                <input ref="search" id="productSearch" type="search" class="input" v-model="keyword" @keyup="keywordSearch" placeholder="` +
        msg_p_header_search_placeholder +
        `">
                <div class="sPanel_btn">
                    <button class="btn" @click="keywordSearch()">` +
        msg_p_header_search +
        `</button>
                </div>
            </header>
            <main v-if="status.searchMainInfo" class="sPanel_body">
                <div v-if="status.searchEmptyInfo" class="sPanel_noResult">` +
        msg_p_header_not_any_result +
        `</div>
                <ol v-else class="sPanel_result">
                    <template v-for="(item, key) in searchResult">
                        <li class="sPanel_item">
                            <button style="border: none;background: unset;color: #00AEEF;margin: 8px;font-size: 16px;" @click="keywordSearchRecords(item.id,item.url_title,item.sku_no)">
                            <span class="sPanel_icon">
                                <i class="icon fas fa-chevron-right"></i>
                            </span>{{ item.name }} 
                            <span class= "sPanel_label">{{ item.sku_no }}</span>
                        </button>
                        </li>
                    </template>
    
                </ol>
            </main>
        </div>
        <div class="overlay" @click="() => this.$emit('search-panel-switch')"></div>
    </div>
    `,
    props: ['searchPanel'],
    data() {
        return {
            keyword: '',
            searchResult: {},
            status: {
                searchMainInfo: false,
                searchEmptyInfo: false,
            },
        };
    },
    methods: {
        keywordSearch(e) {
            let self = this;

            if (this.keyword.length === 0) {
                self.status.searchMainInfo = false;
                self.status.searchEmptyInfo = false;
                self.searchResult = {};
                return;
            }

            if (this.keyword.length >= 3 || e === undefined || e.keyCode === 13) {
                if (
                    this.keyword.toLowerCase().startsWith('ib-') &&
                    this.keyword.length < 7
                ) {
                    return;
                }

                let postData = {
                    locale: lang,
                    keyword: this.keyword,
                };
                $.ajax({
                    type: 'post',
                    url: apiUrl + 'search/searchProducts',
                    data: postData,
                    success: function (data) {
                        self.searchResult = data.data;
                        self.status.searchMainInfo = true;

                        if (data.data.length > 0) {
                            self.status.searchEmptyInfo = false;
                        } else {
                            self.status.searchEmptyInfo = true;
                        }
                    },
                    dataType: 'json',
                });
            }
        },
        keywordSearchRecords(id, title, no) {
            let urlPrefix = '';
            if (window.location.hostname == 'localhost') {
                urlPrefix = '/lanFront/';
            }

            let postData = {
                keyWord: $('#productSearch').val(),
                productId: id
            };

            $.ajax({
                type: 'POST',
                url: apiUrl + 'set/searchKeyword',
                data: postData,
                success: function (data) {
                },
                dataType: 'json',
            });

            window.location.assign(urlPrefix + '/' + title + '/' + no);
        },
    },
});

Vue.component('cookie-banner', {
    template: `
    <div class="cookie-banner" v-if="!isHidden">
        <div class="wrapper">
            <div class="content">
              ${cookie_banner_content}
            </div>
            <div class="cookie-btns">
                <a class="btn" onclick="showModal('cookie-modal')">${cookiePageBtn5}</a>
                <a href="#" @click="cookieAgree" class="btn">${cookiePageBtn4}</a>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            isHidden: false,
        };
    },
    beforeMount() {
        let cookieAgree = localStorage.getItem('cookie_agree');
        if (cookieAgree) {
            this.isHidden = true;
        } else {
            this.isHidden = false;
        }
    },
    methods: {
        cookieAgree() {
            localStorage.setItem('cookie_agree', 'true');
            setCookies(1);
            this.isHidden = true;
        },
    },
});

$(window).on('load', function () {
    $('#app').addClass('loaded');
    // 禁用自動編碼
    $.cookie.raw = true;
    let cookieValue = $.cookie('essential');
    let getEssential = '';
    if (cookieValue) {
        getEssential = $.cookie('essential');
    } else {
        getEssential = { analyticcookie: 0, functionalcookie: 0, marketingcookie: 0, rightBox: 0 };
        const objStr = JSON.stringify(getEssential);
        // 使用 $.cookie 來存儲序列化後的對象到 cookie
        $.cookie('essential', objStr);
    }
    const obj = JSON.parse(getEssential);
    if (obj.marketingcookie != 1) {

    }
    if (obj.functionalcookie != 1) {
        $.removeCookie('cookie_agree', { path: '/' });
    }
    if (obj.analyticcookie != 1) {
        $.removeCookie('_ga', { path: '/' });
        $.removeCookie('_ga_F99KXEB97J', { path: '/' });
        $.removeCookie('_fbp', { path: '/' });
        $.removeCookie('_ga', { path: '/', domain: '.icybox.de' });
        $.removeCookie('_ga_F99KXEB97J', { path: '/', domain: '.icybox.de' });
        $.removeCookie('_fbp', { path: '/', domain: '.icybox.de' });
        $.removeCookie('_ga_5XK83QKW0W', { path: '/', domain: '.icybox.de' });
        $.removeCookie('_gat_gtag_UA_187579170_1', { path: '/', domain: '.icybox.de' });
        $.removeCookie('_gid', { path: '/', domain: '.icybox.de' });
    }
});
