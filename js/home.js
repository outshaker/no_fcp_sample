(function () {
  $(document).ready(function () {
    const productOwl = $(".productCarouselSection .owl-carousel");
    productOwl.owlCarousel({
      loop: true,
      items: 5,
      nav: false,
      dots: false,
      responsive: {
        768: {
          items: 4,
        },
        1024: {
          items: 5,
        },
      },
    });

    $(".product-carousel__nav--prev").click(function () {
      productOwl.trigger("prev.owl.carousel");
    });

    $(".product-carousel__nav--next").click(function () {
      productOwl.trigger("next.owl.carousel");
    });

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
        768: {
          items: 2,
        },
        1200: {
          items: 3,
        },
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
    });
  });
})();
