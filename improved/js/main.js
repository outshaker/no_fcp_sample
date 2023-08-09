(function () {
  $(document).ready(function () {
    const productOwl = $(".productCarouselSection .owl-carousel");
    productOwl.owlCarousel({
      loop: true,
      items: 5,
      nav: false,
      dots: false,
      responsive: {
        768: { items: 4 },
        1024: { items: 5 },
      },
    });

    $(".product-carousel__nav--prev").click(function () {
      productOwl.trigger("prev.owl.carousel");
    });

    $(".product-carousel__nav--next").click(function () {
      productOwl.trigger("next.owl.carousel");
    });

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const $kvCarousel = $('.kv-carousel.owl-carousel');
    $kvCarousel.owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        autoplay: true,
        dots: isMobile ? false : true,
        autoplayTimeout: 8000,
        autoplayHoverPause: true,
        video: true
    });

    // NOTE disabled
    /*
    const workspaceOwl = $(".workspace-carousel.owl-carousel"); 
    workspaceOwl.owlCarousel({
      // loop: true,
      items: 3,
      nav: false,
      dots: false,
      responsive: {
        0: {
          items: 2,
          center: true,
          margin: 16,
          autoWidth: true,
        },
        768: { items: 2 },
        1200: { items: 3 },
      },
    });

    $(".workspace-carousel__nav--prev").click(function () {
      workspaceOwl.trigger("prev.owl.carousel");
      workspaceOwl.trigger("prev.owl.carousel");
      workspaceOwl.trigger("prev.owl.carousel");
    });

    $(".workspace-carousel__nav--next").click(function () {
      workspaceOwl.trigger("next.owl.carousel");
      workspaceOwl.trigger("next.owl.carousel");
      workspaceOwl.trigger("next.owl.carousel");
    });*/
  });
})();

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
                <button @click="showModal('cookie-modal')" class="btn">${cookiePageBtn5}</button>
                <button @click="cookieAgree" class="btn">${cookiePageBtn4}</button>
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
        this.isHidden = localStorage.getItem('cookie_agree') ? true : false
    },
    methods: {
        cookieAgree() {
            localStorage.setItem('cookie_agree', 'true');
            setCookies(1);
            this.isHidden = true;
        },
    },
});

$(document).ready(function () {
  $('#app').addClass('loaded');
})

