(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["index"],{

/***/ "./scripts/index.js":
/*!**************************!*\
  !*** ./scripts/index.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

jquery__WEBPACK_IMPORTED_MODULE_0___default()(function () {
  console.log("Complete ?");
  var firstinput = document.getElementById("firstinput");
  var lastinput = document.getElementById("lastinput"); // open address

  var openbutton = document.getElementById("modal-button");
  openbutton.addEventListener("click", openWindow);

  function openWindow() {
    document.getElementById("address-modal").style.display = "block";
    firstinput.focus();
  } // close address


  var closebutton = document.getElementById("closing-button");
  closebutton.addEventListener("click", closeWindow);

  function closeWindow() {
    document.getElementById("address-modal").style.display = "none";
    openbutton.focus();
  }

  var modal = document.querySelector(".base-modal");
  var modalOverlay = document.querySelector(".base-modal__backdrop");
  modal.addEventListener("keydown", trapTabKey);

  function trapTabKey(e) {
    if (e.keyCode === 9) {
      if (e.shiftKey && document.activeElement === closebutton) {
        e.preventDefault();
        lastinput.focus();
      } else if (!e.shiftKey && document.activeElement === lastinput) {
        e.preventDefault();
        closebutton.focus();
      }
    }
  }

  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("keydown", function (event) {
    if (event.key == "Escape") {
      closebutton.click();
    }
  });
});
/* Test click outside of forumal - No success
var modal = document.getElementById('address-modal');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
*/
// Test focus
//var focusedElementBeforeModal;

/***/ })

},[["./scripts/index.js","runtime","vendors~index"]]]);
//# sourceMappingURL=index.js.map