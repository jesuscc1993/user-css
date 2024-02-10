// ==UserScript==
// @name           SteamDB - Big game banners
// @description    Loads big game banners.
// @version        2024.02.10.19.54
// @author         MetalTxus
// @namespace      https://github.com/jesuscc1993

// @match          https://steamdb.info/sales/*
// @icon           https://steamdb.info/favicon.ico
// ==/UserScript==

/* globals jQuery */

(function() {
  'use strict';

  let waiting = true;

  const loadScriptStyle = () => {
    jQuery(style).appendTo('head');
  }

  const checkForLogos = () => {
    if (jQuery('.applogo img').length) {
      setTimeout(replaceLogos, 1000);

    } else {
      setTimeout(checkForLogos, 1000);
    }
  }

  const replaceLogos = () => {
    const logos = jQuery('.applogo img');

    if (logos.length) {
      logos.each((i, element) => {
        element.src = element.src.replace('capsule_sm_120', 'header');
      });
    }

    waiting = false;
  }

  const initialize = () => {
    jQuery(document).scroll(function() {
      if (!waiting) setTimeout(replaceLogos, 1000);
      waiting = true;
    });

    loadScriptStyle();
    checkForLogos();
  }

  const bannerWidth = 230;
  const bannerHeight = 108;

  const style = `<style>
    .applogo a,
    .applogo img {
      height: ${bannerHeight}px !important;
      width: ${bannerWidth}px !important;
      object-fit: cover;
    }

    .table-sales td:nth-child(3) {
      padding-left: ${bannerWidth - 98}px !important;
    }

    .table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
      background-color: transparent !important;
    }
  </style>`;

  initialize();
})();