$(window).on('load', function () {
    // 禁用自動編碼
    $.cookie.raw = true;
    const essential = $.cookie('essential')
    const config = essential ? JSON.parse(essential) : { analyticcookie: 0, functionalcookie: 0, marketingcookie: 0, rightBox: 0 }
    if (!essential) $.cookie('essential', JSON.stringify(config))

    if (config.functionalcookie === 0) {
        $.removeCookie('cookie_agree', { path: '/' });
    }
    if (config.analyticcookie === 0) {
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
    if (config.marketingcookie === 0) { /* ... */}
});

const vm = new Vue({
    el: '#app',
    component: {},
    data: {
        banners: {},
        products: {},
        // productsTop: {},
        // productsOther: {},
        configurator: {},
        configurator_products: {},
        news: {},
        // photoWall0: {},
        // photoWall1: {},
        // photoWall2: {},
        // photoWall3: {},
        // photoWall4: {},
        // photoWall5: {},
        // photoWall6: {},
        // photoWall7: {},
        filterItems: [],
        lang: {
            // topMenuProduct: 'Products'
        },
        dataReady: false,

        status: {
            mobileMenu: false,
            desktopMenu: false,
            filterVisible: false,
            productFeature: 0,
            searchPanel: false,
            // searchEmptyInfo: true
        },
        // keyword: '',
        // searchResult: {},
    },
    beforeMount() {
        this.status.productFeature = typeof productFeatureID !== 'undefined' ? productFeatureID : null;
        setLanguage();

        // this.locale = 'de';

        // let locale = $.cookie('locale');
        // if(locale === undefined) {
        //     $.cookie('locale', this.locale);
        // }
        // this.locale = locale;

        // let urlParams = new URLSearchParams(window.location.search);
        // if(urlParams.has('lang')) {
        //     lang = urlParams.get('lang');
        // }

    },
    mounted() {

        const that = this;


        // this.getBanners();
        // this.getProductCategories();
        // this.getConfigurator(); // NOTE disabled
        // this.getPhotoWalls();
        // this.getNews();

        this.scroller();

        // const $owlCarousel = $('.owl-carousel');
        // if ( $owlCarousel.length ) {
        //     $(document).ready(function(){
        //         $owlCarousel.owlCarousel({
        //             items: 1,
        //             loop: true,
        //             nav: true,
        //             autoplay: true,
        //             autoplayTimeout:5000,
        //             autoplayHoverPause: true,
        //             video:true
        //         });
        //     });
        // }


        // const $albumCarousel = $('.album-carousel');
        // if ( $albumCarousel.length ) {
        //     $(document).ready(function(){
        //         $albumCarousel.owlCarousel({
        //             center: true,
        //             items: 1,
        //             loop: true,
        //             margin: 20,
        //             responsive: {
        //                 720: {
        //                     items: 3
        //                 }
        //             },
        //             nav: true
        //         });
        //     });
        // }

        if (window.CI360) {
            window.CI360.init();
        }
    },
    methods: {
        getLangData() {
            let self = this;
            let postData = {
                locale: lang
            };
            $.ajax({
                type: 'post',
                url: apiUrl + 'lang/getLangData',
                data: postData,
                success: function (data) {
                    self.lang = data.data;
                    // self.dataReady = true;
                },
                dataType: 'json'
            });
        },

        getConfigurator() {
            let self = this;
            let postData = {
                locale: lang
            };
            $.ajax({
                type: 'post',
                url: apiUrl + 'index/getConfigurator',
                data: postData,
                success: function (data) {
                    self.configurator = data.data;
                    // const options = self.configurator.filterItems
                    // for (const option of options) {
                    //     let innerText = option.name
                    //     if (innerText.includes('®')) {
                    //         option.name = innerText.replace('®', '<sup>®</sup>')
                    //     }
                    // }

                    self.configurator_products = self.configurator.products;
                    // 
                },
                dataType: 'json'
            });
        },

        getProductsByFilters(code, event) {
            // let self = this;

            // 
            // 


            // let postData = {
            //     locale: lang,
            //     categoryId: self.configurator.id,
            //     filterItemCodes: self.filterItems
            // };
            // $.ajax({
            //     type: 'post',
            //     url: apiUrl+'/index/getConfiguratorFilterItems',
            //     data: postData,
            //     success: function(data) {

            //         

            //         self.configurator_products = data.data;
            //         // self.configurator = data.data;
            //         //
            //         // 
            //     },
            //     dataType:'json'
            // });
        },

        toProductListPage(id) {
            $.cookie('filterItems', this.filterItems);
            window.location = 'product-list.php?id=' + id;
        },

        toBannerLink(url) {
            window.open(url);
        },

        mobileMenuSwitch() {
            this.status.mobileMenu = !this.status.mobileMenu;
            this.status.searchPanel = false;
        },

        desktopMenuSwitch() {
            this.status.desktopMenu = !this.status.desktopMenu;
            this.status.searchPanel = false;
        },

        searchPanelSwitch() {
            this.status.mobileMenu = false;
            this.status.desktopMenu = false;
            this.status.searchPanel = !this.status.searchPanel;
            this.$children[0].$refs.search.focus();
        },

        filterSwitch(event) {
            const hasActived = event.target.className.match(/is:on/);

            if (hasActived) {
                event.target.className = 'filter_label';
            } else {
                event.target.className = 'filter_label is:on';
            }
        },

        openFilter() {
            this.status.filterVisible = true;
        },

        closeFilter() {
            this.status.filterVisible = false;
        },

        productFeatureSwitch(id) {
            this.status.productFeature = +id;
        },

        accordionSwitch(event) {
            const hasActived = event.target.className.match(/is:on/);

            if (hasActived) {
                event.target.className = 'accordion_head';
            } else {
                event.target.className = 'accordion_head is:on';
            }
        },

        tabSwitch(content, target) {
            const $that = $(event.target);
            const $parent = $that.parent();
            const $btnElems = $parent.children('.js-tabBtn');
            const $contentElems = $(content);

            $btnElems.removeClass('is:on');
            $contentElems.removeClass('is:on');

            $that.addClass('is:on');
            $(target).addClass('is:on');
        },



        scroller() {
            const that = this;
            const $fx = $('.fxSection:not(.is\\:on)');
            const $tabBar = $('.productTabNav');
            const tabBarOffset = $tabBar.length ? $tabBar.offset() : null;

            function fx(window, st) {
                const $w = window;
                const wh = $w.outerHeight(true);
                const whh = wh * .75;
                const doc = $('body');

                if ($fx.length) {
                    $fx.each(function (index, item) {
                        const $item = $(item);
                        const offset = $item.offset();

                        if ((st + whh) >= offset.top) {
                            $item.addClass('is:on');
                        }
                    });

                    if (st >= (doc.outerHeight(true) - wh)) {
                        $fx.addClass('is:on');
                    }
                }

                if (tabBarOffset) {
                    if (st >= tabBarOffset.top) {
                        $tabBar.addClass('is:fixed');
                    } else {
                        $tabBar.removeClass('is:fixed');
                    }
                }
            }

            $(window).on('load scroll', function (e) {
                fx($(this), $(this).scrollTop());
            });
        },
    }
});