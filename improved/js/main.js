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
        this.getConfigurator();
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


        const $owlCarousel = $('.owl-carousel');
        if ($owlCarousel.length) {
            if (this.isMobile()) {
                $(document).ready(function () {
                    $owlCarousel.owlCarousel({
                        items: 1,
                        loop: true,
                        nav: true,
                        autoplay: true,
                        dots: false,
                        autoplayTimeout: 8000,
                        autoplayHoverPause: true,
                        video: true
                    });
                });
            } else {
                $(document).ready(function () {
                    $owlCarousel.owlCarousel({
                        items: 1,
                        loop: true,
                        nav: true,
                        autoplay: true,
                        // dots: false,
                        autoplayTimeout: 8000,
                        autoplayHoverPause: true,
                        video: true
                    });
                });
            }
        }

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
        isMobile() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        }

    }
});