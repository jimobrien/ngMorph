# ngMorph #
 
## Morphable Elements ##
This directive is an attempt at packaging necessary transitions and properties that enable the reuse of visual elements through morphing.


## How to Get Started ##

  1. Include the module in your project: 
    ```
        angular.module('yourApp', ['ngMorph']);
    ```
  2. Start morphin'
    ```js
        app.controller('AppCtrl', function ($scope) {
          $scope.settings = {
            closeEl: '.close',
            template: {
              url: 'path/to/view.html'
            }
          }
        });
    ```
    ```html
      <button ng-morph-modal="settings"> Log In </button>
    ```

## Roadmap ##

There is a lot of work to do before this is ready for an alpha release. Following is a list of todos to get this repo in shape:

  - [X] Abstract functionality from the post-linking function of the `morphable` directive.
  - [X] ~~Refactor using ngAnimate and GSAP~~ (sticking with CSS transitions)
  - [ ] Add support for nested morphables (morphables within view templates)
  - [ ] Add different transitions (modal, screen overlay, expand (left, right, down, up))
